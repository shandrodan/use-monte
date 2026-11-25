#!/usr/bin/env node
// Installs the Monte payload into a project. Copies files and edits package.json only: it never runs a package
// manager, never touches the root layout and never commits. The agent does those steps (see SKILL.md).
//
//   node <skill>/scripts/install.mjs [target=.] [--dry-run] [--force] [--skills] [--showcase]
//
// Exit codes, each one a stop the skill names:
//   0 installed (or dry run clean)   3 not a React project        4 Tailwind below v4
//   5 no "@/*" path alias            6 Monte already installed     2 bad arguments
import {cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, symlinkSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAYLOAD = join(SKILL, 'payload');
const manifest = JSON.parse(readFileSync(join(SKILL, 'manifest.json'), 'utf8'));

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const known = new Set(['--dry-run', '--force', '--skills', '--showcase']);
for (const f of flags) if (!known.has(f)) stop(2, `unknown flag ${f}`);
const target = resolve(args.find(a => !a.startsWith('--')) ?? '.');
const dry = flags.has('--dry-run');
const report = {target, dryRun: dry, root: null, copied: [], deps: {added: [], kept: []}, skills: [], next: []};

function stop(code, message) {
  console.error(`monte install: ${message}`);
  process.exit(code);
}
// tsconfig is JSONC: drop comments and trailing commas outside strings ("**/*.ts" holds a /* that is not a comment).
function readJson(file) {
  const src = readFileSync(file, 'utf8');
  let out = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') j += src[j] === '\\' ? 2 : 1;
      out += src.slice(i, j + 1);
      i = j;
    } else if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      out += '\n';
    } else if (c === '/' && src[i + 1] === '*') {
      i = src.indexOf('*/', i + 2) + 1;
      if (i === 0) break;
    } else out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}
const major = range => Number((String(range).match(/\d+/) ?? [0])[0]);

// 1. Stack
const pkgFile = join(target, 'package.json');
if (!existsSync(pkgFile)) stop(3, `no package.json in ${target}`);
const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
const all = {...pkg.dependencies, ...pkg.devDependencies};
if (!all.react) stop(3, 'react is not a dependency. Monte is React components; this stack is out of scope');
if (major(all.react) < 18) stop(3, `react ${all.react} is below 18`);
if (!all.tailwindcss) stop(4, 'tailwindcss is not installed. Monte needs Tailwind v4 (styles.css uses @source, @custom-variant and @theme inline reference)');
if (major(all.tailwindcss) < 4) stop(4, `tailwindcss ${all.tailwindcss} is below v4. Upgrade Tailwind first, as its own change`);

// 2. Alias: Monte imports "@/components/monte/...", so "@/*" must resolve. Its target decides where the files go.
let root = null;
for (const name of ['tsconfig.json', 'tsconfig.app.json', 'jsconfig.json']) {
  const file = join(target, name);
  if (!existsSync(file)) continue;
  const opts = readJson(file).compilerOptions ?? {};
  const to = opts.paths?.['@/*']?.[0];
  if (to) {
    root = resolve(target, opts.baseUrl ?? '.', to.replace(/\/?\*$/, ''));
    break;
  }
}
if (!root) stop(5, 'no "@/*" path alias in tsconfig.json, tsconfig.app.json or jsconfig.json. Add "paths": {"@/*": ["./src/*"]} (or ["./*"] with no src folder), plus the bundler alias for Vite, then run again');
report.root = relative(target, root) || '.';

// 3. Already installed: the installed system is the source of truth, so nothing is copied over it.
if (existsSync(join(root, 'components/monte/tokens.css')) && !flags.has('--force')) stop(6, `Monte is already installed at ${relative(target, join(root, 'components/monte'))}. Skip to the migration, or pass --force to overwrite it with v${manifest.version}`);

