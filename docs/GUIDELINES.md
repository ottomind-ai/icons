# Design guidelines

ottomind icons are **one-colour pixel icons on a 16 × 16 grid**, in the same family as the ottomind
pixel wordmark and the crazigo page icons. Rules marked **[lint]** are enforced by `npm run lint`.

## 1. Source format

Every icon is one file, `icons/<name>.json`:

```json
{
  "tags": ["notification", "alert", "bildirim", "zil"],
  "categories": ["status"],
  "pixels": [
    "................",
    "................",
    ".......##.......",
    "......####......",
    "..."
  ]
}
```

| Character | Meaning |
| --- | --- |
| `.` | empty |
| `#` | filled, in the icon's colour (`color`, default `currentColor`) |

16 rows of 16 characters, only `.` and `#` **[lint]**. The set is one colour: there is no second
or accent colour. Emphasis comes from shape (a solid block, a 2 px bar), never from colour.

The build turns pixels into merged rectangles, so files stay small and every output (React, SVG,
sprite, Iconify) is generated from this one source.

Draw in any text editor, or in the preview site's editor (`> draw an icon`) and copy the JSON.

## 2. Grid

| Rule | Value |
| --- | --- |
| Canvas | 16 × 16 |
| Padding | outer 1 px stays empty **[lint]** → 14 × 14 live area |
| Display sizes | 16, 32, 48, 64 px. Other sizes blur or give uneven pixels. |
| Even grid | Symmetric shapes use even widths (2, 4, … 12) so they centre exactly |

## 3. Line weight

- **1 px** for outlines: boxes, circles, documents, devices.
- **2 px** for stand-alone glyphs and bars: `plus`, `minus`, `close`, `check`, `menu`, `list`, `bar-chart`.
- **45° strokes use 2 px steps** (`##` shifted one pixel per row) so diagonals keep the same visual
  weight as straight lines: arrow heads, chevrons, `check`, `send`, `trending-up`.
- Square corners on boxes (terminal look). Round shapes use the shared 12 px ring
  (see `info`, `clock`, `help`) so all circles match.

## 4. Colour

- One colour per icon. Products colour icons with `color` or CSS (`color: …`, since the default is
  `currentColor`), for example cherry for the open page in a menu.
- Small solid details (the clapper in `bell`, the core of `cpu`, the sun in `image`) carry emphasis
  instead of a second colour.

## 5. Naming

- kebab-case English, starting with a letter **[lint]**: `file-text`, `arrow-up-right`.
- Name **what it shows**, not what it does: `trash`, not `delete`. Meanings go in tags.
- Base noun first, modifier after: `file`, `file-text`, `user`, `user-plus`.
- No third-party logos (trademarks).
- Renaming an icon: keep the old name in `aliases` so nobody's build breaks **[lint]** checks collisions.

## 6. Tags and categories

- `tags`: what people will search for, **English and Turkish** (`delete, remove, sil, çöp`).
- `categories`: from `icons.config.json`; the first is the primary one.

## 7. Review checklist (every PR)

- [ ] `npm run check` passes
- [ ] Looks right at 16 px (1×) and 32 px (2×) next to its neighbours in the preview site
- [ ] Weight matches the rules in §3; no stray single pixels unless they are deliberate dots
- [ ] Name follows §5, tags cover the obvious searches in both languages
- [ ] Changeset added
