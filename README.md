# AI Chat Themes

Color themes and **live ASCII wallpapers** for [Claude](https://claude.ai), [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com) and [Zalo](https://chat.zalo.me), as a browser extension. Pick a theme from the toolbar popup.

Made by **Aohkne**. The idea comes from a post by Marko Vineli (see [Thanks](#thanks)). This is an unofficial project, not affiliated with Anthropic, OpenAI, Google or VNG (Zalo).

> **Status: experimental (v0.5.0).** Tested on Claude, ChatGPT, Gemini and Zalo. These sites change their pages often, so selectors may need updating over time.

## Demo

![Demo](demo/out/preview.gif)

[Watch the video with sound](demo/out/ai-chat-themes-demo-small.mp4)

## Themes

- **12 live wallpapers:** Moonlit, Clawd, Cloud Drift, Honu Lagoon, Koi Pond, Jellyfish, Lantern Night, Fireflies, Neon Rain, Sakura Dusk, Snow Cabin, Star Voyage.
- **5 color themes:** Sunset Cloud, Sakura, Terminal, Night Sea, Old Paper.
- Choose **Default** (or the Reset button) to go back to the site's own look.
- With a wallpaper, the sidebar becomes frosted glass so the wallpaper shows through.
- Turn the theme off per site from the **Sites** list in the popup.
- Zalo options in the popup: hide avatars, dim images and stickers (hover shows them in full), see-through message bubbles. They work with or without a theme.
- Wallpaper settings: motion (smooth or cell by cell), speed, cell size, and the backdrop behind the chat box.

## Install (Chrome, Edge, Brave)

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the [extension/](extension/) folder.
3. Open claude.ai, chatgpt.com, gemini.google.com or chat.zalo.me, click the extension icon and pick a theme.

`extension/` already contains the built `theme.js`. If you change the code in `src/`, rebuild it:

```bash
node tools/build.mjs
```

Firefox: the manifest is MV3, but it has not been tested.

The icons in `extension/icons/` are drawn by `python3 tools/icon.py` (needs Pillow).

## How it works

- The popup saves your choice to `chrome.storage.local` (key `wt`).
- The content script `theme.js` runs on claude.ai, chatgpt.com (and chat.openai.com) gemini.google.com and chat.zalo.me. It reads that choice, overrides the page's color variables and adds a small piece of CSS. What is specific to each site lives in an adapter in [src/sites.js](src/sites.js).
- For wallpapers, it draws a fixed `<canvas>` behind the page. Each wallpaper is a scene in [src/scenes/](src/scenes/).
- Changing theme does not need a page reload.

## Safety

- The code makes no network requests. The extension asks only for the `storage` permission and runs only on the sites above.
- Theme CSS is filtered: `@import`, any `url()` other than `data:`, and backslashes are refused.
- No scene JavaScript is loaded from outside. Only the scenes in `src/scenes/` are built into `theme.js`.

## Structure

```
src/             source: core.js, engine.js, themes.js, sites.js (per-site adapters), scenes/
tools/build.mjs  builds src/ into extension/theme.js
tools/icon.py    draws the extension icon
extension/       the folder to Load unpacked: manifest, popup, theme.js
```

## Thanks

Thanks to **Marko Vineli** ([@handsher_NGU](https://x.com/handsher_NGU)) for the idea of live ASCII wallpapers for AI chat: [the post on X](https://x.com/handsher_NGU/status/2116923517308735848).

## License

MIT. See [LICENSE](LICENSE).
