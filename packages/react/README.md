# @ottomind-ai/icons-react

One-colour **16 × 16 pixel icons** in the ottomind style, as tree-shakable React components.
Works in React 18+ and in Server Components. Browse the set: **https://icons.ottomind.ai**

## Install

```bash
npm i @ottomind-ai/icons-react
```

## Use

```tsx
import { Folder, Bell } from '@ottomind-ai/icons-react';

<Folder />                                        // 16 px, follows the text colour
<Folder size={32} />                              // 2×
<Bell color="#b3202a" title="Notifications" />
```

| Prop | Default | |
| --- | --- | --- |
| `size` | `16` | width and height; use 16, 32, 48 or 64 so pixels stay sharp |
| `color` | `currentColor` | icon colour |
| `title` | — | accessible name; without it the icon is `aria-hidden` |

Any other SVG prop (`className`, `style`, `onClick`, `ref`, …) is passed to the `<svg>`.
Each icon is exported twice, `Folder` and `FolderIcon`, to avoid name clashes (e.g. with a router's `Link`).
Importing one icon ships only that icon (well under 1 kB).

Icons default to `currentColor`, so CSS can colour them:

```css
nav a[aria-current="page"] { color: #b3202a; }
```

Not using React? See [`@ottomind-ai/icons`](https://www.npmjs.com/package/@ottomind-ai/icons).

## Links

- Icons, search and pixel editor: https://icons.ottomind.ai
- Source, guidelines and contributing: https://github.com/ottomind-ai/icons

MIT © ottomind
