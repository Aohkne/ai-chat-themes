// Builds extension/theme.js (the content script) and extension/themes.js (the popup's copy) from src/.
// theme.js is one function: themes.js, sites.js, core.js, each scene in its own block (so a scene's names stay its own), engine.js.
// Run: node tools/build.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const src = new URL('../src/', import.meta.url), out = new URL('../extension/', import.meta.url)
const read = f => readFileSync(new URL(f, src), 'utf8').replace(/\r\n/g, '\n').trimEnd()
const indent = (text, by) => text.replace(/^(?=.)/gm, ' '.repeat(by))

const scenes = readdirSync(new URL('scenes/', src)).filter(f => f.endsWith('.js')).sort().map(f => read(`scenes/${f}`))
const js = ['// Built by tools/build.mjs from src/: edit there, then build.', '(() => {',
  indent(read('themes.js'), 2), '', indent(read('sites.js'), 2), '', indent(read('core.js'), 2), '',
  ...scenes.flatMap(s => ['  {', indent(s, 4), '  }', '']), indent(read('engine.js'), 2), '})();', ''].join('\n')

writeFileSync(new URL('theme.js', out), js)
writeFileSync(new URL('themes.js', out), read('themes.js') + '\n')
console.log(`built extension/theme.js (${scenes.length} scenes, ${js.length} bytes)`)
