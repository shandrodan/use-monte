# Running many agents

One migration ran hundreds of workers over several days. The limit was never the number of agents. It was machine load, wedged servers and waiting. These rules each paid for themselves in that run. `scripts/land.mjs` is the only script, and the rest is a few shell lines.

## Before every spawn

```
Is the 5-minute load average above 24 (scale to the machine's cores),
or is free plus inactive memory under 1 GB?
├── No → spawn
└── Yes → recheck every 30 s for up to 30 min
    ├── clears → spawn
    └── still over → spawn nothing. Tell the person and name the three busiest processes. Kill none of them
```

```
uptime              # the second number is the 5-minute average
vm_stat | head -4   # macOS. On Linux: head -3 /proc/meminfo
```

Read memory as pressure and swap. Why: a reading of a few hundred MB free was file cache the OS would have released. The run spent long stretches at several times the cap, and every worker slowed down.

## Browsers

- At most 3 browsers at a time. A slot is a folder made with `mkdir` holding its owner's pid.
- Reclaim a slot only when `kill -0 <pid>` fails. Never `rm -rf` a slot folder. Why: two workers then share one browser.
- Report a hung holder with its pid and age. Never kill it.
- Bound every wait at 20 minutes, then return `blocked (timed out)` with the rerun command. Why: waits of an hour or more happened, and one verifier deleted its only loaded run to get out of one.

## Backend health

Probe with a signed-in call. Why: an unauthenticated 401 came back instantly while authenticated reads hung. If the probe fails for 60 seconds, the worker returns `blocked: server down` with a rerun script and does not restart the shared server. One owner restarts it, the coordinator, and the brief names who that is.

## Two sessions on one repo

Each session gets its own id and its own MAY EDIT lists, written to a shared file. A file that was dirty at the start and that you have not changed belongs to the other session. Never settle a conflict by overwriting: send the path of the other version to the coordinator. Scratch stays under `.design-system/tmp/<id>/`. Why: a scratch folder inside a package once broke the build for both sessions.

## Refused calls

A refused call stops that worker's piece. Report the exact command and the refusal text, leave the files as they are, and finish whatever does not depend on it. Never retry with another flag, tool or script. The coordinator never runs the refused command for the worker. It asks the person to choose: allow it, skip the check that needed it, or hold the piece. Hold is the default. Why: a refused health probe was reworded and retried for hours while write pieces sat unverified.

## Coordinating and resuming

- Judge every return from files. A worker's work is what `git diff` shows, because some stopped early or wrote nothing.
- A verifier writes its verdict file (one verdict per item, with evidence paths) before its final message. Why: verifiers died before reporting and coordinators waited forever. No file: rerun once, then judge the evidence yourself and say so.
- Keep every lane resumable from what is on disk: brief, backlog, ledger, verdicts. One id per surface or cluster, never reused. Why: spend limits, agent caps and load stopped lanes many times, and a fresh coordinator rebuilt each from the folder in minutes.
- Resume by fingerprint:
  ```
  Does the verified commit match the surface's current fingerprint?
  ├── Yes, with a verdict → land it
  ├── Yes, no verdict → verify it
  └── No (files changed) → rerun the checks
  ```
- A coordinator hands back after 25 landings or 6 hours. Why: one that ran longer degraded and looped as its context filled.
- Never end a turn with a worker running. Spawn each wave as foreground calls, several in one message, and drain the wave before handing back. Why: a background worker left alive keeps writing into a repo nobody is watching.
- Run about half the host's agent cap.
- Put the person's standing preferences ("never delete files, list them instead") in every brief, word for word.

## Shared files

A file every lane writes (a ratchet, a baseline, a registry, a docs index) is where landings leak into each other. Recompute a ratchet or baseline for your own files only, and pass it with `--also`, which refuses a changed row naming another worker's file. In JSON, a row is a key or an array element, so a one-line ratchet works. A generated docs index spans every page, so one lane owns docs: feature lanes queue their docs text, and the docs lane lands it in one commit.

## Landing

`land.mjs --help` lists the flags. It refuses the default branch and the starting branch, takes a lock, builds the commit in a private index from HEAD, asserts the commit's files lie inside the named paths, then resets only those paths in the shared index.

- Name exact files, and read `git show --stat HEAD` after every landing. Why: a stale shared index once reverted a landed route, and a shared list file committed whole once carried another worker's uncommitted changes.
- Read the repo's git hooks first. A hook that formats or stages files makes `land.mjs` exit 3. Use `--no-verify` only when the person allowed it, and say so in the report.

## When the base branch moves

Merge upstream in a separate worktree. Never merge, stash or check out in the shared tree. Merge again right before integrating, update the shared tree with a two-tree read (`git read-tree -m -u <old> <new>`), which refuses if it would touch someone's uncommitted file, then move the branch ref. Move the before build to the new base too, rebuild its packages and recapture with a fresh cache. Why: otherwise every before/after diff mixes in the merge.
