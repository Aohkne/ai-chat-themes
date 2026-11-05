// The picker. Writes { id, look, off, <site id>: options } to chrome.storage.local under "wt"; theme.js on claude.ai paints it live.
const KEY = 'wt', LOOK = { motion: 'grid', speed: 4, cell: 14, veil: .4 };
const CHOICES = {
  motion: [['grid', 'Cell by cell'], ['smooth', 'Smooth']],
  speed: [1, 2, 4, 8, 16].map(v => [v, `${v}x`]),
  cell: [[14, 'S'], [18, 'M'], [22, 'L']],
  veil: [0, .2, .4, .6, .8].map(v => [v, `${v * 100}%`]),
};
// the sites theme.js runs on (ids as in src/sites.js); `off` lists the ones the person turned off
const SITES = { 'ai-sites': [['claude', 'Claude'], ['chatgpt', 'ChatGPT'], ['gemini', 'Gemini']], 'social-sites': [['zalo', 'Zalo']] };
// options of one site, stored under its id (see extras in src/sites.js)
const OPTIONS = { zalo: [['hideAvatars', 'Hide avatars'], ['dimImages', 'Dim images'], ['dimStickers', 'Dim stickers'], ['clearBubbles', 'See-through bubbles']] };
const $ = id => document.getElementById(id);
// opt-in sites (optIn in src/sites.js) start off
const OFF = ['zalo'];
let state = { id: 'claude', look: { ...LOOK }, off: OFF };
const save = () => chrome.storage.local.set({ [KEY]: state });

const tile = t => {
  const b = document.createElement('button');
  const live = !!t.wallpaper;
  b.className = 'tile' + (live ? '' : ' color') + (t.id === state.id ? ' on' : '');
  b.style.background = t.vars?.['wall-sky'] ?? (t.bg ? `linear-gradient(135deg, ${t.bg}, ${t.bg} 55%, ${t.accent})` : '#3a3835');
  b.style.setProperty('--a', t.accent ?? '#d97757');
  b.title = t.tagline;
  b.innerHTML = '<i class="dot"></i><span class="label"></span>';
  b.querySelector('.label').textContent = t.name;
  b.onclick = () => { state = { ...state, id: t.id }; save(); draw(); };
  return b;
};

const check = (name, checked, change) => {
  const row = document.createElement('label'), box = document.createElement('input');
  row.className = 'site';
  box.type = 'checkbox';
  box.checked = checked;
  box.onchange = () => change(box.checked);
  row.append(box, name);
  return row;
};

const draw = () => {
  const cur = THEMES.find(t => t.id === state.id) ?? THEMES[0];
  $('walls').replaceChildren(...THEMES.filter(t => t.wallpaper).map(tile));
  $('colors').replaceChildren(...THEMES.filter(t => !t.wallpaper).map(tile));
  $('now').textContent = cur.id === 'claude' ? 'Using the site\'s own look' : `${cur.name}: ${cur.tagline}`;
  $('off').style.visibility = cur.id === 'claude' ? 'hidden' : 'visible';
  $('look').hidden = !cur.wallpaper;
  document.documentElement.style.setProperty('--accent', cur.accent ?? '#d97757');
  for (const [list, sites] of Object.entries(SITES)) $(list).replaceChildren(...sites.map(([id, name]) => check(name, !state.off.includes(id), on => {
    state = { ...state, off: on ? state.off.filter(x => x !== id) : [...state.off, id] };
    save();
    draw();
  })));
  for (const [site, opts] of Object.entries(OPTIONS)) {
    $(site).hidden = state.off.includes(site);
    $(`${site}-opts`).replaceChildren(...opts.map(([k, name]) => check(name, !!state[site]?.[k], on => {
      state = { ...state, [site]: { ...state[site], [k]: on } };
      save();
    })));
  }
  for (const seg of document.querySelectorAll('.seg')) {
    const k = seg.dataset.key;
    seg.replaceChildren(...CHOICES[k].map(([v, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.className = state.look[k] === v ? 'on' : '';
      b.onclick = () => { state = { ...state, look: { ...state.look, [k]: v } }; save(); draw(); };
      return b;
    }));
  }
};

$('off').onclick = () => { state = { ...state, id: 'claude' }; save(); draw(); };
chrome.storage.local.get(KEY, r => {
  if (r[KEY]) state = { ...r[KEY], look: { ...LOOK, ...r[KEY].look }, off: Array.isArray(r[KEY].off) ? r[KEY].off : OFF };
  draw();
});
