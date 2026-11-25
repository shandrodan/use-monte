# use-monte

An agent skill that puts the Monte design system into a React + Tailwind v4 app and moves every screen onto it.

Monte is compact and ruled: mono capitals, 1px rules, square controls and one azure action colour. The skill carries the whole system (tokens, about 50 components, hooks and a lint config) and the skills that run the migration.

## Install

```bash
npx skills add shandrodan/use-monte
```

This works with Claude Code, Codex, Cursor, Gemini CLI, OpenCode and the other agents the [skills CLI](https://github.com/vercel-labs/skills) supports. Add `-g` to install it for your user instead of one project.

## Use

In your app's repo, ask your agent:

> Move this app to Monte

or run `/use-monte`. The skill works in four phases:

1. **Preflight** checks for React 18 or newer, Tailwind v4 and an `@/*` path alias, and stops with a reason if one is missing.
2. **Install** copies Monte into `components/monte`, `lib/monte` and `hooks/monte`, adds the npm packages it needs and keeps any version you already pin.
3. **Wire** loads the stylesheet and the Geist fonts, then applies Monte to one route at a time, so screens that haven't moved yet don't change.
4. **Migrate** moves each screen off the old system (shadcn, MUI, Chakra, Mantine and so on), checks every change against lint, typecheck and build, then deletes the old system.

All work happens on a `use-monte` branch. Nothing gets pushed or deployed.

## Requirements

- React 18 or newer
- Tailwind CSS v4
- Next.js (app or pages router), Vite, CRA or Remix

## What's inside

```
SKILL.md                      the process: preflight, install, wire, migrate
manifest.json                 version and the npm packages Monte needs
scripts/install.mjs           copies the payload, fixes @source paths, adds missing deps
references/component-map.md   each legacy component and its Monte counterpart
payload/                      components/monte, lib/monte, hooks/monte, monte.eslint.config.mjs, showcase
guides/                       summit (router), quarry (build), traverse (migrate), plumbline (token report),
                              logbook (component docs), lookout (UI review), monte (the rules)
```

Only use-monte installs as a skill. The guides inside it run through use-monte and can't be installed on their own. During install, the `monte` rules go into your project's `.agents/skills/monte`, so the next agent working in the repo can find them.

## Your own brand colour

Change the seeds at the top of `components/monte/tokens.css`: `--brand-h`, `--brand-c` and the `--neutral-*`, `--ok-*`, `--warn-*` and `--fail-*` ramps. Every role points at a ramp step, so contrast pairs still hold after a retune.

## License

MIT. Free for personal and commercial use. See [LICENSE](LICENSE).
