# Glossary

Every skill in this set uses these words with these meanings and defines none of them again. A repo's own glossary overrides this one. Each entry ends with the words to avoid, because those are the ones that drifted in past runs.

## The run

**Run folder.** `.design-system/` at the repo root: notes, captures, scratch. It goes into `.git/info/exclude` in the first step, so nothing in it is ever committed. Audit mode writes nowhere else.

**Surface.** One route, the shared layout every route renders, or a smaller part such as a modal. Briefs, captures, commits and verdicts each name exactly one surface. Prose may say page or screen. An id never does.

**Run branch.** The branch a writing run commits to. When the person names one, that is it and no other is cut. Otherwise the run cuts one from HEAD and writes the starting branch to `.design-system/start-branch`. `land.mjs` refuses that branch and the default branch. Audit mode cuts none, and merging is the person's call. Avoid: feature branch, working branch.

**Coordinator.** The agent that splits the work and starts workers. A **worker** does one brief and starts no one. Avoid: orchestrator, subagent, lead.

**Wave.** The workers running at the same time. Two waves never touch the same file. Avoid: batch, round.

## Choices

**Decision.** A choice a reversible change settles. The run makes it and records the evidence: a merge inside tolerance, a change that only adds accessibility, an announced fix to broken behaviour.

**Gate.** A product or brand choice a person could answer either way. It carries a default, the run applies the default on the run branch, and the person reverses it by naming it at merge. A gate never pauses the run. Avoid: blocker, open question, TODO.

**Clearance.** The person's go-ahead, with a budget, to migrate beyond the safe moves. An ask that names the migration counts. "Clean it up" and "fix it" never do. Avoid: approval, sign-off.

**Identical-value swap.** A raw literal replaced by a token that holds exactly that value. It needs no clearance, and a pixel diff at tolerance 0 proves it. Avoid: cleanup.

## Evidence

**Baseline.** How a surface looked and behaved before the first migration commit, captured in the same environment CI uses. When the base branch moves, the baseline is captured again. Avoid: snapshot, golden.

**Parity.** The new control gives the same answer as the old one for the same input. It is proven with a table of one row per input, and every differing row is fixed or approved by a person. Avoid: visual match.

**Write surface.** A surface whose code sends a request that changes data: `mutate(`, `mutateAsync(`, `onSubmit`, `execute(`, or a `fetch` that is not a GET. The diff sets this, never a label on a row.

**Verifier.** An agent that did not write the code. It runs the app at a named commit and writes its verdict to a file before its final message. A typecheck, a green CI run and a worker saying "done" are inputs to a verdict, never the verdict itself. Avoid: QA agent.

**Reviewer.** A read-only agent that reports findings on a diff, its comments or a render. Its findings never land a surface. Only a verifier's verdict does.

**Verdict.** One of `verified`, `issues` or `blocked`, followed by what was not exercised. Each claim names the command that proved it this session, and evidence older than the last edit is stale. Evidence that was never collected makes the verdict `blocked`. A wait that ran out is `blocked (timed out)` with the command to rerun. On a host that cannot start other agents, the writer's own check is `self-verified`, which never lands a write surface. Avoid: pass, partial, green, looks good.

**Fingerprint.** A hash of a surface's files at the commit a verdict covers. A verdict for a different fingerprint is stale.

**Landed / verified.** A surface is landed when its commit is on the run branch, and verified when a verifier's verdict names that commit. Only a browser run at the surface's fingerprint is `verified`. A code read or a typecheck never is.

**Skipped / blocked.** A step that does not apply is `skipped (<reason>)`. A step that could not run is `blocked (<reason>)`.

## The system

**Primitive.** A component the system owns that others build on: text, button, input, select, checkbox, icon, badge. Avoid: atom.

**Legacy.** Code the system replaces: a module, a path, or a raw value the migration must bring to zero. The **ratchet** is the committed per-file count, which may fall and never rise. Avoid: old code.

**Gap.** Something the system lacks that a surface needs. It is a row in the gap list and a request to the system's owner, never a workaround in a surface. A prop the system has that the caller never passed is not a gap.

**Taste file.** The accepted bans, voice, widths and reference systems, saved to `.design-system/taste.md` from `references/taste.md`. Skills read the accepted copy and never assume a line it leaves out.

## Counting

Every number carries its unit. A line holding three hex values is one **line** and three **occurrences**. A **mapping row** is one property in one place doing one job. Never subtract a count in one unit from a count in another.
