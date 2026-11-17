// Tests the lint rules and every built output. Run after `npm run build`.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ROOT, bitmapToNodes, listIconNames, pathToBitmap, readIcon } from './lib.mjs';
import { lintIcon } from './lint.mjs';

const ICONS_DIST = join(ROOT, 'packages/icons/dist');
const REACT_DIST = join(ROOT, 'packages/react/dist');
const names = listIconNames();

const EMPTY_ROW = '................';
const blank = () => Array.from({ length: 16 }, () => EMPTY_ROW);
const withPixel = (rows, y, x, ch = '#') => rows.map((r, i) => (i === y ? r.slice(0, x) + ch + r.slice(x + 1) : r));
const good = { tags: ['t'], categories: ['actions'], pixels: withPixel(blank(), 5, 5) };
const lint = (data, name = 'test-icon') => lintIcon({ name, data, error: null }, new Set(['taken']));
const hasError = (result, re) => result.errors.some((e) => re.test(e));

// ---------------------------------------------------------------------------
test('lint: a clean icon passes', () => {
  assert.deepEqual(lint(good).errors, []);
});
test('lint: catches rule violations', () => {
  assert.ok(hasError(lint({ ...good, pixels: withPixel(good.pixels, 0, 5) }), /padding/));
  assert.ok(hasError(lint({ ...good, pixels: withPixel(good.pixels, 7, 15) }), /padding/));
  assert.ok(hasError(lint({ ...good, pixels: withPixel(good.pixels, 7, 7, 'x') }), /not allowed/));
  assert.ok(hasError(lint({ ...good, pixels: good.pixels.slice(1) }), /16 strings/));
  assert.ok(hasError(lint({ ...good, pixels: blank() }), /empty/));
  assert.ok(hasError(lint({ ...good, pixels: withPixel(good.pixels, 6, 6, '+') }), /one colour/));
  assert.ok(hasError(lint({ ...good, categories: ['nope'] }), /unknown categories/));
  assert.ok(hasError(lint({ ...good, tags: [] }), /tags/));
  assert.ok(hasError(lint({ ...good, aliases: ['taken'] }), /collides/));
  assert.ok(hasError(lint(good, 'BadName'), /kebab-case/));
  assert.ok(hasError(lintIcon({ name: 'x', data: null, error: 'Unexpected token' }, new Set()), /invalid JSON/));
});

test('geometry: paths reproduce every icon pixel for pixel', () => {
  for (const name of names) {
    const { pixels } = readIcon(name).data;
    const nodes = bitmapToNodes(pixels);
    assert.equal(nodes.length, 1, `${name}: one path`);
    assert.deepEqual(pathToBitmap(nodes[0][1].d, 16, '#'), pixels, name);
  }
});

// ---------------------------------------------------------------------------
test('build: every distributable exists', () => {
  for (const f of ['index.js', 'index.d.ts', 'to-svg.js', 'sprite.svg', 'iconify.json', 'metadata.json'])
    assert.ok(existsSync(join(ICONS_DIST, f)), f);
  for (const n of names) {
    assert.ok(existsSync(join(ICONS_DIST, 'svg', `${n}.svg`)), `svg/${n}.svg`);
    assert.ok(existsSync(join(REACT_DIST, 'icons', `${n}.js`)), `react icons/${n}.js`);
  }
  const meta = JSON.parse(readFileSync(join(ICONS_DIST, 'metadata.json'), 'utf8'));
  assert.equal(meta.count, names.length);
  assert.equal(meta.icons[names[0]].pixels.length, 16);
  const sprite = readFileSync(join(ICONS_DIST, 'sprite.svg'), 'utf8');
  assert.equal((sprite.match(/<symbol /g) || []).length, names.length);
});

