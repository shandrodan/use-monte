// Monte's lint. Run it from the project root:
//   npx eslint -c monte.eslint.config.mjs .
// It flags what Monte's rules forbid in app code (two primary buttons in one group, glass on something nobody presses, a
// shadow, mono at the sans size, raw colors, classes Monte's theme lacks, native controls ...) and each message says
// what to use instead. Monte's own components (components/monte/ui, components/monte/ai, components/monte/icon.tsx and
// lib/monte) are held to the rules that apply to them; its blocks in
// components/monte/blocks are screens the app owns, so they get the app rules.
//
// Already have an eslint.config? Add Monte to it instead:
//   import monte from './monte.eslint.config.mjs';
//   export default [...yourConfig, ...monte];
import {existsSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import tsParser from '@typescript-eslint/parser';

/** The plugin: beside this file, or in the lib folder shadcn put it in (lib/monte/lint, src/lib/monte/lint, or the components.json lib alias). */
function pluginPath() {
  const here = dirname(fileURLToPath(import.meta.url));
  const dirs = [here, join(here, 'lib/monte/lint'), join(here, 'src/lib/monte/lint')];
  try {
    const alias = JSON.parse(readFileSync(join(here, 'components.json'), 'utf8')).aliases?.lib;
    if (alias) dirs.push(...['', 'src'].map(base => join(here, base, alias.replace(/^[@~]\//, ''), 'monte/lint')));
  } catch {}
  const found = dirs.map(dir => join(dir, 'plugin.mjs')).find(existsSync);
  if (!found) throw new Error('Monte lint: lib/monte/lint/plugin.mjs is missing. Restore that folder from version control');
  return found;
}

const plugin = pluginPath();
const monte = (await import(pathToFileURL(plugin).href)).default;
// The paths every system's lint skips (build output, shadcn's own components/ui), from the shared file beside the plugin.
const {LINT_IGNORES} = await import(pathToFileURL(join(dirname(plugin), 'value-rules.mjs')).href);

const config = [
  // .agents and .claude hold installed agent skills (and their sample templates), not app code.
  {ignores: [...LINT_IGNORES, '**/lib/monte/lint/**', '.agents/**', '.claude/**']},
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {parser: tsParser, parserOptions: {ecmaFeatures: {jsx: true}}},
    linterOptions: {reportUnusedDisableDirectives: 'off'},
    plugins: {monte},
    processor: 'monte/standalone',
    rules: monte.configs.app.rules,
  },
  {files: ['**/components/monte/{ui,ai}/**', '**/components/monte/icon.tsx', '**/lib/monte/**'], rules: monte.configs.source.rules},
];

export default config;
