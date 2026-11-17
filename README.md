<p align="center"><strong><code>&gt;ottomind icons</code></strong></p>

<p align="center">Open-source one-colour 16 × 16 pixel icons in the ottomind style.<br>React components, plain SVG, sprite and Iconify.</p>

104 icons: interface basics, documents, AI and development, games, media and commerce, with English
and Turkish tags. Drawn as text bitmaps, so anyone can add one — see [the guidelines](docs/GUIDELINES.md).

## Packages

| Package | What |
| --- | --- |
| [`@ottomind-ai/icons-react`](packages/react) | Tree-shakable React components (React 18+, works in Server Components) |
| [`@ottomind-ai/icons`](packages/icons) | Framework-agnostic data + `toSvg()`, SVG files, sprite, Iconify JSON, metadata with source pixels |

## Use

### React

```bash
npm i @ottomind-ai/icons-react
```

```tsx
import { ArrowRight, Bell } from '@ottomind-ai/icons-react';

<ArrowRight />                         // 16 px, currentColor
<ArrowRight size={32} />               // 2×
<Bell color="#b3202a" title="Notifications" />
```

| Prop | Default | |
| --- | --- | --- |
| `size` | `16` | width and height; use 16, 32, 48 or 64 so pixels stay sharp |
| `color` | `currentColor` | icon colour |
| `title` | — | accessible name; without it the icon is `aria-hidden` |

Every component is exported twice (`ArrowRight` and `ArrowRightIcon`) to avoid clashes such as `Link`.

### Colour with CSS

Icons are one colour and default to `currentColor`, so they follow the text around them:

```css
nav a[aria-current="page"] { color: #b3202a; }   /* the open page's icon turns cherry */
.om-icon-bell { animation: blink 1s steps(2) infinite; }
```

### Any framework / plain HTML

```js
import { toSvg, arrowRight } from '@ottomind-ai/icons';
el.innerHTML = toSvg(arrowRight, { size: 32, name: 'arrow-right' });
```

```html
<!-- single file from a CDN -->
<img src="https://cdn.jsdelivr.net/npm/@ottomind-ai/icons/dist/svg/arrow-right.svg" alt="" width="16" height="16">

<!-- sprite -->
<svg class="om-icon" width="16" height="16"><use href="/sprite.svg#om-arrow-right"/></svg>
```

### Iconify

`@ottomind-ai/icons/iconify.json` is a ready Iconify collection (prefix `ottomind`), so the set works
wherever Iconify does: Vue, Svelte, Astro, Tailwind plugins, Figma plugins.

## Add an icon

```bash
npm install
npm run new -- robot-arm --category ai --tags "automation, robot, robot kol"
# draw in icons/robot-arm.json with # (filled) and . (empty)
# or draw it in the preview site's editor and paste the copied JSON
npm run check        # lint + build + tests
npm run changeset    # describe the change
```

After a build, open `site/dist/index.html` to browse the set, change size and colours, copy SVG/JSX
or open any icon in the pixel editor.

## Repo layout

```
icons/                 one JSON per icon: tags, categories, 16×16 pixels (the only place to edit icons)
icons.config.json      grid, padding, categories (EN + TR)
scripts/               lint, build, test, new-icon
packages/icons/        @ottomind-ai/icons (src/ hand-written, dist/ generated)
packages/react/        @ottomind-ai/icons-react (src/ hand-written, dist/ generated)
site/                  preview + editor template → site/dist (deploy to icons.ottomind.ai)
docs/GUIDELINES.md     design rules
```

## Release

Changesets + GitHub Actions + npm trusted publishing (no npm token stored anywhere).
Merge PRs with changesets → a "Version Packages" PR opens → merging it publishes both packages to npm.

One-time setup: create the `ottomind-ai` org on npmjs.com, publish the first version of both packages by
hand (`npm login`, then `npm run build && npm publish -w packages/icons -w packages/react`), then on each
package's npmjs.com settings add a trusted publisher: GitHub Actions, `ottomind-ai/icons`, workflow
`release.yml`, with direct `npm publish` allowed.

The site (icons.ottomind.ai) is deployed to GitHub Pages by the same workflow whenever `main` has no
pending changesets, so it always matches what is installable. Repo Settings → Pages → Source: "GitHub Actions",
custom domain `icons.ottomind.ai` (DNS: `CNAME icons → ottomind-ai.github.io`). It is a plain static
build, so any static host works too: build `npm ci && npm run build`, publish `site/dist`.

## License

MIT © ottomind
