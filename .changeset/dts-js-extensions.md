---
'@ottomind-ai/icons': patch
'@ottomind-ai/icons-react': patch
---

React types work under `moduleResolution: NodeNext`/`Node16`: the relative imports in the `.d.ts` files name their `.js` file. Before, TypeScript could not follow them there, so every icon was typed `any` and `OttomindIcon`/`IconProps` were missing (crazigo's panel builds this way).
