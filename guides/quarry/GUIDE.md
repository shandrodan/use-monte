# Quarry

> Internal guide of the use-monte skill, not a skill of its own. Run it only from use-monte (or from summit). Paths like `quarry/scripts/x.mjs` are relative to the folder that holds this guide's folder.

Quarry cuts a design system out of the app that already exists. The app's current look is the only source. Never add a colour, font, shadow, gradient or motion value the app does not already use, unless the person named a design source and approved a sample. Why: a system the app does not recognise as its own gets rejected one screen at a time.

Read `references/glossary.md` and `references/taste.md` before step 1. Look up `references/tokens.md`, `references/components.md` and `references/traps.md` when a step points at them.

Scripts live in `scripts/`. Run each with node from the repo root, and read its `--help` before first use.

| Script | Job |
|---|---|
| `capture.mjs` | Screenshots and accessibility trees per surface, width and theme |
| `capture-guard.mjs` | Blocks every write while capture runs. capture.mjs installs it itself |
| `pixdiff.mjs` | Compares two capture folders |
| `check-system.mjs`, `oklch.mjs` | The system check, and colour conversion and distance |
| `find-chromium.mjs` | Finds Playwright and a Chromium that launches, or says how to install one |

## Steps

Each step ends at its Done line. Never start the next step while the current Done line is false.

1. **Frame.**
   - Read AGENTS.md or CLAUDE.md, the package manifest and the route tree.
   - Write down the complaint in the person's words and the first visible change that answers it.
   - Pick the pilot flow: the flow the complaint names, else the flow with the most component families plus a form with an error state.
   - Add `.design-system/` to `.git/info/exclude`. Use the branch the person named, or cut a run branch and write the starting branch to `.design-system/start-branch`.
   - Offer `references/taste.md` once, every ban unticked, and save the accepted copy to `.design-system/taste.md`.
   - Ask nothing else. Take each default and record it as `default (unanswered)`.

   Done when the complaint, pilot, branch and accepted taste file are written down.

2. **Inventory and baselines.**
   - List every surface, its states and whether it writes data.
   - Count raw values in occurrences with `scripts/check-system.mjs --no-allowlist --no-self-test --json`. Group the components into families.
   - With the app running, write each surface as a `surface<TAB>route<TAB>states` row in `.design-system/surfaces.tsv`. Write every request that changes data as `METHOD URL` in `.design-system/writes.txt`, copied from the browser's network log in the shape the app sends it.
   - Capture before any edit, at the narrowest and widest supported widths (390 and 1280 when the app states none):
     `node <this skill>/scripts/capture.mjs --base http://localhost:3000 --kind before --out .design-system/captures --surfaces .design-system/surfaces.tsv --writes .design-system/writes.txt`
     It refuses to run without `--writes` (or `--no-backend` for an app that sends no writes). It proves each write is blocked before the browser opens, and it exits 1 on any capture it missed.
   - Delete code nothing uses, in its own commit. Why: dead variants inflate every count after this.

   Done when every surface has a baseline or a written `not captured: <reason>`.

3. **Tokens.**
   - Cluster the raw values by role, name each by purpose, and pair every surface colour with its foreground (`references/tokens.md`).
   - Run plumbline until every raw value maps to a role, a merge or a listed exception.
   - A merge inside tolerance is a decision. A merge past tolerance opens one gate per cluster, and its default is the merge.
   - Make every identical-value swap on every route.

   Done when plumbline reports zero gaps outside the exception list, and `pixdiff.mjs` at tolerance 0 reports 0% on every surface a swap touched.

4. **Components.**
   - Build the most-used family end to end first (`references/components.md`). The text primitive and the small-text primitive ship in the first wave beside Button.
   - Document each component with logbook.
   - Show the family to the person before any fan-out. Why: a core bug found after screens adopt the system costs a sweep. Seen in real runs: a disabled field still drawn red, a Combobox 2 px taller than Input, panel actions that did not wrap, a file drop that failed with no message.

   Done when every canonical component has a registry row and a doc, and its disabled, required, error and long-text states are captured in the showcase and shown to the person.

