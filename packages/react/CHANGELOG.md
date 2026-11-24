# @ottomind-ai/icons-react

## 0.3.1

### Patch Changes

- 75f8030: React types work under `moduleResolution: NodeNext`/`Node16`: the relative imports in the `.d.ts` files name their `.js` file. Before, TypeScript could not follow them there, so every icon was typed `any` and `OttomindIcon`/`IconProps` were missing (crazigo's panel builds this way).

## 0.3.0

### Minor Changes

- 503f75c: 2 new icons: shelf, pen-tool. ottomind hub uses them for its asset shelves and the corpus "design" kind.

## 0.2.0

### Minor Changes

- 48 new icons: video, mic, volume-off, stop, skip-forward, skip-back, sort, caret-up, caret-down, undo, redo, log-in, log-out, share, sliders, eye-off, unlock, maximize, minimize, zoom-in, globe, bookmark, layers, sidebar, pin, map, plane, inbox, phone, bell-off, monitor, smartphone, wifi, git-merge, credit-card, truck, receipt, percent, puzzle, gem, file-plus, file-check, files, lightbulb, chart-pie, zap, hash, user-check. `prompt` moves to the development category; the brand category is gone.

## 0.1.1

### Patch Changes

- Add package READMEs so the npm pages show install and usage instructions.
