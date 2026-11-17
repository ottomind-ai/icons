// Scaffold a new icon: npm run new -- <name> --category ai --tags "robot, agent, ajan"
// Then draw in icons/<name>.json with # (or in the preview site's editor and paste the JSON).
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ICONS_DIR, NAME_RE, config } from './lib.mjs';

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const opt = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

if (!name || !NAME_RE.test(name)) {
  console.error('Usage: npm run new -- <kebab-name> --category <category> --tags "tag one, tag two"');
  process.exit(1);
}
const file = join(ICONS_DIR, `${name}.json`);
if (existsSync(file)) {
  console.error(`icons/${name}.json already exists`);
  process.exit(1);
}
const category = opt('--category') || 'actions';
if (!config.categories.includes(category)) {
  console.error(`Unknown category "${category}". Use one of: ${config.categories.join(', ')}`);
  process.exit(1);
}
const tags = (opt('--tags') || name.replace(/-/g, ' ')).split(',').map((t) => t.trim()).filter(Boolean);
const rows = Array.from({ length: config.grid }, () => `    "${'.'.repeat(config.grid)}"`);

writeFileSync(
  file,
  `{\n  "tags": ${JSON.stringify(tags)},\n  "categories": ${JSON.stringify([category])},\n  "pixels": [\n${rows.join(',\n')}\n  ]\n}\n`,
);
console.log(`created icons/${name}.json — draw with #, keep the outer ${config.padding}px empty`);