// 4. Copy
const copies = [
  ['components/monte', join(root, 'components/monte')],
  ['hooks/monte', join(root, 'hooks/monte')],
  ['lib/monte', join(root, 'lib/monte')],
  ['monte.eslint.config.mjs', join(target, 'monte.eslint.config.mjs')],
];
if (flags.has('--showcase')) copies.push(['showcase', join(root, 'components/monte-showcase')]);
for (const [from, to] of copies) {
  report.copied.push(relative(target, to));
  if (!dry) {
    mkdirSync(dirname(to), {recursive: true});
    cpSync(join(PAYLOAD, from), to, {recursive: true, force: true});
  }
}

// 5. Point styles.css's @source lines at the folders this project really has, relative to where styles.css landed.
const stylesDir = join(root, 'components/monte');
const scan = ['app', 'pages', 'src', 'components', 'routes', 'views']
  .map(d => join(target, d))
  .concat(root === target ? [] : [join(root, 'app'), join(root, 'pages'), join(root, 'components'), join(root, 'routes')])
  .filter(d => existsSync(d) && !d.startsWith(join(root, 'components', 'monte')));
const sources = [...new Set([...scan, join(root, 'lib/monte'), join(root, 'hooks/monte')])]
  .map(d => `@source "${relative(stylesDir, d)}";`)
  .concat(`@source not "${relative(stylesDir, join(root, 'lib/monte/lint'))}";`);
if (!dry) {
  const file = join(stylesDir, 'styles.css');
  const css = readFileSync(file, 'utf8');
  const block = /^(?:@source [^\n]*\n)+/m;
  if (!block.test(css)) stop(1, 'styles.css has no @source block to rewrite; the payload is damaged');
  writeFileSync(file, css.replace(block, sources.join('\n') + '\n'));
}
report.sources = sources;

// 6. Dependencies: add what is missing, never change a version the project already pins.
for (const field of ['dependencies', 'devDependencies']) {
  for (const [name, range] of Object.entries(manifest[field])) {
    if (all[name]) report.deps.kept.push(`${name}@${all[name]}`);
    else {
      report.deps.added.push(`${name}@${range}`);
      pkg[field] = {...pkg[field], [name]: range};
    }
  }
}
if (!dry && report.deps.added.length) writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');

// 7. Monte's rules, into .agents/skills/monte with a .claude/skills link. The other guides in skills/ are
// internal to use-monte and run from there by path, so they are never installed as skills of their own.
if (flags.has('--skills')) {
  for (const name of ['monte']) {
    const dest = join(target, '.agents/skills', name);
    const link = join(target, '.claude/skills', name);
    if (existsSync(dest)) report.skills.push(`${name}: kept the project's copy`);
    else {
      report.skills.push(`${name}: installed`);
      if (!dry) {
        cpSync(join(SKILL, 'guides', name), dest, {recursive: true});
        renameSync(join(dest, 'GUIDE.md'), join(dest, 'SKILL.md'));
      }
    }
    let linked = false;
    try { linked = !!lstatSync(link); } catch {}
    if (!dry && !linked) {
      mkdirSync(dirname(link), {recursive: true});
      symlinkSync(relative(dirname(link), dest), link);
    }
  }
}

// 8. What the agent does next
const lock = [['pnpm-lock.yaml', 'pnpm install'], ['bun.lockb', 'bun install'], ['bun.lock', 'bun install'], ['yarn.lock', 'yarn']].find(([f]) => existsSync(join(target, f)));
if (report.deps.added.length) report.next.push(lock ? lock[1] : 'npm install');
const eslintOwn = readdirSync(target).find(f => /^eslint\.config\.(m?[jt]s|cjs)$/.test(f));
report.next.push(eslintOwn ? `lint: npx eslint -c monte.eslint.config.mjs . (the project keeps its own ${eslintOwn})` : 'lint: npx eslint -c monte.eslint.config.mjs .');
report.next.push(`wire the root: import ${relative(target, join(stylesDir, 'styles.css'))} once, class "monte" on <body>, MontePortalProvider inside it, Geist fonts (SKILL.md, Wire the root)`);

console.log(JSON.stringify(report, null, 2));