test('iconify: valid collection shape', () => {
  const data = JSON.parse(readFileSync(join(ICONS_DIST, 'iconify.json'), 'utf8'));
  assert.equal(data.prefix, 'ottomind');
  assert.equal(data.width, 16);
  assert.equal(Object.keys(data.icons).length, names.length);
  for (const [alias, { parent }] of Object.entries(data.aliases)) assert.ok(data.icons[parent], `${alias} -> ${parent}`);
  for (const { body } of Object.values(data.icons)) assert.match(body, /^<g fill="currentColor" shape-rendering="crispEdges">/);
});

// ---------------------------------------------------------------------------
test('toSvg: defaults and options', async () => {
  const m = await import('@ottomind-ai/icons');
  const plain = m.toSvg(m.arrowRight, { name: 'arrow-right' });
  assert.match(plain, /width="16" height="16" viewBox="0 0 16 16" fill="currentColor" shape-rendering="crispEdges"/);
  assert.match(plain, /aria-hidden="true"/);
  assert.match(plain, /class="om-icon om-icon-arrow-right"/);
  assert.doesNotMatch(plain, /om-accent/);

  const big = m.toSvg(m.arrowRight, { size: 32, color: '#111', title: 'Next <go>' });
  assert.match(big, /width="32"/);
  assert.match(big, /fill="#111"/);
  assert.match(big, /role="img"/);
  assert.match(big, /<title>Next &lt;go&gt;<\/title>/);
  assert.equal((m.toSvg(m.bell).match(/<path /g) || []).length, 1, 'one path per icon');
});

test('react: renders with props and a11y', async () => {
  const { ArrowRight, ArrowRightIcon, Bell } = await import('@ottomind-ai/icons-react');
  assert.equal(ArrowRight, ArrowRightIcon);
  assert.equal(ArrowRight.displayName, 'ArrowRight');

  const html = renderToStaticMarkup(createElement(ArrowRight));
  assert.match(html, /width="16" height="16" viewBox="0 0 16 16" fill="currentColor" shape-rendering="crispEdges"/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /class="om-icon om-icon-arrow-right"/);

  const sized = renderToStaticMarkup(createElement(ArrowRight, { size: 48, className: 'mine', 'data-x': '1' }));
  assert.match(sized, /width="48" height="48"/);
  assert.match(sized, /class="om-icon om-icon-arrow-right mine"/);
  assert.match(sized, /data-x="1"/);

  const titled = renderToStaticMarkup(createElement(Bell, { title: 'Notifications', color: 'red' }));
  assert.match(titled, /role="img"/);
  assert.match(titled, /fill="red"/);
  assert.match(titled, /<title>Notifications<\/title>/);
  assert.doesNotMatch(titled, /aria-hidden/);
});

test('tree-shaking: importing one icon ships one icon', async () => {
  const bundle = async (contents) => {
    const out = await build({
      stdin: { contents, resolveDir: ROOT, loader: 'js' },
      bundle: true,
      write: false,
      minify: true,
      format: 'esm',
      external: ['react'],
      logLevel: 'silent',
    });
    return out.outputFiles[0].text;
  };
  const { arrowRight, home } = await import('@ottomind-ai/icons');
  const reactOut = await bundle("import { ArrowRight } from '@ottomind-ai/icons-react'; console.log(ArrowRight);");
  assert.ok(reactOut.includes(arrowRight[0][1].d));
  assert.ok(!reactOut.includes(home[0][1].d), 'home icon leaked into the bundle');
  const coreOut = await bundle("import { search, toSvg } from '@ottomind-ai/icons'; console.log(toSvg(search));");
  assert.ok(!coreOut.includes(home[0][1].d));
  console.log(`    react bundle for one icon: ${reactOut.length} bytes (minified, react external)`);
});

test('types: a TSX consumer compiles', () => {
  execFileSync(process.execPath, [join(ROOT, 'node_modules/typescript/bin/tsc'), '-p', join(ROOT, 'tests/tsconfig.json')], {
    stdio: 'pipe',
  });
});
