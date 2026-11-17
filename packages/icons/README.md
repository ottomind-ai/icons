# @ottomind-ai/icons

One-colour **16 × 16 pixel icons** in the ottomind style, for any framework or none.
Browse the set: **https://icons.ottomind.ai**

Using React? Install [`@ottomind-ai/icons-react`](https://www.npmjs.com/package/@ottomind-ai/icons-react) instead.

## Install

```bash
npm i @ottomind-ai/icons
```

## Use

```js
import { toSvg, folder } from '@ottomind-ai/icons';

el.innerHTML = toSvg(folder);                     // 16 px, currentColor
el.innerHTML = toSvg(folder, { size: 32, color: '#b3202a', title: 'Projects' });
```

| Option | Default | |
| --- | --- | --- |
| `size` | `16` | width and height; use 16, 32, 48 or 64 so pixels stay sharp |
| `color` | `currentColor` | icon colour |
| `title` | — | accessible name; without it the icon is `aria-hidden` |
| `name` | — | adds the `om-icon-<name>` class |
| `class`, `attributes` | — | extra class names / attributes on the `<svg>` |

Icon exports are camelCase (`arrowRight`, `checkSquare`); importing one icon ships only that icon.

### Files

| Path | What |
| --- | --- |
| `@ottomind-ai/icons/svg/<name>.svg` | one SVG file per icon |
| `@ottomind-ai/icons/sprite.svg` | every icon as `<symbol id="om-<name>">` |
| `@ottomind-ai/icons/iconify.json` | Iconify collection (prefix `ottomind`) |
| `@ottomind-ai/icons/metadata.json` | names, tags (EN + TR), categories and source pixels |

Without installing anything:

```html
<img src="https://cdn.jsdelivr.net/npm/@ottomind-ai/icons/dist/svg/folder.svg" width="16" height="16" alt="">
```

## Links

- Icons, search and pixel editor: https://icons.ottomind.ai
- Source, guidelines and contributing: https://github.com/ottomind-ai/icons

MIT © ottomind
