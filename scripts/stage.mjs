// Stages every package whose version is not on npm yet (`npm stage publish`).
// A staged version is not installable until a maintainer approves it with 2FA:
// npmjs.com → account settings → Staged Packages, or `npm stage list` + `npm stage approve <id>`.
//
// Run by the release workflow instead of `changeset publish`, because the trusted publishers
// on npm are stage-only: a direct `npm publish` from CI is rejected.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';

const PACKAGES = ['packages/icons', 'packages/react'];

const summary = (line) => {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, line + '\n');
};

function onNpm(name, version) {
  try {
    const out = execFileSync('npm', ['view', `${name}@${version}`, 'version', '--prefer-online'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() === version;
  } catch {
    return false; // E404 and friends: treat as not published
  }
}

let staged = 0;
let failed = 0;

for (const dir of PACKAGES) {
  const pkg = JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));
  if (pkg.private) continue;
  const id = `${pkg.name}@${pkg.version}`;

  if (onNpm(pkg.name, pkg.version)) {
    console.log(`${id} is already on npm, skipping`);
    continue;
  }

  console.log(`staging ${id}`);
  try {
    execFileSync('npm', ['stage', 'publish'], { cwd: dir, stdio: 'inherit' });
    summary(`- staged \`${id}\`, waiting for approval on npm`);
    staged++;
  } catch {
    console.log(
      `::error::could not stage ${id}. If it is already waiting for approval, approve or reject it on npm first.`,
    );
    failed++;
  }
}

if (staged) {
  summary('');
  summary('Approve on npmjs.com → account settings → Staged Packages (2FA), or with `npm stage approve <id>`.');
}
if (!staged && !failed) console.log('nothing to stage: every package version is already on npm');
process.exit(failed ? 1 : 0);
