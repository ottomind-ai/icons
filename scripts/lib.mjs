// Shared helpers for lint / build / test.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ICONS_DIR = join(ROOT, 'icons');
export const config = JSON.parse(readFileSync(join(ROOT, 'icons.config.json'), 'utf8'));

export const NAME_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export const FILLED = '#';
export const EMPTY = '.';

export const toPascal = (name) =>
  name
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
export const toCamel = (name) => {
  const pascal = toPascal(name);
  return pascal[0].toLowerCase() + pascal.slice(1);
};

// ---------------------------------------------------------------------------
// Bitmap -> geometry
// ---------------------------------------------------------------------------

/** Greedy rectangle cover of every `ch` pixel: [x, y, w, h][]. */
export function bitmapToRects(pixels, ch) {
  const h = pixels.length;
  const w = pixels[0].length;
  const used = Array.from({ length: h }, () => new Array(w).fill(false));
  const rects = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (pixels[y][x] !== ch || used[y][x]) continue;
      let x2 = x;
      while (x2 + 1 < w && pixels[y][x2 + 1] === ch && !used[y][x2 + 1]) x2++;
      let y2 = y;
      grow: while (y2 + 1 < h) {
        for (let k = x; k <= x2; k++) if (pixels[y2 + 1][k] !== ch || used[y2 + 1][k]) break grow;
        y2++;
      }
      for (let yy = y; yy <= y2; yy++) for (let k = x; k <= x2; k++) used[yy][k] = true;
      rects.push([x, y, x2 - x + 1, y2 - y + 1]);
    }
  }
  return rects;
}

export const rectsToPath = (rects) => rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h-${w}z`).join('');

/** Icon node: a single path covering every filled pixel. */
export function bitmapToNodes(pixels) {
  return [['path', { d: rectsToPath(bitmapToRects(pixels, FILLED)) }]];
}

/** Inverse of rectsToPath for the paths we generate (used by tests). */
export function pathToBitmap(d, size = config.grid, ch = FILLED) {
  const grid = Array.from({ length: size }, () => new Array(size).fill(EMPTY));
  for (const m of d.matchAll(/M(\d+) (\d+)h(\d+)v(\d+)h-\d+z/g)) {
    const [x, y, w, h] = m.slice(1).map(Number);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) grid[yy][xx] = ch;
  }
  return grid.map((r) => r.join(''));
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export function listIconNames() {
  if (!existsSync(ICONS_DIR)) return [];
  return readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5))
    .sort();
}

export function readIcon(name) {
  const raw = readFileSync(join(ICONS_DIR, `${name}.json`), 'utf8');
  try {
    return { name, data: JSON.parse(raw), error: null };
  } catch (err) {
    return { name, data: null, error: err.message };
  }
}
