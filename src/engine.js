// the sidebar: a tall, narrow element, from SITE.sidebar if that finds one, else by shape: the widest such ancestor
// of whatever sits at the window's left edge
const tall = el => {
  const r = el.getBoundingClientRect();
  return r.width > 40 && r.width < innerWidth * .4 && r.height > innerHeight * .5;
};
const sidebar = () => {
  const named = [...document.querySelectorAll(SITE.sidebar)].find(tall);
  if (named) return named;
  let best;
  for (let el = document.elementsFromPoint(24, innerHeight / 2)[0]; el && el !== document.body && el !== root; el = el.parentElement)
    if (tall(el)) best = el;
  return best;
};
let SIDE = 0; // the sidebar's width in cells: scenes keep their sprites clear of it
const DIM = .25, column = () => {
  SIDE = Math.round((sidebar()?.getBoundingClientRect().right ?? 0) / CELL);
  // best effort: the prompt box's column (the site's DOM is not ours; adjust SITE.composer in sites.js if it changes)
  const box = document.querySelector(SITE.composer)
    ?? document.querySelector('[contenteditable=true], textarea')?.closest('form, fieldset, div');
  const r = box?.getBoundingClientRect();
  return r?.width ? [r.left, r.right] : undefined;
};
const keep = (col, px) => {
  if (!col) return 1;
  const inside = Math.min(px - col[0], col[1] - px);
  return 1 - (1 - DIM) * Math.max(0, Math.min(1, (inside + CELL) / (3 * CELL)));
};

const put = (w, px, py, c, sx, sy) => {
  const { ctx } = w;
  ctx.globalAlpha = Math.max(0, Math.min(1, c.a)) * Math.max(c.floor ?? 0, keep(w.veil ? undefined : w.col, px + CELL / 2));
  if (ctx.globalAlpha < .01) return;
  if (c.bg) {
    ctx.fillStyle = c.bg;
    ctx.beginPath();
    ctx.roundRect(px + 2, py + 2, CELL - 4, CELL - 4, 3);
    ctx.fill();
  }
  ctx.fillStyle = c.fg;
  ctx.fillText(c.ch ?? glyph(c.bg ? GLYPHS : LOOSE, sx, sy, w.time), px + CELL / 2, py + CELL / 2 + 1);
};

const draw = w => {
  const { ctx, scene, time: t } = w, W = innerWidth, H = innerHeight, cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
  const now = performance.now();
  if (!(now - w.measured < 1000)) { w.col = column(); w.measured = now; }
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(160, 180, 255, .05)';
  ctx.beginPath();
  for (let x = 0; x <= cols; x++) { ctx.moveTo(x * CELL + .5, 0); ctx.lineTo(x * CELL + .5, H); }
  for (let y = 0; y <= rows; y++) { ctx.moveTo(0, y * CELL + .5); ctx.lineTo(W, y * CELL + .5); }
  ctx.stroke();
  if (scene.cell)
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const c = scene.cell(x, y, cols, rows, t);
        if (c) put(w, x * CELL, y * CELL, c, x, y);
      }
  for (const s of scene.sprites?.(cols, rows, t) ?? []) {
    const ox = (w.grid ? Math.round(s.x) : s.x) * CELL, oy = (w.grid ? Math.round(s.y) : s.y) * CELL;
    const m = s.a ?? 1, k = s.key * 997;
    const bw = s.art ? s.art[0].length : s.w, bh = s.art ? s.art.length : s.h;
    if (ox > W + CELL * 4 || oy > H + CELL * 4 || ox + (bw + 4) * CELL < 0 || oy + (bh + 4) * CELL < 0) continue;
    if (s.glow) {
      const g = s.glow, cx = ox + bw / 2 * CELL, cy = oy + bh / 2 * CELL, r = g.r * CELL;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, g.color);
      grad.addColorStop(1, `${g.color}00`);
      ctx.globalAlpha = Math.min(1, g.a * keep(w.veil ? undefined : w.col, cx));
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.globalCompositeOperation = 'source-over';
    }
    const cells = [];
    if (s.art) s.art.forEach((row, gy) => { for (let gx = 0; gx < row.length; gx++) if (s.pal[row[gx]]) cells.push([gx, gy, s.pal[row[gx]], gx + k, gy]); });
    else
      for (let gy = 0; gy < s.h; gy++)
        for (let gx = 0; gx < s.w; gx++) {
          const f = s.field(gx, gy);
          if (f) cells.push([gx, gy, f.c, (f.sx ?? gx) + k, f.sy ?? gy]);
        }
    if (s.shadow)
      for (const [gx, gy, c] of cells)
        if (c.bg) put(w, ox + (gx + .8) * CELL, oy + (gy + .8) * CELL, { bg: s.shadow, fg: s.shadow, ch: '', a: .4 * m }, 0, 0);
    if (s.halo && s.art)
      for (const [gx, gy] of haloOf(s.art))
        put(w, ox + gx * CELL, oy + gy * CELL, { fg: s.halo, a: .3 * m }, gx + k, gy);
    for (const [gx, gy, c, sx, sy] of cells) put(w, ox + gx * CELL, oy + gy * CELL, m === 1 ? c : { ...c, a: c.a * m }, sx, sy);
  }
  if (w.col && w.veil) {
    const [l, r] = [w.col[0] - CELL * 2, w.col[1] + CELL * 2], g = ctx.createLinearGradient(l, 0, r, 0), f = CELL / (r - l);
    g.addColorStop(0, `${w.bg}00`);
    g.addColorStop(f, w.bg);
    g.addColorStop(1 - f, w.bg);
    g.addColorStop(1, `${w.bg}00`);
    ctx.globalAlpha = w.veil;
    ctx.fillStyle = g;
    ctx.fillRect(l, 0, r - l, H);
  }
};

