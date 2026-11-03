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
