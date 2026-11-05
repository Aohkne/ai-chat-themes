// Content script for the chat sites (sites.js). Reads the picked theme from chrome.storage.local (key "wt"), written by the popup:
// { id, look: { motion, speed, cell, veil }, off: [site ids], <site id>: { options } }. <html data-theme="<id>"> while a theme is on.
const root = document.documentElement;

const ok = c => /^#[0-9a-f]{6}$/i.test(c);
const rgb = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255);
const hex = c => '#' + c.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const hsl = ([r, g, b]) => {
  const hi = Math.max(r, g, b), lo = Math.min(r, g, b), l = (hi + lo) / 2, d = hi - lo;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  const h = !d ? 0 : hi === r ? ((g - b) / d + 6) % 6 : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return `${Math.round(h * 60)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
};
const luma = ([r, g, b]) => .2126 * r + .7152 * g + .0722 * b;

// The page is the person's logged-in Claude: a theme's CSS loads nothing from outside. Backslashes are refused
// because a CSS escape can spell url( past these checks.
const safe = css => typeof css === 'string' && css.length <= 200000 && !/\\/.test(css)
  && !/@import|image-set|expression\s*\(|-moz-binding|behavior\s*:|javascript:/i.test(css)
  && !/url\(\s*(?!['"]?data:)/i.test(css);

// The colors a theme works from, as hex, for the site adapters (sites.js) to spell in their own variables
const paletteOf = t => {
  const bg = rgb(t.bg), tx = rgb(t.text), ac = rgb(t.accent), at = (a, b, k) => hex(mix(a, b, k));
  return {
    bg: t.bg, text: t.text, accent: t.accent, wall: !!t.wallpaper, glass: t.vars?.['wall-glass'] ?? t.bg,
    s1: at(bg, tx, .03), s2: at(bg, tx, .06), s3: at(bg, tx, .09), line: at(bg, tx, .14),
    second: at(tx, bg, .35), muted: at(tx, bg, .55), hover: at(ac, tx, .15), tint: at(bg, ac, .15),
    on: luma(ac) > .55 ? '#000000' : '#ffffff',
  };
};

const varsOf = t => {
  const vars = [];
  if (ok(t.bg) && ok(t.text) && ok(t.accent)) {
    const c = paletteOf(t);
    vars.push(...SITE.vars(c));
    vars.push(['desktop-theme-backdrop', hex(mix(rgb(t.bg), rgb(t.text), .04))]);
  }
  if (typeof t.font === 'string' && /^[\w\s,"'-]{1,200}$/.test(t.font))
    for (const k of SITE.fonts) vars.push([k, t.font]);
  for (const [k, v] of Object.entries(t.vars ?? {}))
    if (/^[a-z][a-z0-9-]{0,80}$/.test(k) && typeof v === 'string' && v.length <= 500 && !/[;{}<>]/.test(v) && safe(v))
      vars.push([k, v]);
    else console.warn('claude-web-themes: var refused', k);
  return vars;
};

let mode;
// (not every data-mode: data-mode=code means something else)
const MODES = '[data-mode=light],[data-mode=dark],[data-mode=system]';
const syncMode = () => {
  for (const el of document.querySelectorAll(MODES)) {
    if (mode && el.dataset.mode !== mode) {
      if (el.dataset.mode !== el.getAttribute('data-theme-set-mode')) el.setAttribute('data-theme-was-mode', el.dataset.mode);
      el.dataset.mode = mode;
      el.setAttribute('data-theme-set-mode', mode);
    } else if (!mode && el.hasAttribute('data-theme-was-mode')) {
      el.dataset.mode = el.getAttribute('data-theme-was-mode');
      el.removeAttribute('data-theme-was-mode');
      el.removeAttribute('data-theme-set-mode');
    }
  }
};
let queued = false;
new MutationObserver(() => {
  if (queued || !mode) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; syncMode(); });
}).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-mode'] });

// The scene kit: what the scenes in scenes/ draw with
let CELL = 22;
const GLYPHS = 'St%;:X', LOOSE = ".:',o";
const hash = (a, b, c = 0) => {
  let h = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const glyph = (set, x, y, t) => set[Math.floor(hash(x, y, Math.floor(t * 1.2 + hash(y, x) * 7)) * set.length)];

const ell = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
const drift = (cols, f, t, v, w) => { const span = cols + w * 2; return ((f * span + t * v) % span) - w; };
const near = (x, y, fg, a = .3, odds = .5) => (hash(x, y, 3) < odds ? { fg, a } : undefined);
const twinkle = (x, y, t, fg, odds) => {
  const s = hash(x, y, 9);
  if (s < odds) return { ch: s < odds / 3 ? '+' : '.', fg, a: .2 + .5 * (.5 + .5 * Math.sin(t * (1 + s * 200) + s * 1000)) };
};
const rising = (x, y, t, v, odds) => hash(x, Math.floor(y + t * v), 11) < odds;

const sketch = (w, h, parts) => {
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  for (const [r, c, s] of parts) [...s].forEach((ch, i) => { if (ch !== ' ' && g[r]?.[c + i]) g[r][c + i] = ch; });
  return g.map(r => r.join(''));
};
const shape = (w, h, at) => Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => at(x, y)).join(''));
const flip = art => art.map(r => [...r].reverse().join(''));
const frame = (frames, t, rate, phase = 0) => frames[Math.floor(t * rate + phase) % frames.length];
const shade = (c, k) => hex(mix(rgb(c), k > 0 ? [1, 1, 1] : [0, 0, 0], Math.abs(k)));
const tint = (bg, fg, alphas) => Object.fromEntries(alphas.map((a, i) => [String(i + 1), { bg, fg, a }]));
const halos = new WeakMap();
const haloOf = art => {
  if (!halos.has(art)) {
    const on = (x, y) => (art[y]?.[x] ?? '.') !== '.', out = [];
    for (let y = -1; y <= art.length; y++)
      for (let x = -1; x <= art[0].length; x++)
        if (!on(x, y) && [-1, 0, 1].some(i => [-1, 0, 1].some(j => on(x + i, y + j))) && hash(x + 50, y + 50, 5) < .45) out.push([x, y]);
    halos.set(art, out);
  }
  return halos.get(art);
};

// Each scenes/<id>.js adds SCENES['<id>']
const SCENES = {};