5. **Checks.**
   - Copy `scripts/check-system.mjs` and `scripts/oklch.mjs` into the repo's `scripts/`. Run `--init`, then `--init-allowlist` once.
   - Prove every rule: plant one violation in a scanned folder, run `--files <plant> --no-allowlist`, see exit 1 naming the rule, then delete the plant. Why: a rule never seen failing may never fail.
   - The allowlist and the ratchet only ever shrink.
   - A ban ships in the same change as the rule that checks it.
   - Copy rules ship with element-scoped exemptions for verbatim text (quotes, legal terms, version strings) and for payload strings a person or machine pastes elsewhere (prompts, API examples, clipboard values). Why: rewording them changes what someone else receives.

   Done when the check exits 0 on a clean clone, `--self-test` ends with "all as expected", and every rule this run added was seen failing on its plant this session.

6. **Pilot.**
   - Move the pilot flow with a codemod, and read its output hunk by hunk.
   - Capture after with the baseline command, changing only `--kind after`. Then run `pixdiff.mjs` on the two folders. An unexplained difference is a defect.
   - Walk the flow by keyboard, force its error and loading states, and run lookout on the after captures.

   Done when every difference traces to a decision or a gate. A rendered change with no capture is reported as `checks-only`.

7. **Readiness.** Run the five audits below.

8. **Handoff.** Run the counts again. Report coverage in numbers: the unanswered defaults first, then what was found and not fixed, ranked. Offer the migration with its size. Do not start it.

   Done when every number in the report names the command that produced it.

## Readiness audits

Run them at the end of step 5 and again before the first migration wave. Write each result to `.design-system/readiness.md` with a verdict word. A family that fails one is not migrated, and its screens stay on legacy. Why: a gap found before screens adopt the system costs one row, and after costs a sweep.

1. **Props.** Every prop of a legacy primitive that has call sites has a matching prop on the new primitive, or a gap row.
2. **Behaviour.** Every interactive primitive has a "what fires when" table, and each row is a test (`references/components.md`).
3. **Tones.** Every pressable and row primitive crossed with every status tone plus muted. Each empty cell is a gap row or is stated as unsupported.
4. **Pinned strings.** Every legacy test query by role name or text has a default name on the new primitive and a label override.
5. **Hardest screens.** The hardest call site of each family renders in the showcase, with a screenshot.

## Rules

- These are raw-value smells: `#fff`, `rgb(`, `text-gray-500`, `p-[13px]`, `style={{ padding: 12 }}`. Each maps to a semantic token or a listed exception.
- A missing primitive is a gap row, never a workaround inside a surface.
- Colour merges within delta E OK 2 and spacing merges within 2 px are decisions. Border width, font weight and easing have no tolerance.
- A change that only adds semantics (a name, a role, `aria-current`) is a decision. One that removes or restructures semantics is a gate.
- Pending state: the idle label stays, a spinner sits inside the same box, and `aria-busy` is set. Never `{saving ? "Saving..." : "Save"}`.
- A fix that recurs twice becomes a check rule or a script. Why: a third sentence in a doc will be skipped the way the first two were.
- A baseline is never edited to make a diff pass. A check that flags correct code gets fixed in the check, with a planted case that proves the fix.
- Never report a count no script produced, or a check never seen failing.

## Never

- Push, publish or deploy unless the person asked this session.
- Commit on the starting branch.
- Stash, or switch branches in a dirty checkout. A dirty checkout gets the run branch in its own `git worktree add`.
- Delete anything another package or a public API exports. Stop, and list it as a gate with its importers.
- Skip a step in silence. If the app will not build or run, report `code-complete, not runtime-verified` and name what was not exercised.
- Mark your own work `verified`. On a host that cannot start other agents, check each step from a fresh read of the diff and the captures, and mark it `self-verified`.

## Done

The check exits 0 on a clean clone with every rule seen failing. Every route answers 200 on the production build (`capture.mjs --status`). The pilot matches its baseline except for listed intended changes. Every handoff count comes from a script.
