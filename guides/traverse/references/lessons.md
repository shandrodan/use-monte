# Lessons

Eight lessons, each from a failure in a real migration. A lesson belongs here only if it happened and a check can see it. Briefs cite them by number.

Each lesson has the same four lines. **When**: the trigger. **Why**: what went wrong. **Stop**: the condition that halts the work. **Check**: what enforces it.

## 1. An edit is exactly as big as its change

**When** a worker edits a shared checkout, or runs a formatter or a codemod.
**Why** most workers in one run used `sed -i` despite a prose ban, and its BSD and GNU forms differ. A formatter on the wrong config rewrote whole files nobody meant to touch.
**Stop** when `git diff --stat` shows a whole file rewritten for a small change. Keep only the real hunks. Run the formatter and config the repo has now, which can change mid-run. A regex across many files is a codemod: diff its output.
**Check** the host hook or the brief's BANS line, plus `land.mjs`, which commits only named paths.

## 2. Payload strings are not copy

**When** a copy rule, formatter or codemod touches a prompt someone copies, a model prompt, an API example, a clipboard value, verbatim text (quotes, terms, version strings), a data-layer string or a string a test pins.
**Why** a curly apostrophe landed in a prompt users paste into an assistant, and nothing on the page showed it.
**Stop** before rewording. A migration never changes data-layer or model-prompt text. Flag it for its owner.
**Check** element-scoped exemptions in the check, and a byte compare of each payload string against the base commit after every sweep.

## 3. A swapped control needs a parity table

**When** a number, amount, percent, date or upload control changes.
**Why** an integer field saved 25 for `2.5`, and an upload control refused a file by extension though its MIME type matched. Every visual check passed.
**Stop** on any differing row no person approved.
**Check** `parity.mjs` and the classes in `parity.md`, including MIME with and without an extension, an upper-case extension and a wrong MIME type.

## 4. A date is not a moment

**When** a surface shows, parses or sends a date.
**Why** a date-only value passed through a local-midnight `Date` came out a day early west of UTC, more than once, and some dates were already a day early before the run began.
**Stop** on any `new Date("YYYY-MM-DD")` or local-midnight `Date` in a date-only path. Keep the value a string or a UTC date. A bug legacy already had gets fixed in its own commit as an `intended change` row and named in the report, never silently.
**Check** `parity.mjs date` under `America/Los_Angeles` and `Asia/Tokyo`.

## 5. Both request bodies come from one run

**When** a diff adds, moves or rewraps `mutate(`, `mutateAsync(`, `onSubmit`, `execute(` or a `fetch` that is not a GET.
**Why** a before/after pair stitched together from two separate runs passed and then had to be reverted.
**Stop** if one logged run did not produce both body files.

How: serve two builds at once on two ports, the base commit's from its own worktree and the run branch's. Wrap both captures in one logged run, and drive the changed write in each with the same `--states` step, so the guard blocks it and keeps its body:

```
rc=0; node <this skill>/scripts/bodies-check.mjs log .design-system/runs.log start RUN-7
node quarry/scripts/capture.mjs --base http://localhost:5183 --kind before --out .design-system/captures/before --surfaces <tsv> --states <steps.mjs> --writes <file> --run RUN-7 --bodies .design-system/evidence/<surface>/bodies.before.json || rc=1
node quarry/scripts/capture.mjs --base http://localhost:5173 --kind after --out .design-system/captures/after --surfaces <tsv> --states <steps.mjs> --writes <file> --run RUN-7 --bodies .design-system/evidence/<surface>/bodies.after.json || rc=1
node <this skill>/scripts/bodies-check.mjs log .design-system/runs.log end RUN-7 $rc
```

Then land with `--bodies-check "node <this skill>/scripts/bodies-check.mjs .design-system/evidence/$SURFACE --expect <procedures> --before-ports 5183 --after-ports 5173 --log .design-system/runs.log"`. Differing bodies print `DIFF`. An announced data fix lands only with an `intended change` row in `decisions.tsv` naming the surface and the procedure. Any other difference holds the surface.
**Check** `land.mjs --bodies-check`, which refuses a write diff with no valid pair and any `DIFF` no row explains.

## 6. Every capture runs behind the guard

**When** any script drives a live app.
**Why** a capture leaked a real update and changed real data. Another script's abort filter matched the wrong URL shape and created real records. Many RPC APIs send reads as POST, so "block every non-GET" breaks the app.
**Stop** before any run that can reach a backend, until a dry run sent every known write in the shape the app sends it and saw each one blocked. Writes are denied by default, and reads pass by exact name only.
**Check** `quarry/scripts/capture-guard.mjs prove --writes <file> --read-procedures <names>`, plus `capture.mjs`, which installs the guard before the first navigation, refuses to start without `--writes <file>` or `--no-backend`, refuses while the file shows a leak, and writes `guard.log`, with every write's body, beside the captures.

## 7. A code read never lands a write surface

**When** a verifier cannot run the surface in a browser.
**Why** a grid landed on a code read alone and broke.
**Stop** and return `blocked`, with the missing evidence and the command to rerun.
**Check** the glossary: only `verified` at the surface's fingerprint lands a write surface.

## 8. Measure widths inside the scroller

**When** a table, grid or row layout changes.
**Why** no row control was in view while a script measuring the window passed.
**Stop** if any control reachable before is unreachable at 390, 768, 1280 or 1920. Each width is a fresh navigation, with a long title and more rows than fit.
**Check** the verifier's measurements in its verdict, and `capture.mjs`, which reports a capture under 700 bytes as a blank render rather than a capture.
