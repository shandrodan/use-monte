---
name: use-monte
description: Swap a React + Tailwind v4 app's design system for Monte (v1.1), the compact, ruled, mono-capitals system with one azure action. Installs Monte's tokens, components, hooks and lint into the project, wires the root, then runs summit's migrate playbook to move every screen off the old system and delete it. Use when the person says "swap the design system", "put Monte in this project", "move this app to Monte" or "install my design system here". Retuning Monte in a project that already has it belongs to the `monte` skill, not this one.
---

# Use Monte

This skill carries Monte v1.1 in `payload/` and, in `guides/`, the internal guides that move an app onto it plus the `monte` rules the project keeps. It runs in four phases: preflight, install, wire, migrate. Write each phase's steps into `.design-system/state.md` before running them, and mark a step you drop `skipped (<reason>)` instead of deleting it, so the person can see what did not run.

The person's words, the project's AGENTS.md or CLAUDE.md and saved memory win over everything here.

## 1. Preflight

Run `node <this skill>/scripts/install.mjs --dry-run` from the repo root and walk its exit code:

```
0 → go to Install
3 → not React, or React below 18: stop. Monte is React components; nothing here ports to Vue, Svelte or native.
4 → Tailwind missing or below v4: stop and offer the Tailwind upgrade as its own change.
    Why: styles.css uses @source, @custom-variant and `@theme inline reference`, which v3 cannot parse,
    and an upgrade mixed into a swap makes every visual diff ambiguous.
5 → no "@/*" alias: add it to tsconfig paths ("./src/*" when the app lives in src/, else "./*"),
    and to vite.config's resolve.alias on Vite, then run the dry run again.
    Why: every Monte file imports "@/components/monte/...". Rewriting 100 imports per project breaks updates.
6 → Monte is already installed: skip Install and Wire. Go to Migrate.
    Why: an installed system is the source of truth. Copying v1.1 over it erases the project's retuned seeds.
```

Then, before any write:
- Commit or leave the person's uncommitted work alone. Never stash it.
- Cut a branch `use-monte` from the current branch and write the starting branch to `.design-system/start-branch`. Never commit on the starting branch.
- Add `.design-system/` to `.git/info/exclude`.

## 2. Install

1. `node <this skill>/scripts/install.mjs --skills`. Add `--showcase` when the app has no screen that renders most components; it installs a kitchen-sink page under `components/monte-showcase` to verify against, and the migration deletes it at close.
2. Read the JSON report. Run the package-manager command it lists. Never change a version the project already pins; the script keeps them and reports them under `deps.kept`.
3. `--skills` installs only the `monte` rules skill, into `.agents/skills/monte/SKILL.md` with a link in `.claude/skills/`. A copy the project already has is kept. Why: the next agent in this repo must find Monte's rules without this package, and the lint points at that file. The guides (summit, quarry, traverse, plumbline, logbook, lookout) stay inside this skill and are never installed on their own.
4. Commit: `chore: install Monte v1.1`. Only the payload, package.json, the lockfile and the monte skill.

## 3. Wire the root

Load Monte's stylesheet and fonts globally, but scope the `monte` class to migrated routes only. Never put `monte` on `<body>` before the last screen has moved. Why: inside `.monte` Monte redefines `--accent`, `--popover`, `--radius` and `--font-sans`, the same names shadcn and most Tailwind kits read, so a body-level class restyles every unmigrated screen on day one. Tested: with the stylesheet loaded and no class on body, the old pages render pixel-identical.

```
Which root?
├── Next.js app router (app/layout.tsx)
│   → import "@/components/monte/styles.css" after the app's own globals.css
│   → Geist and Geist_Mono from next/font/google with variable "--font-geist-sans" / "--font-geist-mono",
│     both variables on <html>, beside the fonts already there
├── Next.js pages router (pages/_app.tsx)
│   → the same import and fonts in _app
├── Vite / CRA / Remix (main.tsx or root.tsx)
│   → import the stylesheet in the entry
│   → install @fontsource-variable/geist and @fontsource-variable/geist-mono, import both, and set
│     --font-geist-sans: "Geist Variable" and --font-geist-mono: "Geist Mono Variable" on :root in the app's CSS
└── Anything else → stop and name the root file you could not find.
```

Scope, per migrated route, with the smallest wrapper the router has (a route-segment `layout.tsx`, a page wrapper, a route element):

```tsx
<div className="monte min-h-dvh bg-page text-text-1">
  <MontePortalProvider>{children}</MontePortalProvider>
</div>
```