let wall;
const stopWall = () => {
  if (!wall) return;
  cancelAnimationFrame(wall.raf);
  removeEventListener('resize', wall.size);
  wall.canvas.remove();
  wall = undefined;
};
const startWall = name => {
  const scene = Object.hasOwn(SCENES, name) ? SCENES[name] : undefined;
  if (wall && wall.name === name && wall.scene === scene) return; // (an edited scene of the person's comes as a new object)
  stopWall();
  if (!scene) return;
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.id = 'desktop-theme-wallpaper';
  canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:-1';
  const w = wall = { name, scene, canvas, ctx, time: 0, last: 0, raf: 0 };
  w.size = () => {
    const dpr = devicePixelRatio || 1;
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `bold ${Math.round(CELL * 13 / 22)}px ui-monospace, Menlo, Consolas, 'Cascadia Code', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    w.measured = 0;
    draw(w);
  };
  addEventListener('resize', w.size);
  document.documentElement.append(canvas); // (not in body: the page's own framework manages that)
  w.size();
  if (calm()) return;
  const frame = now => {
    w.raf = requestAnimationFrame(frame);
    if (now - w.last < 33) return;
    w.time += (w.last ? Math.min(now - w.last, 250) / 1000 : 0) * (w.speed ?? 1) * (root.dataset.themeState === 'thinking' ? 3 : 1);
    w.last = now;
    draw(w);
  };
  w.raf = requestAnimationFrame(frame);
};

const paint = t => {
  try {
    const most = Object.hasOwn(SCENES, t.wallpaper) ? SCENES[t.wallpaper].size : undefined;
    const cell = Math.min([14, 18, 22].includes(t.cell) ? t.cell : 22, most ?? 22);
    if (cell !== CELL) { CELL = cell; wall?.size(); }
    startWall(t.wallpaper);
    if (wall) {
      wall.grid = t.motion === 'grid';
      wall.veil = typeof t.veil === 'number' && ok(t.bg) ? Math.max(0, Math.min(1, t.veil)) : 0;
      wall.bg = t.bg;
      wall.speed = typeof t.speed === 'number' ? Math.max(.1, Math.min(16, t.speed)) : 1;
      draw(wall); // (under reduced motion no frame loop runs to show the new settings)
    }
  } catch (err) {
    console.warn('claude-web-themes: the wallpaper failed', err);
  }
  surfaces();
  document.getElementById('desktop-theme')?.remove();
  const vars = varsOf(t), css = t.css ?? '';
  mode = ok(t.bg) && ok(t.text) && ok(t.accent) ? (luma(rgb(t.bg)) > .5 ? 'light' : 'dark') : undefined;
  syncMode();
  SITE.mode(mode);
  if (css && !safe(css)) console.warn('claude-web-themes: the theme\'s css was refused (it loads from outside the page)');
  const text = (vars.length ? `*{${vars.map(([k, v]) => `--${k}:${v} !important`).join(';')}}\n` : '') + (safe(css) ? css : '');
  if (typeof t.id === 'string' && /^[a-z0-9-]{1,40}$/.test(t.id) && text) root.dataset.theme = t.id;
  else delete root.dataset.theme;
  if (!text) return;
  const style = document.createElement('style');
  style.id = 'desktop-theme';
  style.textContent = text;
  document.head.append(style); // (last: after Claude's own sheets)
};

// The sidebar as frosted glass over the wallpaper. the site's classes are not ours, so it is found by shape: the <nav>
// and the elements at a few points down its edge, each with its ancestors no wider than the sidebar (their
// backgrounds are what hides the wallpaper). The outermost gets the glass, the rest turn transparent.
const GLASS = 'data-wt-glass';
const glass = () => {
  const tagged = [...document.querySelectorAll(`[${GLASS}]`)];
  const nav = wall && sidebar();
  const box = nav?.getBoundingClientRect();
  if (!box) {
    for (const el of tagged) el.removeAttribute(GLASS);
    return;
  }
  const x = box.right - 6, edge = new Set();
  const climb = from => {
    const chain = [];
    for (let el = from; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.getBoundingClientRect().width > box.width + 24) break;
      chain.push(el);
    }
    return chain;
  };
  const chains = [climb(nav), ...[8, 40, innerHeight / 2, innerHeight - 8].map(y => climb(document.elementsFromPoint(x, y)[0]))];
  for (const chain of chains) for (const el of chain) edge.add(el);
  for (const el of tagged) if (!edge.has(el)) el.removeAttribute(GLASS);
  for (const el of edge) {
    const want = edge.has(el.parentElement) ? 'in' : 'root';
    if (el.getAttribute(GLASS) !== want) el.setAttribute(GLASS, want);
  }
};

// The big opaque surfaces that hide the wallpaper, found by what is painted at a few points of the window (a site's
// own class names do not matter): anything that covers a good part of the window with a background turns transparent.
const CLEAR = 'data-wt-clear';
// dialogs, menus and popovers keep their backgrounds: by role, or by being fixed above the page (a z-index)
const OVERLAY = '[role=dialog], [role=alertdialog], [role=menu], [role=listbox], [role=tooltip], [aria-modal=true], dialog, '
  + '[data-radix-popper-content-wrapper], [data-radix-portal]';
const overlaid = el => {
  if (el.closest(OVERLAY)) return true;
  for (let a = el; a && a !== document.body; a = a.parentElement) {
    const s = getComputedStyle(a);
    if (s.position === 'fixed' && s.zIndex !== 'auto' && +s.zIndex > 0) return true;
  }
  return false;
};
const clearCovers = () => {
  for (const el of document.querySelectorAll(`[${CLEAR}]`)) if (!wall || overlaid(el)) el.removeAttribute(CLEAR);
  if (!wall) return;
  const area = innerWidth * innerHeight;
  for (const [fx, fy] of [[.7, .12], [.7, .88], [.96, .5], [.5, .5]])
    for (const el of document.elementsFromPoint(innerWidth * fx, innerHeight * fy)) {
      if (el === root || el.hasAttribute(CLEAR) || el.id === 'desktop-theme-wallpaper') continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < area * .4 || overlaid(el)) continue;
      const s = getComputedStyle(el);
      if (!/^(transparent|rgba\(.*,\s*0\)|.*\/\s*0\))$/.test(s.backgroundColor) || s.backgroundImage !== 'none')
        el.setAttribute(CLEAR, '');
    }
};

const surfaces = () => {
  try {
    glass();
    clearCovers();
  } catch (err) {
    console.warn('claude-web-themes: surfaces', err);
  }
};
setInterval(surfaces, 1000);

const fade = document.createElement('style');
fade.id = 'desktop-theme-fade';
fade.textContent = 'html.desktop-theme-switching::view-transition-old(root),'
  + 'html.desktop-theme-switching::view-transition-new(root){animation-duration:.6s}';
document.head.append(fade);
const calm = () => root.dataset.reduceMotion === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches;
let painted = false;
const apply = t => {
  if (!painted || !document.startViewTransition || calm()) paint(t);
  else {
    root.classList.add('desktop-theme-switching');
    document.startViewTransition(() => paint(t)).finished
      .finally(() => root.classList.remove('desktop-theme-switching'));
  }
  painted = true;
};

// The picked theme comes from the popup through chrome.storage.local; a theme is a THEMES entry plus its look.
// Sites listed in `off` keep their own look
const LOOK = { motion: 'grid', speed: 4, cell: 14, veil: .4 };
const resolve = s => {
  const base = THEMES.find(t => t.id === s?.id);
  return base && base.bg ? { ...base, ...LOOK, ...s.look } : {};
};
// the site's own options from the popup (state[SITE.id]), in their own sheet
const extras = o => {
  let el = document.getElementById('desktop-theme-extras');
  const css = (o && typeof o === 'object' && SITE.extras?.(o)) || '';
  if (!css) return el?.remove();
  el ??= document.head.appendChild(Object.assign(document.createElement('style'), { id: 'desktop-theme-extras' }));
  el.textContent = css;
};
let last;
const sync = s => {
  const on = !(Array.isArray(s?.off) && s.off.includes(SITE.id));
  extras(on ? s?.[SITE.id] : undefined);
  const key = JSON.stringify(on ? [s?.id, s?.look] : null); // (toggling another site repaints nothing here)
  if (key === last) return;
  last = key;
  const t = on ? resolve(s) : {};
  apply(t.bg ? { ...t, css: pageCss(t) } : t);
};
const KEY = 'wt';
chrome.storage.local.get(KEY, r => sync(r[KEY]));
chrome.storage.onChanged.addListener(ch => { if (ch[KEY]) sync(ch[KEY].newValue); });
