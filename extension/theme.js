// Built by tools/build.mjs from src/: edit there, then build.
(() => {
  // The themes, shared by the content script (theme.js) and the popup. Plain script: no imports, so both can load it.
  // A theme: { id, name, tagline, bg, text, accent, font?, vars?, wallpaper? }; "claude" (the id is kept for saved choices) has no colors and turns the mod off.

  const bands = (a, sky) => {
    const w = k => `rgba(255, 255, 255, ${+(a * k).toFixed(3)})`;
    return `linear-gradient(90deg, ${w(0)} 16%, ${w(1)} 25%, ${w(0)} 35%, ${w(0)} 66%, ${w(.7)} 77%, ${w(0)} 88%), ${sky}`;
  };

  const live = (id, name, tagline, [bg, text, accent], sky, glass, rim) => ({
    id, name, tagline, bg, text, accent, wallpaper: id,
    vars: { 'wall-sky': sky, 'wall-halo': bg, 'wall-glass': glass, 'wall-rim': rim },
  });

  const THEMES = [
    { id: 'claude', name: 'Default', tagline: "The site's own look" },
    { id: 'sunset-cloud', name: 'Sunset Cloud', tagline: 'A violet dusk with a coral glow', bg: '#2b2030', text: '#f7e8e2', accent: '#ff8a6b' },
    { id: 'sakura', name: 'Sakura', tagline: 'Soft pink paper, rose accents', bg: '#fff4f6', text: '#4b2a35', accent: '#e0567f' },
    { id: 'terminal', name: 'Terminal', tagline: 'A green phosphor tube', bg: '#0a110c', text: '#b9f6c6', accent: '#39e87a',
      font: "ui-monospace, Menlo, 'Cascadia Code', Consolas, monospace" },
    { id: 'night-sea', name: 'Night Sea', tagline: 'Deep blue, for long nights of code', bg: '#0f1a2c', text: '#dce6fa', accent: '#5aaeff' },
    { id: 'old-paper', name: 'Old Paper', tagline: 'Ivory grain and ink, like an old book', bg: '#f2e9d6', text: '#3a2f22', accent: '#a5522c',
      font: "Georgia, 'Times New Roman', serif" },
    live('moonlit', 'Moonlit', 'A crescent moon, drifting clouds, twinkling stars',
      ['#0d1530', '#dbe2f5', '#d9c98f'], 'radial-gradient(120% 90% at 75% 10%, #1a2a5e, #0d1530 60%, #090f24)',
      'rgba(22, 32, 70, .6)', 'rgba(217, 201, 143, .3)'),
    live('clawd', 'Clawd', 'A turning orange spark, drifting embers, Clawd on patrol',
      ['#1f1714', '#f2e6df', '#d97757'], bands(.04, 'radial-gradient(90% 80% at 70% 30%, #3a2219, #1f1714 55%, #150f0d)'),
      'rgba(46, 30, 24, .65)', 'rgba(217, 119, 87, .3)'),
    live('cloud-drift', 'Cloud Drift', 'White clouds over a bright sky, birds gliding by',
      ['#d8ecfa', '#1d3447', '#2f78bd'], bands(.22, 'linear-gradient(#4fa3e8, #86c3f0 55%, #b6dbf6)'),
      'rgba(255, 255, 255, .6)', 'rgba(47, 120, 189, .3)'),
    live('honu-lagoon', 'Honu Lagoon', 'A sea turtle swimming across a lagoon',
      ['#0f3a44', '#e3f6f2', '#5fd0b8'], bands(.14, 'linear-gradient(#35a6f0, #1d7ad8 45%, #1650b2)'),
      'rgba(15, 58, 68, .6)', 'rgba(95, 208, 184, .3)'),
    live('koi-pond', 'Koi Pond', 'Koi circling a pond between lily pads',
      ['#11332d', '#e4f2ea', '#ef8a4a'], bands(.12, 'linear-gradient(175deg, #4aa08c, #2f8070 50%, #1f6156)'),
      'rgba(17, 51, 45, .6)', 'rgba(239, 138, 74, .3)'),
    live('jellyfish', 'Jellyfish', 'Jellyfish rising through deep water',
      ['#0a1830', '#dfe7fb', '#a58cf0'], bands(.07, 'linear-gradient(#174784, #0c2b58 50%, #071a3a)'),
      'rgba(12, 28, 58, .6)', 'rgba(165, 140, 240, .3)'),
    live('lantern-night', 'Lantern Night', 'Paper lanterns drifting down a river at night',
      ['#0b1424', '#efe6d2', '#f2a541'], 'linear-gradient(#070c1c, #24305e 29%, #0e1a30 30%, #08111f 60%, #050a14)',
      'rgba(11, 20, 36, .6)', 'rgba(242, 165, 65, .3)'),
    live('fireflies', 'Fireflies', 'Fireflies wandering and blinking over tall grass',
      ['#0b130e', '#e3eedc', '#d8e86a'], bands(.03, 'radial-gradient(120% 80% at 50% 110%, #1b3522, #0c1710 60%, #070c09)'),
      'rgba(14, 26, 18, .65)', 'rgba(216, 232, 106, .28)'),
    live('neon-rain', 'Neon Rain', 'Rain over a city at night, neon signs buzzing',
      ['#0c1020', '#e3e8f6', '#ff5fa2'], 'linear-gradient(#05070f, #0b1024 40%, #1e1838 75%, #34203f)',
      'rgba(12, 16, 32, .6)', 'rgba(255, 95, 162, .3)'),
    live('sakura-dusk', 'Sakura Dusk', 'Cherry branches, petals drifting through a violet evening',
      ['#231a2e', '#f6e9f0', '#f29bb8'], 'linear-gradient(#17112b, #2a1c44 40%, #523058 72%, #8c4a5e)',
      'rgba(35, 26, 46, .6)', 'rgba(242, 155, 184, .3)'),
    live('snow-cabin', 'Snow Cabin', 'A log cabin under snowy peaks, smoke curling into falling snow',
      ['#0e1628', '#e6edf8', '#ffb85c'], 'linear-gradient(#060b18, #101c38 55%, #1c2a4a)',
      'rgba(14, 22, 40, .6)', 'rgba(255, 184, 92, .3)'),
    live('star-voyage', 'Star Voyage', 'A little rocket passing a ringed planet',
      ['#0d0a1f', '#e6ecff', '#ff6fb5'], 'radial-gradient(110% 90% at 85% 20%, #2a1a52, #120d2e 50%, #08061a)',
      'rgba(16, 12, 40, .6)', 'rgba(255, 111, 181, .3)'),
  ];

  // One adapter per chat site: what is specific to its page. Everything else (engine, scenes, popup) is shared.
  //   hosts     hostnames the adapter is for
  //   sidebar   selector of the sidebar (shape-checked in glass(): a narrow element is the sidebar)
  //   composer  selector of the prompt box (the wallpaper dims around its column, and it gets a glass look)
  //   vars(c)   the site's own color variables for a palette c (see core.js, paletteOf); [name, value] pairs
  //   hide      selectors that must turn transparent for a wallpaper to show
  //   halo      selectors of the message text, given a soft outline for reading over a wallpaper
  //   wallCss   extra CSS for a wallpaper (optional)
  //   mode(m)   makes the page's own light/dark switch follow the theme ('dark', 'light', or undefined to give it back)
  // The selectors and variable names are best effort against each site's DOM, which is not ours: when a site
  // changes, this file is where to look.

  const flips = new Map();
  const flipClass = (el, dark, light, m) => {
    if (!el) return;
    if (m && !flips.has(el)) flips.set(el, [el.classList.contains(dark), el.classList.contains(light)]);
    if (m) {
      el.classList.toggle(dark, m === 'dark');
      el.classList.toggle(light, m === 'light');
    } else if (flips.has(el)) {
      const [d, l] = flips.get(el);
      el.classList.toggle(dark, d);
      el.classList.toggle(light, l);
      flips.delete(el);
    }
    root.style.colorScheme = m ?? '';
  };

  const SITES = [
    {
      id: 'claude', hosts: ['claude.ai'],
      sidebar: 'nav', composer: 'fieldset, [data-testid=chat-input]',
      hide: 'main',
      halo: '.font-claude-response, .font-user-message, [data-testid=user-message]',
      vars: c => {
        const cds = {
          'page-bg': c.bg, 'surface-0': c.bg, 'surface-1': c.s1, 'surface-2': c.s2, 'surface-3': c.s3,
          'neutral-900': c.text, 'neutral-600': c.second, 'neutral-400': c.muted,
          'text-primary': c.text, 'undimmed-text-primary': c.text,
          'text-secondary': c.second, 'undimmed-text-secondary': c.second, 'text-stays-secondary': c.second, 'undimmed-text-stays-secondary': c.second,
          'text-muted': c.muted, 'undimmed-text-muted': c.muted,
          'role-accent-450': c.accent, 'role-accent-fill': c.accent, 'fill-accent': c.accent, 'text-accent': c.accent,
          'clay': c.accent, 'clay-emphasized': c.accent, 'fill-brand': c.accent,
          'role-accent-400': c.hover, 'role-accent-fill-hover': c.hover, 'fill-accent-hover': c.hover, 'fill-brand-hover': c.hover,
          'role-accent-on': c.on, 'on-accent': c.on, 'on-brand': c.on,
          'bg-accent': c.tint, 'role-accent-100': c.tint, 'role-accent-800': c.tint,
        };
        const bg = rgb(c.bg), tx = rgb(c.text), ac = rgb(c.accent), vars = Object.entries(cds).map(([k, v]) => [`cds-${k}`, v]);
        // ponytail: one ramp for light and dark themes; Claude's own differ by mode, so some parts may look flat
        [.06, 0, .03, .05, .08, .1].forEach((k, i) => vars.push([`bg-${i}00`, hsl(mix(bg, tx, k))]));
        [0, 0, .25, .25, .5, .5].forEach((k, i) => vars.push([`text-${i}00`, hsl(mix(tx, bg, k))]));
        for (const k of ['accent-brand', 'brand-100', 'accent-000', 'accent-100', 'accent-200']) vars.push([k, hsl(ac)]);
        return vars;
      },
      fonts: ['cds-font-sans', 'cds-font-sans-display', 'font-anthropic-sans', 'font-anthropic-serif', 'font-sans'],
      mode: () => {},
    },
    {
      id: 'chatgpt', hosts: ['chatgpt.com', 'chat.openai.com'],
      sidebar: '#stage-slideover-sidebar, nav', composer: 'form[data-type=unified-composer], #thread-bottom-container form',
      hide: 'body, #__next, main, #page-header, #thread-bottom-container',
      halo: '[data-message-author-role]',
      vars: c => {
        // opaque even over a wallpaper: menus and dialogs draw with these, and the page itself is cleared by hide and
        // clearCovers (engine.js); the sidebar and the prompt box get their glass from glass() and the composer rule
        const page = c.bg, side = c.s1, box = c.s2;
        return Object.entries({
          'main-surface-primary': page, 'main-surface-background': page, 'bg-primary': page, 'surface-primary': page,
          'main-surface-secondary': box, 'main-surface-tertiary': c.s3, 'bg-secondary': c.s1, 'bg-tertiary': c.s2,
          'bg-elevated-primary': c.s2, 'bg-elevated-secondary': c.s3, 'surface-secondary': c.s1, 'surface-tertiary': c.s2,
          'sidebar-surface-primary': side, 'sidebar-surface-secondary': c.s2, 'sidebar-surface-tertiary': c.s3,
          'composer-surface': box, 'composer-surface-primary': box,
          'text-primary': c.text, 'text-secondary': c.second, 'text-tertiary': c.muted, 'text-quaternary': c.muted,
          'border-default': c.line, 'border-light': c.line, 'border-medium': c.line, 'border-heavy': c.muted, 'border-xlight': c.line,
          'link': c.accent, 'text-accent': c.accent,
        });
      },
      fonts: ['font-sans', 'default-font'],
      mode: m => flipClass(document.documentElement, 'dark', 'light', m),
    },
    {
      id: 'gemini', hosts: ['gemini.google.com'],
      sidebar: 'bard-sidenav, side-navigation-content, mat-sidenav', composer: 'input-area-v2, input-container, .input-area-container',
      hide: 'body, bard-sidenav-container, bard-sidenav-content, mat-sidenav-content, chat-window, main, .chat-container',
      halo: 'user-query, message-content, .query-text, .markdown',
      vars: c => {
        // opaque even over a wallpaper: menus and dialogs draw with these, and the page itself is cleared by hide and
        // clearCovers (engine.js); the sidebar and the prompt box get their glass from glass() and the composer rule
        const page = c.bg, side = c.s1, box = c.s2;
        const sys = Object.entries({
          'surface': page, 'background': page, 'surface-dim': page, 'surface-bright': page, 'surface-container-lowest': page,
          'surface-container-low': side, 'surface-container': side, 'surface-container-high': box, 'surface-container-highest': box,
          'on-surface': c.text, 'on-background': c.text, 'on-surface-variant': c.second,
          'primary': c.accent, 'on-primary': c.on, 'primary-container': c.tint, 'on-primary-container': c.text,
          'outline': c.muted, 'outline-variant': c.line, 'secondary-container': c.tint, 'on-secondary-container': c.text,
        });
        return [...sys.map(([k, v]) => [`gem-sys-color--${k}`, v]), ...sys.map(([k, v]) => [`mat-sys-${k}`, v]),
          ['bard-color-sidenav-background-desktop', side], ['bard-color-surface', page], ['bard-color-text-primary', c.text]];
      },
      fonts: ['gem-sys-typescale-font-family', 'google-sans'],
      mode: m => flipClass(document.body, 'dark-theme', 'light-theme', m),
    },
    {
      id: 'zalo', hosts: ['chat.zalo.me'],
      // #sidebarNav holds the icon rail (#main-tab) and the conversation list; the chat itself is <main>
      sidebar: '#sidebarNav', composer: '#chat-box-input-container-id',
      hide: 'body, #app, #app-page, #container, main, #header, #chatViewContainer, #chatView, '
        + '#chat-box-bar-id, #chatInput, [class*=message-view__blur__overlay]',
      halo: '.text-message__container',
      // the conversation list paints every row with the page color: clear the rows (keeping hover and selection)
      // so the sidebar's glass shows the wallpaper like the chat side
      wallCss: `
  #sidebarNav .msg-item, #sidebarNav .msg-filters-bar,
  #sidebarNav .conv-item:not(:hover):not([class*=selected]):not([class*=active]) { background: transparent !important; }
  #sidebarNav .conv-item:hover:not([class*=selected]):not([class*=active]) { background: color-mix(in srgb, var(--layer-background-hover) 55%, transparent) !important; }
  #sidebarNav #contact-search-input { background: color-mix(in srgb, var(--input-field-bg-filled) 55%, transparent) !important; }`,
      vars: c => {
        // Zalo's design tokens (same names in its light and dark sets, on <body>; dark is body.dark)
        const page = c.bg, side = c.s1, box = c.s2;
        return Object.entries({
          'surface-background': side, 'surface-alt': page, 'surface-background-subtle': page, 'surface-background-overlay': page,
          'layer-background': page, 'layer-background-CSC': page, 'layer-background-subtle': side, 'bg-default': page,
          'layer-background-navbar-normal': side, 'layer-background-navbar-sublevel-normal': page,
          'layer-background-leftmenu': side, 'layer-background-hover': c.s2, 'layer-background-leftmenu-hover': c.s2,
          'layer-background-navbar-hover': c.s2, 'layer-background-navbar-sublevel-hover': c.s2,
          'layer-background-selected': c.tint, 'layer-background-leftmenu-selected': c.tint,
          'layer-background-navbar-selected': c.tint, 'layer-background-navbar-sublevel-selected': c.tint,
          'blue-message': c.tint, 'blue-message-selected': c.tint, 'layer-accent-message': c.tint,
          'white-message': box, 'white-message-selected': c.s3, 'white-quote': c.s3, 'white-quote-selected': c.s3,
          'input-field-bg-filled': box, 'input-field-bg-outline': box,
          'input-field-bg-filled-hover': c.s3, 'input-field-bg-outline-hover': c.s3,
          'text-primary': c.text, 'icon-primary': c.text, 'text-navbar-sublevel-normal': c.text, 'text-navbar-sublevel-selected': c.text,
          'text-secondary': c.second, 'icon-secondary': c.second, 'tab-txt': c.second, 'icon-navbar-normal': c.second,
          'text-placeholder': c.muted, 'text-disabled': c.muted,
          'text-information': c.accent, 'text-mention': c.accent, 'link': c.accent, 'border-focused': c.accent,
          'icon-navbar-sublevel-normal': c.accent, 'icon-navbar-sublevel-selected': c.accent,
          'button-primary-normal': c.accent, 'button-primary-hover': c.hover, 'button-primary-pressed': c.hover,
          'button-primary-text': c.on,
          'border': c.line, 'border-subtle': c.line,
        });
      },
      fonts: [],
      mode: m => flipClass(document.body, 'dark', 'light', m),
    },
  ];

  const SITE = SITES.find(s => s.hosts.some(h => location.hostname === h || location.hostname.endsWith(`.${h}`))) ?? SITES[0];

  // CSS added to the page for a theme. No url(), @import or backslashes: the content script refuses those (core.js, safe()).
  const pageCss = t => `
  ::selection { background: ${t.accent}; color: ${t.bg}; }
  ::-webkit-scrollbar { width: 9px; height: 9px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${t.accent}66; border-radius: 9px; }
  ${t.wallpaper ? `
  html { background: var(--wall-sky) fixed !important; }
  ${SITE.hide} { background: transparent !important; }
  ${SITE.halo} { text-shadow: 0 0 3px var(--wall-halo), 0 0 6px var(--wall-halo), 0 0 10px var(--wall-halo); }
  ${SITE.composer} { background: var(--wall-glass) !important; backdrop-filter: blur(6px); }
  [data-wt-clear] { background: transparent !important; background-image: none !important; }
  ${SITE.wallCss ?? ''}
  [data-wt-glass] { background: transparent !important; }
  [data-wt-glass=root] {
    background: var(--wall-glass) !important; border-right: 1px solid var(--wall-rim) !important;
    backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
  }
  ` : ''}`;

  // Content script for the chat sites (sites.js). Reads the picked theme from chrome.storage.local (key "wt"), written by the popup:
  // { id, look: { motion, speed, cell, veil }, off: [site ids] }. <html data-theme="<id>"> while a theme is on.
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

  {
    const CLAWD = ['.#######.', '.#o###o#.', '#########', '.#######.'];
    const CLAWDS = [[...CLAWD, '.#.#.#.#.'], [...CLAWD, '#.#.#.#..']];

    SCENES.clawd = {
      cell: (x, y, cols, rows, t) => {
        const cx = cols * .8, cy = rows * .3;
        let cover = 0, glow = false;
        for (const [sx, sy] of [[.25, .25], [.75, .25], [.25, .75], [.75, .75]]) {
          const dx = x + sx - cx, dy = y + sy - cy, r = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
          if (r <= 1.2) { cover++; continue; }
          for (let k = 0; k < 11; k++) {
            let da = Math.abs(ang - (k * Math.PI * 2 / 11 + t * .04)) % (Math.PI * 2);
            da = Math.min(da, Math.PI * 2 - da);
            if (da >= Math.PI / 2) continue;
            const len = 6.5 + 5 * hash(k, 1) + Math.sin(t * 1.4 + k) * .7, along = r * Math.cos(da), off = r * Math.sin(da);
            if (along <= len && off <= .35 + .55 * (1 - along / len) ** .7) { cover++; break; }
            if (along <= len + 1.2 && off <= 1.6) glow = true;
          }
        }
        if (cover >= 2) return { bg: '#d97757', fg: '#3b1d12', a: (.55 + .1 * cover) * (1 - .35 * Math.min(1, Math.hypot(x + .5 - cx, y + .5 - cy) / 12)), floor: .6 };
        if (glow) return near(x, y, '#e9a083', .25, .3);
        if (rising(x, y, t, 1.2, .006)) return { ch: '.', fg: '#e9a083', a: .5 };
        const s = hash(x, y, 13);
        if (s < .008) return { ch: '<>()=$/*'[Math.floor(s * 1000) % 8], fg: '#d97757', a: .15 + .3 * (.5 + .5 * Math.sin(t * 1.3 + s * 900)) };
      },
      sprites: (cols, rows, t) => {
        const lo = cols * .2, hi = cols * .9 - 9, p = (t * 2.2 / (hi - lo)) % 2;
        return [
          { art: ['.'], pal: {}, x: cols * .8 - .5, y: rows * .3 - .5, key: 2, glow: { r: 12, color: '#d97757', a: .3 + .05 * Math.sin(t * 1.4) } },
          { art: frame(CLAWDS, t, 5), pal: { '#': { bg: '#d97757', fg: '#3b1d12', a: .95 }, o: { bg: '#2a1a14', fg: '#d97757', a: .95 } },
            x: lo + (hi - lo) * (p < 1 ? p : 2 - p), y: rows - 8, key: 1 },
        ];
      },
    };
  }

  {
    const BIRDS = [['v'], ['^']], BIRD_PAL = { v: { ch: 'v', fg: '#3f6280', a: .8 }, '^': { ch: '^', fg: '#3f6280', a: .8 } };
    const FLOCK = [[0, 0], [2, -1], [4, 0], [1.5, 1.5]];

    const skies = new Map();
    const skyArt = seed => {
      if (!skies.has(seed)) {
        const r = j => hash(seed, j, 3), kind = seed % 4;
        const [n, R0, R1, base] = [[3 + Math.floor(r(2) * 2), 2.4, 4.2, 1], [6 + Math.floor(r(2) * 3), 1.1, 1.8, 1],
          [2, 1.6, 2.4, 1], [3, 2.6, 5.2, 2]][kind];
        const domes = [];
        for (let i = 0, cx = 0; i < n; i++) {
          const mid = 1 - Math.abs(i - (n - 1) / 2) / Math.max(1, (n - 1) / 2), R = R0 + (R1 - R0) * (kind === 3 ? mid ** 2 : mid * .6 + r(10 + i) * .4);
          cx = i ? cx + R * .95 : R;
          domes.push([cx, R]);
          cx += R * .45;
        }
        const W = domes[n - 1][0] + domes[n - 1][1], lift = x => Math.max(0, ...domes.map(([cx, R]) => (Math.abs(x - cx) < R ? Math.sqrt(R * R - (x - cx) ** 2) * .75 : 0)));
        const H = Math.ceil(Math.max(...domes.map(d => d[1])) * .75 + base);
        skies.set(seed, shape(Math.ceil(W) + 1, H, (x, y) => {
          const up = H - 1 - y, h = Math.ceil(base + lift(x + .5) - .35);
          const end = x + .5 < domes[0][0] - domes[0][1] * .7 || x + .5 > domes[n - 1][0] + domes[n - 1][1] * .7;
          if (up >= h || (end && up >= base) || (up === h - 1 && h > 2 && hash(seed * 7 + x, 1, 4) < .25)) return '.';
          return String(1 + Math.min(3, Math.floor(4 * up / H)));
        }));
      }
      return skies.get(seed);
    };
    const DAY_TOPS = {
      4: { bg: '#ffffff', fg: '#9db3c6', a: .96 }, 3: { bg: '#f2f6fa', fg: '#93a9bd', a: .93 },
      2: { bg: '#e0e9f1', fg: '#869cb0', a: .9 }, 1: { bg: '#cad7e3', fg: '#7a90a4', a: .86 },
    };
    const WISP = ['~-~~.~~-~~~.-~', '..~~-~.~~~....'], WISP_PAL = { '~': { ch: '~', fg: '#ffffff', a: .55 }, '-': { ch: '-', fg: '#ffffff', a: .45 } };
    const FAR = [[2, .1, .14, .8, .65], [5, .55, .08, .95, .6], [6, .8, .3, .75, .65], [9, .35, .3, .85, .6], [10, .95, .2, 1, .65]];
    const NEAR = [[0, .15, .48, 1.6, 1], [3, .62, .42, 1.9, 1], [4, .88, .72, 1.7, 1], [7, .36, .78, 2.2, 1], [8, .05, .86, 1.5, 1]];
    const CIRRUS = [[.2, .05, 2.6], [.7, .13, 2.2]];
    const skySprite = (cols, rows, t) => ([seed, fx, fy, v, a]) => {
      const art = skyArt(seed), w = art[0].length;
      return { art, pal: DAY_TOPS, a, halo: '#ffffff', x: drift(cols, fx, t, v, w) - w / 2, y: fy * rows - art.length / 2, key: seed };
    };

    SCENES['cloud-drift'] = {
      sprites: (cols, rows, t) => [
        ...CIRRUS.map(([fx, fy, v], i) => ({ art: WISP, pal: WISP_PAL, key: 60 + i, x: drift(cols, fx, t, v, 14) - 7, y: fy * rows })),
        ...FAR.map(skySprite(cols, rows, t)),
        ...[0, 1].flatMap(f => FLOCK.map(([bx, by], j) => ({ art: frame(BIRDS, t, 3, j * .5), pal: BIRD_PAL, key: 20 + f * 4 + j,
          x: drift(cols, hash(f, 21), t, 2.4 + f * .4, 6) + bx, y: rows * (.25 + .25 * f) + Math.sin(t * .7 + f) * 1.5 + by }))),
        ...NEAR.map(skySprite(cols, rows, t)),
      ],
    };
  }

  {
    const FLIES = [['a..', '.Y.', '..c'], ['..b', '.Y.', '...'], ['...', '.Y.', 'b.a']];
    const FLY_PAL = { Y: { bg: '#e9f57a', fg: '#2c3308', a: 1 }, a: { ch: ':', fg: '#e9f57a', a: .55 }, b: { ch: "'", fg: '#e9f57a', a: .55 }, c: { ch: 'o', fg: '#e9f57a', a: .4 } };

    SCENES.fireflies = {
      cell: (x, y, cols, rows, t) => {
        const h = 2 + Math.floor(hash(x, 7) ** 2 * 8);
        if (y < rows - h || (y < rows - 1 && hash(x, y, 8) > .75)) return;
        return { ch: glyph('SXt%S', x, y, t * .5), fg: '#4fb85c', a: .5 + .45 * (y - rows + h) / h };
      },
      sprites: (cols, rows, t) => Array.from({ length: 18 }, (_, i) => {
        const b = Math.max(0, Math.min(1, Math.sin(t * (.6 + .5 * hash(i, 5)) + i * 3) * 1.4 - .2));
        return { art: FLIES[i % 3], pal: FLY_PAL, key: i, a: .12 + .88 * b, glow: { r: 3.4, color: '#cfe86a', a: .18 + .3 * b },
          x: hash(i, 1) * cols + Math.sin(t * .2 * (1 + hash(i, 2)) + i) * 6 - 1,
          y: rows * (.08 + .65 * hash(i, 3)) + Math.cos(t * .17 * (1 + hash(i, 4)) + i * 2) * 3.5 - 1 };
      }),
    };
  }

  {
    const matrix = (x, y, cols, fg) => (x > cols * .82 && y % 2 === 0 && hash(x, y, 90) < .55 ? { ch: '-', fg, a: .14 } : undefined);

    const REEF_COLORS = ["#2b9ee6","#53ddf9","#06aceb","#69ebfa","#e1f6f5","#21bbef","#3074ee","#007cef","#0499eb","#05befa","#1ccaf9","#01b5fa","#0281e1","#7c4d36","#033a9a","#40b9cd","#e5b77f","#01adf9","#0188f4","#946a62","#cbd5ac","#2561a5","#101b29","#b7a976","#35d4f9","#043a78","#01a0f9","#f4e9bf","#0163da","#01a6f8","#0191f8","#874fe2","#0142a9","#6e7cc9","#015ad2","#016ce4","#0198f8","#f3688c","#0488b8","#116c66","#9bf4f7","#0155ca","#014ec1","#f6cc38","#373b95","#5fc04f","#08508b","#0148b7","#ee7e3a","#163b5d","#a8a7e3","#3b9662","#555cba","#f6e5ab","#97df4f","#1f2d89"];
    const REEF_W = 97, REEF_H = 47;
    const REEF_THINGS = {
      turtle: { c: 24, r: 10, art: ['.........................', '.......ppjMMNN.....pKpK..', '.....pMMjnddjdj..pRPmRPN.', '...NMdndjddd4dddNRPkmDDp.', '..jdgdk44ddjmDPSgRDkRRR..', '.jndddddNPDDJJSSRrRRkp...', '..ddpPRRSSDDNSRrnnpC.....', '.DnRRRRgkDDDNrrRkPSSC....', '..KnngDDDDDngggp.DDJRp...', '.....kDkDPk.......NJSR...', '....PDPjDR.........nDPN..', '...RPDnRK...........gDN..', '..P..Rp..............pC..', '.........................'] },
      clownA: { c: 11, r: 20, art: ['........', '..dmMP..', '.M4M44M.', '.ddM4dM.', '........'] },
      clownB: { c: 16, r: 24, art: ['.........', '....pM...', '.LlMM4MC.', '.mM4MM4M.', '.........'] },
      tang: { c: 26, r: 27, art: ['.........', '...pp....', '.y6eeeFP.', '.66666pH.', '.........'] },
      yellow: { c: 48, r: 20, art: ['............', '........HP..', '.......HHHH.', '...DH...Hj..', '..HHHH......', '...HH...lHH.', '........HHH.', '............'] },
      crab: { c: 29, r: 42, art: ['BmgjM.', '.MMMdg', 'M..jM.', 'j.....'] },
      idolA: { c: 61, r: 19, art: ['.......', '....4..', '..mR...', '.4mrmH.', '.4m4m..', '..m4...', '.......'] },
      idolB: { c: 63, r: 25, art: ['........', '...4....', '..m.....', '.4m.mH..', '.rm4N...', '..m44...', '........'] },
      star: { c: 3, r: 35, art: ['............', '.....M......', '............', '..MMMMMMM...', '..MMMMHM....', '....MMMM....', '...MM..MM...', '............', '............'] },
      weedL: { c: 0, r: 10, art: ['........', '........', '.P......', '.JN.....', '..J.....', '...J....', '...J.D..', '..J..J..', '.JD.JJ..', '.JD.P.DN', '..PPD..S', '..JJ..JS', '.JP..DS.', '.PD.DS..', '.P.DJJ.S', '...P.P.S', '....D.JJ', '......J.', '........', '........', '........', '........', '........', '........'] },
      weedM: { c: 16, r: 31, art: ['..........', '..........', '..J.......', '..J..DJ...', '...J..S...', '..JJ.JP...', '..J.JP....', '..P.DD.D..', '...P.P.J..', '....D.PD..', '.....DP...'] },
      weedR: { c: 87, r: 17, art: ['..........', '..........', '..........', '..........', '......J.J.', '....J.PJJ.', '....J..JD.', '.....JJ.J.', '......J.J.', '......P...', '..........', '..........', '..........', '..........'] },
    };
    const REEF_KEYS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const REEF_PAL = Object.fromEntries(REEF_COLORS.map((c, i) => [REEF_KEYS[i], { bg: c, fg: shade(c, -.1), a: .96 }]));
    const placeOf = (th, cols, rows) => [SIDE + th.c * (cols - SIDE) / REEF_W, th.r * rows / REEF_H];
    const nudge = (art, pick, dx, dy) => {
      const g = art.map(r => [...r]), moved = [];
      art.forEach((row, y) => [...row].forEach((k, x) => { if (k !== '.' && pick(x, y, k)) { moved.push([x + dx, y + dy, k]); g[y][x] = '.'; } }));
      for (const [x, y, k] of moved) if (g[y]?.[x] !== undefined) g[y][x] = k;
      return g.map(r => r.join(''));
    };
    const parts = art => {
      const seen = new Set(), out = [];
      art.forEach((row, y) => [...row].forEach((k, x) => {
        if (k === '.' || seen.has(`${x},${y}`)) return;
        const cells = [], todo = [[x, y]];
        seen.add(`${x},${y}`);
        while (todo.length) {
          const [cx, cy] = todo.pop();
          cells.push([cx, cy]);
          for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]])
            if ((art[ny]?.[nx] ?? '.') !== '.' && !seen.has(`${nx},${ny}`)) { seen.add(`${nx},${ny}`); todo.push([nx, ny]); }
        }
        const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
        const own = shape(Math.max(...xs) - x0 + 1, Math.max(...ys) - y0 + 1, (px, py) => (cells.some(([a, b]) => a === px + x0 && b === py + y0) ? art[py + y0][px + x0] : '.'));
        if (cells.length > 2) out.push({ dx: x0, dy: y0, art: own });
      }));
      return out;
    };
    const wag = (art, facesRight) => {
      const w = art[0].length, tail = (x) => (facesRight ? x < w * .36 : x >= w * .64);
      return [art, nudge(art, x => tail(x), 0, -1), art, nudge(art, x => tail(x), 0, 1)];
    };
    const both = frames => [frames, frames.map(flip)];
    const T0 = REEF_THINGS;
    const REEF_FRAMES = {
      clownA: both(wag(T0.clownA.art, true)), clownB: both(wag(T0.clownB.art, true)),
      tang: both(wag(T0.tang.art, false)), idolA: both(wag(T0.idolA.art, false)), idolB: both(wag(T0.idolB.art, false)),
      yellow: parts(T0.yellow.art).map(p => ({ ...p, frames: wag(p.art, false) })),
      turtle: (() => {
        const a = T0.turtle.art, fl = (x, y) => y >= a.length * .64;
        return [a, nudge(a, fl, -1, 0), nudge(a, fl, -1, 1), nudge(a, fl, 0, 1)];
      })(),
      crab: (() => {
        const a = T0.crab.art, h = a.length;
        return [a, nudge(nudge(a, (x, y) => y === h - 1, 1, 0), (x, y) => y === 0, 0, -1), a, nudge(a, (x, y) => y === h - 1, -1, 0)];
      })(),
      star: (() => { const a = T0.star.art; return [a, a, a, nudge(a, (x, y) => y <= 1, 0, -1)]; })(),
    };
    const swaying = (art, t, i) => ({
      w: art[0].length + 4, h: art.length,
      field: (gx, gy) => {
        const off = Math.round(Math.sin(t * 1.2 + gy * .45 + i * 2) * 1.3 * (art.length - gy) / art.length), k = art[gy][gx - 2 - off];
        return k && k !== '.' ? { c: REEF_PAL[k], sx: gx - 2 - off, sy: gy } : undefined;
      },
    });

    SCENES['honu-lagoon'] = {
      size: 18, // (the creatures keep the reference picture's scale)
      cell: (x, y, cols, rows, t) => {
        for (let i = 0; i < 9; i++)
          if (x === Math.floor(hash(i, 31) * cols) + Math.round(Math.sin(t + i))
            && y === Math.round(rows - ((t * 1.8 * (1 + hash(i, 32)) + hash(i, 33) * rows) % (rows + 4)))) return { ch: 'o', fg: '#e8fbff', a: .65 };
        if (rising(x, y, t, .5, .008)) return { ch: '.', fg: '#cdeefa', a: .35 };
        return twinkle(x, y, t, '#e8fbff', .006) ?? matrix(x, y, cols, '#e8fbff');
      },
      sprites: (cols, rows, t) => {
        const T = REEF_THINGS, F = REEF_FRAMES, out = [];
        const add = (art, x, y, key, extra = {}) => out.push({ art, pal: REEF_PAL, key, x, y, ...extra });
        const swim = (name, v, left) => {
          const w = T[name].art[0].length, [x] = placeOf(T[name], cols, rows), f = (x + w / 2 + w) / (cols + w * 2);
          const run = drift(cols, left ? 1 - f : f, t, v, w);
          return (left ? cols - run : run) - w / 2;
        };
        ['weedL', 'weedM', 'weedR'].forEach((n, i) => { const [x, y] = placeOf(T[n], cols, rows); out.push({ ...swaying(T[n].art, t, i), x: x - 2, y, key: 150 + i }); });
        const [sx, sy] = placeOf(T.star, cols, rows);
        add(frame(F.star, t, .6), sx, sy, 7);
        const [, ty] = placeOf(T.turtle, cols, rows);
        add(frame(F.turtle, t, 2.2), swim('turtle', .8, false), ty + Math.sin(t * .6) * .8, 1, { shadow: '#0b3d7a' });
        const [, yy] = placeOf(T.yellow, cols, rows), yx = swim('yellow', 1.3, true);
        F.yellow.forEach((p, i) => add(frame(p.frames, t, 4, i * 1.3), yx + p.dx + Math.sin(t * .9 + i * 2) * .8, yy + p.dy + Math.sin(t * 1.1 + i) * .7, 20 + i));
        const [, gy] = placeOf(T.tang, cols, rows);
        add(frame(F.tang[0], t, 5), swim('tang', 2, true), gy + Math.sin(t * 1.4) * .5, 3);
        ['clownA', 'clownB'].forEach((n, i) => {
          const [x, y] = placeOf(T[n], cols, rows), a = t * .7 + i * 2.2;
          add(frame(F[n][Math.cos(a) < 0 ? 1 : 0], t, 5, i * 2), x + Math.sin(a) * 2.5, y + Math.sin(t * 1.3 + i) * .6, 4 + i);
        });
        ['idolA', 'idolB'].forEach((n, i) => {
          const [x, y] = placeOf(T[n], cols, rows), a = t * .45 + i * 1.7;
          add(frame(F[n][Math.cos(a) > 0 ? 1 : 0], t, 3, i * 2), x + Math.sin(a) * 1.5, y + Math.sin(t * .8 + i) * .8, 8 + i);
        });
        const [cx, cy] = placeOf(T.crab, cols, rows);
        add(frame(F.crab, t, 6), cx + Math.sin(t * .9) * 4, cy, 6);
        return out;
      },
    };
  }

  {
    const jelly = ph => sketch(13, 22, [
      ...(ph ? [[0, 4, 'BBBBB'], [1, 2, 'BBBBBBBBB'], [2, 1, 'BBpBBBBBpBB'], [3, 0, 'RRRRRRRRRRRRR']]
        : [[0, 3, 'BBBBBBB'], [1, 1, 'BBBBBBBBBBB'], [2, 1, 'BBpBBBBBpBB'], [3, 1, 'RRRRRRRRRRR']]),
      [4, 3, 'kkkkkkk'],
      ...[1, 3, 5, 7, 9, 11].flatMap((c, k) => Array.from({ length: 16 }, (_, i) => {
        const r = hash(k, i, 7);
        return r < .18 ? [] : [[5 + i, c, r < .42 ? 'o' : 'l']];
      }).flat()),
    ]);
    const JELLIES = [jelly(0), jelly(1)];
    const jellyPal = c => ({
      B: { bg: c, fg: shade(c, -.6), a: .72 }, p: { bg: shade(c, .55), fg: c, a: .85 }, R: { bg: shade(c, .15), fg: shade(c, -.6), a: .78 },
      k: { bg: shade(c, -.15), fg: shade(c, -.65), a: .6 }, l: { bg: c, fg: shade(c, -.6), a: .62 }, o: { ch: 'o', fg: shade(c, .3), a: .5 },
    });

    const JELLY = [[.25, '#9a7fe0', .6, .7], [.82, '#ef8f63', .9, .95], [.06, '#ec92c6', .75, .9], [.55, '#7fb4ef', 1.1, .6]]
      .map(([x, c, v, a]) => [x, jellyPal(c), v, a]);

    SCENES.jellyfish = {
      cell: (x, y, cols, rows, t) => {
        const cx = -cols * .15, cy = -rows * .35, R = rows * .75 + cols * .1, d = Math.hypot(x - cx, y - cy);
        if (Math.abs(d - R) < .55 && (((Math.atan2(y - cy, x - cx) * R - t * 3) % 3) + 3) % 3 < 1) return { ch: 'o', fg: '#dbe8ff', a: .55 };
        if (Math.abs(d - R - 1.6) < .55 && hash(x, y, 71) < .4) return { ch: '~', fg: '#9cc8ff', a: .35 };
        if (rising(x, y, t, .6, .01)) return { ch: '.', fg: '#9cc8ff', a: .35 };
      },
      sprites: (cols, rows, t) => JELLY.map(([fx, pal, v, a], i) => {
        const span = rows + 34;
        return { art: frame(JELLIES, t, 1.1, i * .5), pal, a, key: i,
          x: fx * cols + Math.sin(t * .35 + i) * 2.5 - 6.5, y: rows + 4 - ((t * v + i * span / 4) % span) };
      }),
    };
  }

  {
    const CARP_R = [1.8, 2.8, 3.4, 3.8, 3.9, 3.9, 3.7, 3.4, 3, 2.6, 2.2, 1.8, 1.4, 1.1, .9, .8], CARP_LEN = CARP_R.length + 5;
    const CARP_PAL = (() => {
      const p = {
        w: { bg: '#f3eee5', fg: '#a59f94', a: .95 }, r: { bg: '#de3a2a', fg: '#6e140c', a: .95 }, k: { bg: '#1f1c1b', fg: '#6a6560', a: .95 },
        g: { bg: '#f2b52c', fg: '#7a5208', a: .95 }, l: { bg: '#f8d769', fg: '#8a6110', a: .95 }, e: { bg: '#120c0a', fg: '#5a504a', a: .97 },
        f: { bg: '#e6e2d8', fg: '#9a948a', a: .78 }, F: { bg: '#f5cc4f', fg: '#8a6110', a: .8 },
      };
      for (const k of 'wrkgl') p[k.toUpperCase() + '_'] = { ...p[k], bg: shade(p[k].bg, -.16) };
      return p;
    })();
    const CARP_KINDS = [
      { base: 'w', fin: 'f', spots: [[2, .6, 1.3, 'r'], [5.5, 1.6, 1.9, 'r'], [9.5, -1.3, 1.8, 'r'], [13, .8, 1.2, 'r']] },
      { base: 'w', fin: 'f', spots: [[1, 0, 1.5, 'r'], [3.5, -1.6, 1.9, 'k'], [6, 1.2, 2.2, 'r'], [8, 2, 1.6, 'k'], [10, -1, 2, 'r'], [12, -.6, 1.6, 'k'], [14.5, .4, 1.2, 'k']] },
      { base: 'g', fin: 'F', spots: [] },
    ];
    const CARP_LOOPS = [[.74, .3, .15, .17, 1, 1], [.26, .42, .13, .24, 1, -1], [.56, .66, .2, .12, 1, -1]];
    const carpPath = (cols, rows, i, s) => {
      const [mx, my, rx, ry, k, dir] = CARP_LOOPS[i];
      return [SIDE + (cols - SIDE) * (mx + rx * Math.cos(s * k * dir + i * 2)), rows * (my + ry * Math.sin(s * dir + i * 2))];
    };
    const carp = (cols, rows, t, i) => {
      const z = Math.min(.75, Math.max(.5, (cols - SIDE) / 90));
      let s = t * (.06 + i * .01);
      const spine = [carpPath(cols, rows, i, s)];
      for (let n = 0; spine.length < CARP_LEN && n < 20000; n++) {
        const q = carpPath(cols, rows, i, s -= .002), [lx, ly] = spine[spine.length - 1];
        if (Math.hypot(q[0] - lx, q[1] - ly) >= z) spine.push(q);
      }
      const norm = spine.map((_, k) => {
        const [ax, ay] = spine[Math.max(0, k - 1)], [bx, by] = spine[Math.min(spine.length - 1, k + 1)], d = Math.hypot(ax - bx, ay - by) || 1;
        return [-(ay - by) / d, (ax - bx) / d];
      });
      const xs = spine.map(p => p[0]), ys = spine.map(p => p[1]), ox = Math.min(...xs) - 6, oy = Math.min(...ys) - 6;
      const kind = CARP_KINDS[i], P = CARP_PAL;
      const swish = u => Math.sin(t * 3.2 + i * 2) * 1.3 * Math.max(0, u - 9) / 11;
      const paddle = 4.8 + .7 * Math.sin(t * 2.4 + i);
      return {
        x: ox, y: oy, w: Math.ceil(Math.max(...xs) - ox + 7), h: Math.ceil(Math.max(...ys) - oy + 7), key: i, shadow: '#0b3430',
        field: (gx, gy) => {
          const wx = ox + gx + .5, wy = oy + gy + .5;
          let u = 0, d = Infinity;
          spine.forEach(([px, py], j) => { const e = Math.hypot(wx - px, wy - py); if (e < d) { d = e; u = j; } });
          d /= z;
          const [nx, ny] = norm[u], dx = (wx - spine[u][0]) / z, dy = (wy - spine[u][1]) / z;
          const v = dx * nx + dy * ny - swish(u), av = Math.abs(v), seed = { sx: u + i * 40, sy: Math.round(v * 1.5) };
          if (u < CARP_R.length && av <= CARP_R[u] && d <= CARP_R[u] + 1) {
            if (u >= 1 && u <= 2 && Math.abs(av - 1.8) < .55) return { c: P.e, ...seed };
            const spot = kind.spots.find(([su, sv, sr]) => Math.hypot(u - su, v - sv) < sr);
            let key = spot ? spot[3] : kind.base;
            if (kind.base === 'g' && av < .9 && u > 1) key = 'l';
            return { c: av > CARP_R[u] - .8 ? P[key.toUpperCase() + '_'] : P[key], ...seed };
          }
          if (u >= CARP_R.length) {
            const a = u - CARP_R.length + (u === spine.length - 1 ? Math.max(0, dy * nx - dx * ny) : 0);
            if (av <= .7 + Math.min(a, 4.5) * .5 && a <= 4 + av * .8 && !(a > 4 && av < (a - 4) * 1.4 + .5)) return { c: P[kind.fin], ...seed };
          }
          if (u >= 3 && u <= 8 && ((u - 5.5) / 2.2) ** 2 + ((av - paddle) / 1.6) ** 2 <= 1) return { c: P[kind.fin], ...seed };
          if (u >= 9 && u <= 12 && ((u - 10.5) / 1.3) ** 2 + ((av - 3) / 1.1) ** 2 <= 1) return { c: P[kind.fin], ...seed };
        },
      };
    };
    const LILIES = [[.8, .06, 4.2, 2.4], [.95, .14, 6.5, 2], [.99, .42, 5, 2.8], [.01, .55, 5.5, .2], [.2, .97, 4.8, -1.6], [.04, .95, 6.5, -.9], [.97, .95, 5.5, -2.2]];
    const LOTUS = [[.82, .08, 3.2], [.18, .87, 3.2]];
    const LILY_PAL = {
      pad: { bg: '#5c9a43', fg: '#2c5520', a: .93 }, rim: { bg: '#3f7a31', fg: '#1d3d15', a: .93 }, vein: { bg: '#86c066', fg: '#3a6a2a', a: .93 },
      petal: { bg: '#f28bb8', fg: '#8a2d55', a: .95 }, inner: { bg: '#f9c3da', fg: '#a2466e', a: .95 }, heart: { bg: '#f6d03f', fg: '#7a5a08', a: .97 },
      shadow: { bg: '#0b3430', fg: '#0b3430', ch: '', a: .35 },
    };
    const lilyAt = (x, y, cols, rows, t) => {
      const W = cols - SIDE;
      for (const [fx, fy, r] of LOTUS) {
        const cx = SIDE + fx * W, cy = fy * rows, dx = x + .5 - cx, dy = y + .5 - cy, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const p = r * (.55 + .45 * Math.abs(Math.cos(4 * th + fx * 9))) * (1 + .07 * Math.sin(t * .8 + fx * 5));
        if (d < .9) return LILY_PAL.heart;
        if (d < p * .55) return LILY_PAL.inner;
        if (d < p) return LILY_PAL.petal;
      }
      for (const [fx, fy, r, notch] of LILIES) {
        const cx = SIDE + fx * W, cy = fy * rows, dx = x + .5 - cx, dy = y + .5 - cy, d = Math.hypot(dx, dy);
        if (d > r) continue;
        const th = Math.atan2(dy, dx), off = Math.abs(((th - notch) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
        if (off < .3 && d > .4) continue;
        if (d > r - .8) return LILY_PAL.rim;
        const spoke = Math.abs(((((th - notch) * 11 / (Math.PI * 2)) % 1) + 1) % 1 - .5);
        return d < .8 || (d > 1.2 && spoke > .5 - .35 / d) ? LILY_PAL.vein : LILY_PAL.pad;
      }
    };

    SCENES['koi-pond'] = {
      cell: (x, y, cols, rows, t) => {
        const lily = lilyAt(x, y, cols, rows, t);
        if (lily) return lily;
        if (lilyAt(x - 1, y - 1, cols, rows, t)) return LILY_PAL.shadow;
        if (hash(x - Math.floor(t * .3), y + Math.floor(t * .12), 77) < .004) return { bg: '#f4b6cc', fg: '#8a2d55', a: .85 };
        for (let i = 0; i < 5; i++) {
          const rr = (t * 1.6 + i * 3.7) % 10, d = Math.hypot(x - (SIDE + hash(i, 61) * (cols - SIDE)), y - hash(i, 62) * rows);
          if ((Math.abs(d - rr) < .5 || Math.abs(d - rr + 2.2) < .5) && hash(x, y, 63) < .7) return { ch: 'o', fg: '#d6f1e8', a: .4 * (1 - rr / 10) };
        }
        const deep = ell(x, y, SIDE + (cols - SIDE) * .5, rows * .45, (cols - SIDE) * .2, rows * .28);
        if (deep < 1) return { bg: '#0d3a38', fg: '#0d3a38', ch: '', a: .45 * (1 - deep) };
        if (hash(x, y, 71) < .03) return { ch: 'abcdeghkmnopqtu_.*'[Math.floor(hash(x, y, 72) * 18)], fg: '#cfeee6', a: .2 };
        return twinkle(x, y, t, '#e8fbf6', .004);
      },
      sprites: (cols, rows, t) => [0, 1, 2].map(i => carp(cols, rows, t, i)),
    };
  }

  {
    const LANTERN_NEAR = ['..RRRR..', '.RRRRRR.', 'RRRRRRRR', '.pPPPPp.', '.pPPKPp.', '.pPKKPp.', '.pPPPPp.', '.pPPPPp.', '.WWWWWW.', 'wwwwwwww', '.wwwwww.'];
    const LANTERN_FAR = ['RRRRR', '.pPp.', '.pKp.', '.WWW.', 'wwwww'];
    const flicker = art => art.map((r, y) => (y === 3 || y === art.length - 4 ? r.replace(/P/g, 'p') : r));
    const REFLECT_NEAR = [['..rrrr..', '...rr...', '..r..r..', '...rr...', '....r...'], ['.rrrrr..', '..rr.r..', '...rr...', '..r.....', '...r....'], ['..rrrrr.', '..r.rr..', '...rr...', '.....r..', '....r...']];
    const REFLECT_FAR = [['.rrr.', '..r..', '.r...'], ['rrr..', '.r.r.', '..r..'], ['.rrrr', '..r..', '...r.']];
    const lanternArts = (art, reflects) => [art, flicker(art)].flatMap(a => reflects.map(r => [...a, ...r]));
    const LANTERN_ARTS = [lanternArts(LANTERN_FAR, REFLECT_FAR), lanternArts(LANTERN_NEAR, REFLECT_NEAR)];
    const LANTERN_PAL = {
      R: { bg: '#3a1a14', fg: '#170905', a: .95 }, P: { bg: '#ffd889', fg: '#c46a1c', a: .97 }, p: { bg: '#f4a347', fg: '#7a3a0c', a: .95 },
      K: { bg: '#e07a2a', fg: '#5a2a08', a: .95 }, W: { bg: '#4a2e1c', fg: '#1e120a', a: .95 }, w: { bg: '#2e1c12', fg: '#120a06', a: .92 },
      r: { bg: '#f6b04e', fg: '#7a3a0c', a: .4 },
    };
    const LANTERNS = [[.05, .1, .12], [.4, .05, .1], [.75, .18, .14], [.2, .35, .2], [.6, .42, .18], [.9, .3, .22], [.12, .72, .3], [.5, .85, .26], [.82, .68, .32]];
    const BANK = .3;
    const lantern = (cols, rows, t, i, [fx, depth, v]) => {
      const near = depth > .5, art = frame(LANTERN_ARTS[+near], t, 2.2, i * 1.7);
      const top = rows * BANK + 1 + depth * (rows * (1 - BANK) - 16);
      return { art, pal: LANTERN_PAL, key: 60 + i, a: .7 + .3 * depth, glow: { r: near ? 7 : 4, color: '#ffb347', a: near ? .42 : .28 },
        x: drift(cols, fx, t, v, art[0].length), y: top + Math.sin(t * .8 + i * 2) * .5 };
    };

    SCENES['lantern-night'] = {
      cell: (x, y, cols, rows, t) => {
        const bank = Math.round(rows * BANK), roof = bank - 1 - Math.floor(2.6 * (.5 + .5 * Math.sin(x * .21)) + hash(Math.floor(x / 3), 7) * 2.2);
        if (y < roof) return twinkle(x, y, t, '#fff1cf', .012);
        if (y < bank) {
          if (y < bank - 1 && hash(x, y, 41) < .07) return { bg: '#f2b65a', fg: '#6a3a0c', a: .55 + .3 * Math.sin(t * .7 + x) ** 2 };
          return { bg: '#04070e', fg: '#131c30', a: .97 };
        }
        if (y < bank + 4 && hash(x, bank - 2, 41) < .07 && hash(x, y + Math.floor(t * 2), 43) < .55) return { ch: '|', fg: '#f2b65a', a: .35 * (1 - (y - bank) / 4) };
        if (hash(Math.floor(x / 4 + t * .25 * (1 + (y % 3) * .3)), y, 45) < .07) return { ch: (x + y) % 2 ? '~' : '-', fg: '#8fb0d6', a: .16 };
      },
      sprites: (cols, rows, t) => LANTERNS.map((l, i) => lantern(cols, rows, t, i, l)),
    };
  }

  {
    const clouds = new Map();
    const cloudArt = w => {
      if (!clouds.has(w)) {
        const cx = w / 2, inside = (x, y) => Math.min(ell(x, y, cx, 3, w / 2, 1.6), ell(x, y, cx + w * .1, 1.4, w * .28, 1.2)) <= 1;
        clouds.set(w, shape(w + 1, 6, (x, y) => (inside(x, y) ? String(1 + Math.min(3, Math.floor(4 * x / (w + 1)))) : '.')));
      }
      return clouds.get(w);
    };

    const METEOR = sketch(8, 4, [[0, 0, '11'], [1, 2, '22'], [2, 4, '33'], [3, 6, '4H']]);
    const METEORS = [METEOR, flip(METEOR)];
    const meteorPal = ch => ({
      H: { bg: '#fff6d0', fg: '#3a3524', a: 1 }, 4: { ch, fg: '#fff6d0', a: .85 }, 3: { ch, fg: '#fff6d0', a: .6 },
      2: { ch, fg: '#dbe2f5', a: .4 }, 1: { ch, fg: '#dbe2f5', a: .2 },
    });
    const METEOR_PALS = [meteorPal('\\'), meteorPal('/')];
    const SKYFALL = 12, FALL = 1.5;
    const meteor = (cols, rows, t) => {
      const k = Math.floor(t / SKYFALL), p = (t - k * SKYFALL) / FALL;
      if (p >= 1) return [];
      const left = hash(k, 3) < .5, run = 26 * p;
      const hx = cols * (.25 + .5 * hash(k, 1)) + (left ? -run : run), hy = rows * (.05 + .25 * hash(k, 2)) + run * .5;
      return [{ art: METEORS[+left], pal: METEOR_PALS[+left], key: 40, a: Math.sin(Math.PI * p),
        x: left ? hx : hx - 7, y: hy - 3 }];
    };

    const CLOUDS = [[.08, .14, 26, .6], [.55, .36, 22, .45], [.3, .6, 24, .5], [.85, .8, 18, .7]];
    const NIGHT = tint('#7088d8', '#18214a', [.35, .5, .65, .82]);

    SCENES.moonlit = {
      cell: (x, y, cols, rows, t) => {
        const mx = Math.round(cols * .74), my = Math.round(rows * .22), R = 6.5;
        const d1 = Math.hypot(x - mx, y - my), d2 = Math.hypot(x - mx - 3.4, y - my + 1.8);
        if (d1 <= R && d2 > R * .85) return { bg: '#d9c98f', fg: '#3a3524', a: .9 };
        if (d1 <= R + 1.6 && d2 > R * .85 + .6 && hash(x, y, 5) < .45) return { fg: '#d9c98f', a: .25 + .15 * Math.sin(t * 2 + x) };
        return twinkle(x, y, t, '#dbe2f5', .014);
      },
      sprites: (cols, rows, t) => [...meteor(cols, rows, t), ...CLOUDS.map(([fx, fy, w, v], i) =>
        ({ art: cloudArt(w), pal: NIGHT, halo: '#8ea2e6', x: drift(cols, fx, t, v, w) - w / 2, y: fy * rows - 3, key: i }))],
    };
  }

  {
    const STREET = 3;
    let city;
    const cityOf = (cols, rows) => {
      if (city?.cols !== cols || city.rows !== rows || city.side !== SIDE) {
        const mid = SIDE + (cols - SIDE) / 2, half = Math.max(1, (cols - SIDE) / 2);
        const row = (seed, lo, hi, pow) => {
          const out = [];
          for (let x = 0, b = 0; x < cols; b++) {
            const w = 4 + Math.floor(hash(b, seed) * 5), e = Math.min(1, Math.abs(x + w / 2 - mid) / half);
            const h = Math.round(rows * (lo + hi * e ** pow * (.6 + .4 * hash(b, seed + 1))));
            for (let i = 0; i < w; i++) out[x + i] = [h, x, x + w - 1, b];
            x += w;
          }
          return out;
        };
        city = { cols, rows, side: SIDE, near: row(1, .08, .52, 2), far: row(5, .16, .48, 1.4) };
      }
      return city;
    };
    const CITY = {
      wall: { bg: '#1b2242', fg: '#2b355a', a: .95 }, roof: { bg: '#2a3358', fg: '#3a4570', a: .95 },
      dark: { bg: '#232b4e', fg: '#323c64', a: .95 }, far: { bg: '#121730', fg: '#1b2140', a: .75 },
      farWin: { bg: '#6a5a3a', fg: '#2a2416', a: .5 },
      win: [{ bg: '#f3c56b', fg: '#6a4a10', a: .85 }, { bg: '#ffe2a0', fg: '#7a5a18', a: .85 }, { bg: '#8fd3ff', fg: '#1d4a6a', a: .75 }],
    };
    const RAIN_V = 11, RAIN_K = .3;
    const rain = (x, y, t) => {
      const q = Math.floor(y - t * RAIN_V), track = Math.floor(x + y * RAIN_K), m = ((q % 3) + 3) % 3;
      if (m < 2 && hash(track, Math.floor(q / 3), 27) < .09) return { ch: '/', fg: '#a9c4f0', a: m ? .6 : .28 };
    };
    const SMEAR = ['#ff5fa2', '#4fe3ff', '#f3c56b'];
    const street = (x, y, t) => {
      if (y === 0) return { ch: '_', fg: '#3a4570', a: .55 };
      if (hash(x, y, 40 + Math.floor(t * 3)) < .025) return { ch: 'o', fg: '#a9c4f0', a: .5 };
      if (hash(x, Math.floor(t * 1.5) + y, 41) < .12) return { ch: y === 1 ? '|' : '~', fg: SMEAR[Math.floor(hash(x, 42) * 3)], a: .28 };
    };
    const neon = (word, c) => {
      const tube = ch => ({ ch, fg: c, a: .9 }), pal = { '+': tube('+'), '-': tube('-'), '|': tube('|') };
      for (const ch of word) {
        pal[ch] = { bg: '#1c0b1a', fg: c, a: .95, ch };
        pal[ch.toLowerCase()] = { bg: '#1c0b1a', fg: shade(c, -.55), a: .9, ch };
      }
      const art = sketch(3, word.length + 2, [[0, 0, '+-+'], ...[...word].map((ch, i) => [i + 1, 0, `|${ch}|`]), [word.length + 1, 0, '+-+']]);
      return { c, pal, arts: [art, ...[...word].map((_, i) => art.map((r, y) => (y === i + 1 ? r.toLowerCase() : r)))] };
    };
    const SIGNS = [neon('RAMEN', '#ff5fa2'), neon('HOTEL', '#4fe3ff')];
    const signs = (cols, rows, t) => {
      const { near } = cityOf(cols, rows), ground = rows - STREET, W = cols - SIDE;
      return SIGNS.flatMap((s, i) => {
        let best;
        for (let x = Math.floor(SIDE + (i ? W * .7 : 0)); x < (i ? cols : SIDE + W * .3); x++) if (!best || near[x][0] > best[0]) best = near[x];
        if (!best || best[0] < s.arts[0].length + 3) return [];
        const k = Math.floor(t * 4), art = hash(k, i, 51) < .1 ? s.arts[1 + Math.floor(hash(k, i, 52) * (s.arts.length - 1))] : s.arts[0];
        const a = (t + i * 4.5) % 9 < .3 ? .3 : 1;
        return [{ art, pal: s.pal, key: 70 + i, a, x: i ? best[1] - 2 : best[2], y: ground - best[0] + 2, glow: { r: 6, color: s.c, a: .35 * a } }];
      });
    };
    const WALK = [
      ['..uUu..', '.uUUUu.', 'uUUUUUu', 'd..|..d', '...h...', '..cCc..', '..cCc..', '..l.l..'],
      ['..uUu..', '.uUUUu.', 'uUUUUUu', '...|...', 'd..h..d', '..cCc..', '..cCc..', '...l...'],
    ];
    const walkPal = c => ({
      U: { bg: c, fg: shade(c, -.6), a: .95 }, u: { bg: shade(c, -.25), fg: shade(c, -.7), a: .95 },
      d: { ch: '.', fg: '#bcd2f5', a: .6 }, '|': { ch: '|', fg: '#8a92b0', a: .9 },
      h: { bg: '#3a3550', fg: '#1a1828', a: .95 }, c: { bg: '#252a42', fg: '#121526', a: .95 },
      C: { bg: '#2f3554', fg: '#151a2e', a: .95 }, l: { bg: '#1c2034', fg: '#0c0e18', a: .95 },
    });
    const WALKERS = [[.97, 1.5, false, walkPal('#ff5fa2')], [.98, 1.1, true, walkPal('#f2c14e')]];
    const STORM = 23;
    const boltArt = k => {
      const out = [];
      for (let y = 0, c = 4; y < 12; y++) {
        const s = Math.floor(hash(k, y, 61) * 3) - 1;
        c = Math.max(0, Math.min(8, c + s));
        out.push('.'.repeat(c) + (s < 0 ? '/' : s > 0 ? '\\' : '|') + '.'.repeat(8 - c));
      }
      return out;
    };
    const BOLT_PAL = Object.fromEntries(['/', '\\', '|'].map(ch => [ch, { ch, fg: '#eef3ff', a: 1 }]));
    const lightning = (cols, rows, t) => {
      const err = root.dataset.themeEvent === 'error', k = err ? -1 : Math.floor(t / STORM), p = err ? 0 : t - k * STORM;
      if (!(p < .1 || (p > .2 && p < .32))) return [];
      const W = cols - SIDE, fx = hash(k, 62) < .5 ? .06 + .14 * hash(k, 63) : .78 + .14 * hash(k, 63);
      return [{ art: boltArt(k), pal: BOLT_PAL, key: 80, x: SIDE + W * fx, y: rows * .03, glow: { r: 16, color: '#a9bcff', a: .45 } }];
    };

    SCENES['neon-rain'] = {
      cell: (x, y, cols, rows, t) => {
        const { near, far } = cityOf(cols, rows), ground = rows - STREET;
        if (y >= ground) return street(x, y - ground, t);
        const [h, x0, x1, b] = near[x] ?? [0], top = ground - h;
        if (y >= top) {
          if (y === top) return CITY.roof;
          if (x > x0 && x < x1 && (x - x0) % 2 === 1 && (ground - y) % 2 === 0 && y > top + 1) {
            const lit = (hash(x, y, 21) < .45) !== (hash(x, y, 22 + Math.floor(t / 7 + hash(x, y, 24) * 7)) < .08);
            const s = hash(x, y, 23);
            return lit ? CITY.win[s < .6 ? 0 : s < .85 ? 1 : 2] : CITY.dark;
          }
          return CITY.wall;
        }
        if (y === top - 1 && x === Math.floor((x0 + x1) / 2) && hash(b, 31) < .35)
          return { ch: '*', fg: '#ff4d5e', a: Math.sin(t * 2.5 + b) > .3 ? .95 : .2 };
        const [fh, fx0, fx1] = far[x] ?? [0];
        if (y >= ground - fh)
          return fx1 - fx0 > 2 && (x - fx0) % 2 === 1 && (ground - y) % 3 === 0 && hash(x, y, 25) < .3 ? CITY.farWin : CITY.far;
        return rain(x, y, t);
      },
      sprites: (cols, rows, t) => [
        ...lightning(cols, rows, t),
        ...signs(cols, rows, t),
        ...WALKERS.map(([f, v, left, pal], i) => {
          const run = drift(cols, f, t, v, 7);
          return { art: frame(WALK, t, 3, i), pal, key: 90 + i, x: (left ? cols - run : run) - 3.5, y: rows - STREET - 8 };
        }),
      ],
    };
  }

  {
    // Two cherry branches reach in from the top corners; petals tumble down; hills and a low sun sit at the bottom.
    const BRANCH = [
      'BBBBBBBBBBBBbbb.........FF..',
      'BBBBBbbbFFf...bbbb....FFcFF.',
      'BBBb..FFcFF......bbbbb.FF...',
      'BBb....FFf...fFF....bb......',
      'Bb..........FFcF.....bFFf...',
      'B.......FF...fFF....FFcFF...',
      'b......FcFF..........fFF....',
      'b.......Ff..................',
    ];
    // The blossoms breathe: pale and full petals trade places, a few frames each
    const bloom = (art, k) => art.map(r => r.replace(/[Ff]/g, (c, i) => ((i + k) % 3 ? c : c === 'F' ? 'f' : 'F')));
    const BRANCHES = [0, 1, 2].map(k => bloom(BRANCH, k));
    const BRANCHES_R = BRANCHES.map(flip);
    const BRANCH_PAL = {
      B: { bg: '#2a1a24', fg: '#120a10', a: .97 }, b: { ch: '=', fg: '#3e2834', a: .9 },
      F: { bg: '#f7a8c4', fg: '#9a3d62', a: .95 }, f: { bg: '#ffd6e4', fg: '#b8607e', a: .9 },
      c: { bg: '#ffe9a8', fg: '#9a5a20', a: .95 },
    };
    const branch = (cols, rows, t, right) => {
      const art = frame(right ? BRANCHES_R : BRANCHES, t, 1.4, right ? 1 : 0);
      return { art, pal: BRANCH_PAL, key: right ? 2 : 1, halo: '#f7a8c4', shadow: true,
        glow: { r: 5, color: '#f7a8c4', a: .16 },
        x: right ? cols - art[0].length : 0, y: Math.sin(t * .5 + (right ? 2 : 0)) * .4 };
    };

    // A petal turns as it falls: flat, edge-on, flat the other way
    const PETALS = [['Pp'], ['P', '.'], ['pP'], ['.', 'P']];
    const PETAL_PAL = { P: { bg: '#f7a8c4', fg: '#9a3d62', a: .9 }, p: { ch: "'", fg: '#ffd6e4', a: .7 } };
    const petal = (cols, rows, t, i) => {
      const v = .8 + 1.2 * hash(i, 1), span = rows + 4, y = ((hash(i, 2) * span + t * v) % span) - 2;
      const side = hash(i, 3) < .5, depth = hash(i, 4);
      const x0 = side ? cols * (.02 + .3 * hash(i, 5)) : cols * (.68 + .3 * hash(i, 5));
      return { art: frame(PETALS, t, 2 + 2 * hash(i, 6), i), pal: PETAL_PAL, key: 10 + i, a: .35 + .6 * depth,
        x: x0 + y * .35 + Math.sin(t * .9 + i) * 3, y };
    };

    SCENES['sakura-dusk'] = {
      cell: (x, y, cols, rows, t) => {
        const hill = rows - 3 - Math.round(2.5 * (.5 + .5 * Math.sin(x * .09 + 1)) + 1.5 * (.5 + .5 * Math.sin(x * .23)));
        const sx = cols * .8, sy = hill + 1, d = Math.hypot((x - sx) * .5, y - sy);
        if (y >= hill) {
          if (hash(x, y, 21) < .05) return { ch: '.', fg: '#f7a8c4', a: .45 };
          return { bg: '#1a1222', fg: '#2c1d34', a: .96 };
        }
        if (d < 4) return { bg: '#ffb48a', fg: '#c0603a', a: .75, floor: .3 };
        if (d < 6 && hash(x, y, 22) < .4) return { fg: '#ffb48a', a: .25 + .15 * Math.sin(t + x) };
        if (y < rows * .45) return twinkle(x, y, t, '#f3dcef', .012);
        if (rising(x, y, -t, .6, .006)) return { ch: '.', fg: '#ffd6e4', a: .25 };
      },
      sprites: (cols, rows, t) => [
        branch(cols, rows, t, false), branch(cols, rows, t, true),
        ...Array.from({ length: Math.round(8 + cols / 8) }, (_, i) => petal(cols, rows, t, i)),
      ],
    };
  }

  {
    const CABIN_LIT = ['............CC....', '.......NNNNNCC....', '.....NNNNNNNNNN...', '...NNNNNNNNNNNNNN.',
      '.NNNRRRRRRRRRRRNNN', '..LLLLLLLLLLLLLLL.', '..lYyYlLLLLLLDDDl.', '..LyyyLLLLLLLDDDL.', '..lYyYlLLLLLLDdDl.',
      '..lllllllllllDDDl.', 'NNNNNNNNNNNNNNNNNN'];
    const CABIN_ARTS = [CABIN_LIT, CABIN_LIT.map((r, y) => (y > 5 && y < 9 ? r.replace(/Y/g, 'Z') : r))];
    const CABIN_PAL = {
      N: { bg: '#e8f0fb', fg: '#9fb4d4', a: .95 }, C: { bg: '#3a2a24', fg: '#1a120e', a: .95 }, R: { bg: '#2a1c18', fg: '#120b08', a: .95 },
      L: { bg: '#5a3b26', fg: '#2e1e12', a: .95 }, l: { bg: '#4a2f1e', fg: '#24160c', a: .95 }, D: { bg: '#3a2516', fg: '#1a1008', a: .95 },
      d: { bg: '#e0a458', fg: '#5a3a10', a: .95 }, y: { bg: '#5a3b26', fg: '#2e1e12', a: .95 },
      Y: { bg: '#ffd38a', fg: '#c47a2a', a: 1 }, Z: { bg: '#f6b860', fg: '#a8601c', a: 1 },
    };
    const PINE = ['....N....', '...NGN...', '..GGGGG..', '...GNG...', '..NGGGN..', '.GGGGGGG.', '..GGNGG..', '.NGGGGGGN',
      'GGGGGGGGG', '....T....', '....T....'];
    const sway = (art, k) => art.map((r, y) => (y < 4 ? (k > 0 ? '.' + r.slice(0, -1) : r.slice(1) + '.') : r));
    const PINES = [PINE, sway(PINE, 1), PINE, sway(PINE, -1)];
    const PINE_PAL = {
      G: { bg: '#1f3a35', fg: '#0d1e1b', a: .95 }, N: { bg: '#dbe6f6', fg: '#8ea2c4', a: .92 }, T: { bg: '#3a2516', fg: '#1a1008', a: .95 },
    };
    const TREES = [[.34, 1], [.78, .7], [.86, 1], [.94, .8]];
    const GROUND = .84;
    const groundAt = (x, rows) => Math.round(rows * GROUND + Math.sin(x * .09) * 1.2);
    const cabinAt = (cols, rows) => ({ x: Math.round(cols * .05), y: groundAt(Math.round(cols * .05) + 9, rows) - 10 });
    const peak = (x, cols, rows) => Math.max(0,
      rows * .34 - Math.abs(x - cols * .1) * .9, rows * .26 - Math.abs(x - cols * .24) * 1.1,
      rows * .38 - Math.abs(x - cols * .9) * .85, rows * .22 - Math.abs(x - cols * .74) * 1.2);

    SCENES['snow-cabin'] = {
      cell: (x, y, cols, rows, t) => {
        const ground = groundAt(x, rows), ridge = Math.round(rows * GROUND - peak(x, cols, rows));
        const fall = (v, odds, seed) => hash(x + Math.round(Math.sin(y * .3 + t * .5 + seed) * 1.5), Math.floor(y - t * v), seed) < odds;
        if (y >= ground) {
          if (hash(x, y, 21) < .02) return { ch: '*', fg: '#ffffff', a: .3 + .5 * Math.sin(t * 2 + x * 7) ** 2 };
          return { bg: '#3d4d6e', fg: '#56688c', a: .85 };
        }
        if (y >= ridge) {
          if (y < ridge + 2 + hash(x, 13) * 2 && peak(x, cols, rows) > 6) return { bg: '#b8c7df', fg: '#8195b8', a: .7 };
          return { bg: '#18233d', fg: '#222f4d', a: .9 };
        }
        const { x: cx, y: cy } = cabinAt(cols, rows), dy = cy + 1 - y;
        if (dy > 0 && dy < 12) {
          const mid = cx + 12.5 + Math.sin(t * .8 - dy * .5) * 1.2 + dy * .45;
          if (Math.abs(x - mid) <= 1 + dy * .12 && hash(x, Math.floor(y + t * 1.6), 17) < .55)
            return { ch: dy < 4 ? 'o' : '~', fg: '#c9d3e6', a: .4 * (1 - dy / 12) };
        }
        if (fall(3.2, .012, 31)) return { ch: '*', fg: '#ffffff', a: .7 };
        if (fall(1.6, .02, 33)) return { ch: '.', fg: '#dfe8f6', a: .45 };
        if (y < rows * .45) return twinkle(x, y, t, '#e6edf8', .01);
      },
      sprites: (cols, rows, t) => {
        const c = cabinAt(cols, rows);
        return [
          { art: frame(CABIN_ARTS, t, 1.6), pal: CABIN_PAL, key: 1, x: c.x, y: c.y, shadow: '#0a1020',
            glow: { r: 7, color: '#ffb85c', a: .32 + .06 * Math.sin(t * 3) } },
          ...TREES.map(([fx, s], i) => ({ art: frame(PINES, t, .8, i * 1.3), pal: PINE_PAL, key: 10 + i, a: .6 + .4 * s,
            x: Math.round(cols * fx), y: groundAt(Math.round(cols * fx) + 4, rows) - 11 + Math.round((1 - s) * 3), halo: '#dfe8f6' })),
        ];
      },
    };
  }

  {
    // Star Voyage: a ringed planet in the top right, a rocket that flies across the top with a puffing trail,
    // a small moon that circles the planet, shooting stars, and twinkling stars and slow dust behind.

    // The rocket points right. Its flame flickers through three frames.
    const HULL = [
      [0, 3, 'W'],
      [1, 3, 'WBBBBb'],
      [2, 3, 'WBBoBBBBNn'],
      [3, 3, 'WBBBBb'],
      [4, 3, 'W'],
    ];
    const FLAMES = [
      [[2, 0, 'fFF']],
      [[1, 1, 'f'], [2, 0, 'FFF'], [3, 1, 'f']],
      [[2, 1, 'fF'], [1, 2, 'f']],
    ];
    const ROCKET = FLAMES.map(f => sketch(13, 5, [...HULL, ...f]));
    const ROCKET_PAL = {
      B: { bg: '#dfe4f5', fg: '#6a7090', a: .95 }, b: { bg: '#aab1cc', fg: '#4a5070', a: .95 },
      W: { bg: '#ff6fb5', fg: '#5a1838', a: .95 }, o: { bg: '#4fe3ff', fg: '#0d3a4a', a: .95 },
      N: { bg: '#ff6fb5', fg: '#5a1838', a: .95 }, n: { ch: '>', fg: '#ff6fb5', a: .8 },
      F: { bg: '#ffb347', fg: '#7a3a00', a: .9 }, f: { ch: '~', fg: '#ff7a3d', a: .8 },
    };
    const SPEED = 4, ROCKET_W = 13;
    const rocketAt = (cols, rows, t) => ({
      x: drift(cols, .3, t, SPEED, ROCKET_W),
      y: rows * .12 + 1.5 * Math.sin(t * .9),
    });

    // A ringed planet, sized by the window's width and lit from the upper left.
    const planetOf = (cols, rows) => {
      const R = Math.max(4, Math.min(9, cols * .065));
      return { cx: cols * .84, cy: rows * .32, R };
    };
    const BANDS = ['#7a4cc2', '#9b5fd6', '#c76fd0', '#8a55c8', '#6a3fae'];
    const planet = (x, y, t, { cx, cy, R }) => {
      const dx = x + .5 - cx, dy = y + .5 - cy, d = Math.hypot(dx, dy);
      const ring = ell(x + .5, y + .5, cx, cy + dx * .12, R * 2.1, R * .5);
      const onRing = ring > .78 && ring < 1.05, front = dy + dx * .12 > 0;
      if (onRing && (front || d > R)) {
        const a = .55 + .25 * Math.sin(dx * .6 - t * 1.5);
        return { bg: '#e6c9ff', fg: '#5a3a80', a: d > R ? a * .8 : a, floor: .45 };
      }
      if (d <= R) {
        const band = BANDS[Math.floor(((dy / R + 1) * 2.5 + .4 * Math.sin(dx * .5 + t * .3))) % BANDS.length] ?? BANDS[0];
        const lit = (-dx - dy) / (R * 1.6);
        return { bg: shade(band, Math.max(-.55, Math.min(.25, lit))), fg: shade(band, -.6), a: .92, floor: .5 };
      }
      if (onRing || d <= R + 1.5) return near(x, y, '#c9a6ff', .22, .35);
    };

    // Shooting stars now and then, across the upper sky.
    const STREAK = sketch(8, 4, [[0, 0, '11'], [1, 2, '22'], [2, 4, '33'], [3, 6, '4H']]);
    const STREAKS = [STREAK, flip(STREAK)];
    const streakPal = ch => ({
      H: { bg: '#fff3fb', fg: '#5a3a50', a: 1 }, 4: { ch, fg: '#ffd1ea', a: .85 }, 3: { ch, fg: '#ffd1ea', a: .6 },
      2: { ch, fg: '#e6ecff', a: .4 }, 1: { ch, fg: '#e6ecff', a: .2 },
    });
    const STREAK_PALS = [streakPal('\\'), streakPal('/')];
    const EVERY = 9, FALL = 1.3;
    const shooting = (cols, rows, t) => {
      const k = Math.floor(t / EVERY), p = (t - k * EVERY) / FALL;
      if (p >= 1) return [];
      const left = hash(k, 3) < .5, run = 24 * p;
      const hx = cols * (.2 + .6 * hash(k, 1)) + (left ? -run : run), hy = rows * (.3 + .3 * hash(k, 2)) + run * .5;
      return [{ art: STREAKS[+left], pal: STREAK_PALS[+left], key: 40, a: Math.sin(Math.PI * p), x: left ? hx : hx - 7, y: hy - 3,
        glow: { r: 5, color: '#ffd1ea', a: .3 * Math.sin(Math.PI * p) } }];
    };

    const MOON = ['.mm.', 'mMMm', '.mm.'];
    const MOON_PAL = { M: { bg: '#d8dcec', fg: '#5a6080', a: .95 }, m: { bg: '#a8aec8', fg: '#4a5070', a: .9 } };

    SCENES['star-voyage'] = {
      cell: (x, y, cols, rows, t) => {
        const p = planet(x, y, t, planetOf(cols, rows));
        if (p) return p;
        // The rocket's trail: puffs left behind where it was a moment ago, fading with distance.
        const r = rocketAt(cols, rows, t), d = r.x - ROCKET_W / 2 - x;
        if (d > 0 && d < 16) {
          const ty = rocketAt(cols, rows, t - d / SPEED).y + 2;
          if (Math.abs(y + .5 - ty - .5) < .7 && hash(x, y, Math.floor(t * 5)) < .55 - d * .025)
            return { ch: d < 5 ? 'o' : '.', fg: d < 5 ? '#ffb347' : '#ffd1ea', a: .6 * (1 - d / 16) };
        }
        // Slow dust that drifts left, and twinkling stars.
        if (hash(Math.floor(x + t * .8), y, 17) < .004) return { ch: '.', fg: '#9aa6d8', a: .35 };
        return twinkle(x, y, t, '#e6ecff', .018);
      },
      sprites: (cols, rows, t) => {
        const { cx, cy, R } = planetOf(cols, rows), r = rocketAt(cols, rows, t), m = t * .35;
        const moonBehind = Math.sin(m) < 0 && Math.abs(Math.cos(m) * R * 2.8) < R + 2;
        return [
          ...shooting(cols, rows, t),
          { art: ['.'], pal: {}, x: cx - .5, y: cy - .5, key: 1, glow: { r: R * 2.2, color: '#9b5fd6', a: .22 } },
          ...(moonBehind ? [] : [{ art: MOON, pal: MOON_PAL, key: 2, shadow: '#05040d', halo: '#c9cde0',
            x: cx + Math.cos(m) * R * 2.8 - 2, y: cy + Math.sin(m) * R * .9 - 1.5 }]),
          { art: frame(ROCKET, t, 8), pal: ROCKET_PAL, key: 3, shadow: '#05040d', x: r.x - ROCKET_W / 2, y: r.y,
            glow: { r: 5, color: '#ffb347', a: .3 + .1 * Math.sin(t * 13) } },
        ];
      },
    };
  }

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
  let last;
  const sync = s => {
    const on = !(Array.isArray(s?.off) && s.off.includes(SITE.id));
    const key = JSON.stringify(on ? [s?.id, s?.look] : null); // (toggling another site repaints nothing here)
    if (key === last) return;
    last = key;
    const t = on ? resolve(s) : {};
    apply(t.bg ? { ...t, css: pageCss(t) } : t);
  };
  const KEY = 'wt';
  chrome.storage.local.get(KEY, r => sync(r[KEY]));
  chrome.storage.onChanged.addListener(ch => { if (ch[KEY]) sync(ch[KEY].newValue); });
})();
