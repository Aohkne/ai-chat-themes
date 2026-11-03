// One adapter per chat site: what is specific to its page. Everything else (engine, scenes, popup) is shared.
//   hosts     hostnames the adapter is for
//   sidebar   selector of the sidebar (shape-checked in glass(): a narrow element is the sidebar)
//   composer  selector of the prompt box (the wallpaper dims around its column, and it gets a glass look)
//   vars(c)   the site's own color variables for a palette c (see core.js, paletteOf); [name, value] pairs
//   hide      selectors that must turn transparent for a wallpaper to show
//   halo      selectors of the message text, given a soft outline for reading over a wallpaper
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
[data-wt-glass] { background: transparent !important; }
[data-wt-glass=root] {
  background: var(--wall-glass) !important; border-right: 1px solid var(--wall-rim) !important;
  backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);
}
` : ''}`;