A route moves into the scope whole, never half. Why: a legacy component inside `.monte` reads Monte's `--radius` and `--accent` and comes out as neither system. At close, when `legacy.mjs --zero` passes, delete the per-route wrappers and put `className="monte"` on `<body>` with `MontePortalProvider` inside it, once.

Keep Geist and Geist Mono. They are Monte's two faces; another font changes every measured label width.

ui-sdk: six Monte components (Toolbar, Number input, Listbox, Menubar, Resizable, Tree) run on `@ui-sdk/react`. Put `@layer ui-sdk;` on the first line of the app's global stylesheet, above `@import "tailwindcss"`. Never import `@ui-sdk/core/web.css`, and remove it if the app already does. Why: the layer line puts ui-sdk's behaviour CSS (hiding closed parts, popups) under Tailwind's layers; web.css styles about 75 slot names Monte's Base UI components share (`button`, `field`, `select-trigger`) and rounds and shadows them. `components/monte/ui-sdk.css` is the skin, already imported by styles.css.

Dark mode: Monte reads `data-theme="dark"` on `<html>` or the `.monte` element, never a `.dark` class and never `prefers-color-scheme` on its own. If the app has a theme toggle (next-themes, a ThemeProvider), make it set `data-theme` as well as the old class until the old system is deleted. Why: the old `.dark` class flips the old tokens only, and a page half in each theme is the most visible failure of a swap.

Verify, then commit `chore: wire Monte at the root`:
- typecheck and build exit 0
- `npx eslint -c monte.eslint.config.mjs components/monte lib/monte hooks/monte` exits 0
- the home page captured at 390 and 1280 wide matches its capture from before the swap. Why: wiring changes no screen yet; anything that moved is a scope leak to fix now, not during the migration.
- with `--showcase`, add a scoped route that renders `components/monte-showcase/showcase` and check that it draws Monte (mono capitals, square azure button, 1px rules).

## 4. Migrate

Read `<this skill>/guides/summit/GUIDE.md` and follow it with the ask "migrate this app to Monte". The swap was asked for by name, so summit runs `playbooks/migrate.md` in full mode. The guides in `<this skill>/guides/` are internal to this skill: "run quarry" or "run lookout" inside them means read `<this skill>/guides/<name>/GUIDE.md` and follow it, and every sibling path they give (`quarry/scripts/capture.mjs`) is relative to `<this skill>/guides/`. Workers get those absolute paths in their briefs. Why: the guides are not installed as skills, so no agent finds them by name. Give summit these facts so it asks nothing it already has:

- System: Monte. `systemImports` in `legacy.json` are `@/components/monte/`, `@/lib/monte/`, `@/hooks/monte/`.
- Legacy: whatever the app imported for UI before the swap: `@/components/ui/` (shadcn), `@mui/*`, `@chakra-ui/*`, `@mantine/*`, the icon packages, the old ThemeProvider. List them from the code, never from memory.
- The map from each legacy component to Monte is `references/component-map.md`. A legacy component with no row walks that file's "No row matches" tree.
- The check is `npx eslint -c monte.eslint.config.mjs .` plus the project's own lint, typecheck and build.
- The rules every brief carries are the `monte` skill's Global rules and Reject list.

Never skip summit's gates to go faster: the readiness audits, `legacy.mjs --zero` at the last commit, and a `verified` verdict per surface from an agent that did not write it. Why: a swap that half-lands leaves two systems in every file, which costs more than either system alone.

## Retheming

If the person wants their own brand colour, change the seeds at the top of `components/monte/tokens.css` (`--brand-h`, `--brand-c`, `--neutral-*`, `--ok-*`, `--warn-*`, `--fail-*`), never a role or a hex. When a seed fails a contrast target, move that step's lightness by the least that clears it, keep the hue, and note the original value in the token's comment. Re-measure both themes after. Why: the roles point at ramp steps, so a seed change keeps every contrast pair intact and a hex edit breaks the next retune.

## Never

- Copy the payload over an installed Monte (exit 6).
- Edit files in `components/monte/` to make a screen fit. A screen that needs a change Monte lacks is a gap in the report.
- Put `monte` on `<body>` before the last route has moved.
- Keep a `dark:` class, a `rounded-*`, a shadow or a raw colour in a migrated file. The lint names each one.
- Delete a legacy module that something still imports.
- Push, deploy or open a PR nobody asked for.

## Done

Done when summit's migrate playbook is done, the old system's packages are removed from package.json, `monte` sits on `<body>` with no per-route wrappers left, the showcase and its route (if installed) are deleted, and the final message opens with unanswered defaults, then what changed with counts from commands run at close, then one ranked table of gaps and findings not fixed (30 rows at most).
