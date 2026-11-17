// Enforces the set's design and source rules. `npm run lint`
import { pathToFileURL } from 'node:url';
import { EMPTY, FILLED, NAME_RE, config, listIconNames, readIcon } from './lib.mjs';

const ALLOWED = new Set([EMPTY, FILLED]);

export function lintIcon(icon, allNames) {
  const errors = [];
  const warnings = [];
  const { name, data, error } = icon;
  const G = config.grid;
  const P = config.padding;

  if (!NAME_RE.test(name)) errors.push('name must be kebab-case and start with a letter (e.g. "file-text")');
  if (error) {
    errors.push(`invalid JSON: ${error}`);
    return { errors, warnings };
  }
  if (!data) {
    errors.push('missing icon data');
    return { errors, warnings };
  }

  // ---- metadata
  const { tags, categories, aliases, pixels } = data;
  if (!Array.isArray(tags) || tags.length === 0 || tags.some((t) => typeof t !== 'string' || !t.trim()))
    errors.push('tags must be a non-empty array of strings');
  if (!Array.isArray(categories) || categories.length === 0) errors.push('categories must be a non-empty array');
  else {
    const unknown = categories.filter((c) => !config.categories.includes(c));
    if (unknown.length) errors.push(`unknown categories: ${unknown.join(', ')} (see icons.config.json)`);
  }
  if (aliases !== undefined) {
    if (!Array.isArray(aliases)) errors.push('aliases must be an array');
    else
      for (const alias of aliases) {
        if (!NAME_RE.test(alias)) errors.push(`alias "${alias}" is not kebab-case`);
        if (allNames.has(alias)) errors.push(`alias "${alias}" collides with an existing icon`);
      }
  }

  // ---- pixels
  if (!Array.isArray(pixels) || pixels.length !== G || pixels.some((r) => typeof r !== 'string' || r.length !== G)) {
    errors.push(`pixels must be ${G} strings of ${G} characters`);
    return { errors, warnings };
  }
  let filled = 0;
  pixels.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (!ALLOWED.has(ch)) {
        errors.push(`row ${y + 1}, col ${x + 1}: "${ch}" is not allowed (use . and #, the set is one colour)`);
        return;
      }
      if (ch === EMPTY) return;
      filled++;
      if (y < P || x < P || y >= G - P || x >= G - P)
        errors.push(`row ${y + 1}, col ${x + 1}: inside the ${P}px padding`);
    });
  });
  if (filled === 0) errors.push('icon is empty — draw with #');
  const live = (G - 2 * P) ** 2;
  const coverage = filled / live;
  if (coverage < 0.06) warnings.push(`very light (${Math.round(coverage * 100)}% of the live area)`);
  if (coverage > 0.55) warnings.push(`very heavy (${Math.round(coverage * 100)}% of the live area)`);

  return { errors, warnings };
}

export function lintAll({ quiet = false } = {}) {
  const names = listIconNames();
  const allNames = new Set(names);
  const results = [];
  const aliasOwner = new Map();
  const shapes = new Map();

  for (const name of names) {
    const icon = readIcon(name);
    const result = lintIcon(icon, allNames);
    for (const alias of icon.data?.aliases || []) {
      if (aliasOwner.has(alias)) result.errors.push(`alias "${alias}" is also used by ${aliasOwner.get(alias)}`);
      else aliasOwner.set(alias, name);
    }
    if (!result.errors.length) {
      const key = icon.data.pixels.join('');
      if (shapes.has(key)) result.warnings.push(`same pixels as "${shapes.get(key)}"`);
      else shapes.set(key, name);
    }
    results.push({ name, ...result });
  }

  const errorCount = results.reduce((n, r) => n + r.errors.length, 0);
  const warningCount = results.reduce((n, r) => n + r.warnings.length, 0);
  if (!quiet) {
    for (const r of results) {
      if (!r.errors.length && !r.warnings.length) continue;
      console.log(`\n${r.name}`);
      for (const e of r.errors) console.log(`  ✖ ${e}`);
      for (const w of r.warnings) console.log(`  ⚠ ${w}`);
    }
    console.log(`\n${names.length} icons · ${errorCount} errors · ${warningCount} warnings`);
  }
  return { results, errorCount, warningCount, names };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errorCount } = lintAll();
  process.exit(errorCount ? 1 : 0);
}
