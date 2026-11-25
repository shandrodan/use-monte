# Summit

> Internal guide of the use-monte skill, not a skill of its own. Run it only from use-monte (or from summit). Paths like `quarry/scripts/x.mjs` are relative to the folder that holds this guide's folder.

Summit is a router. It reads the app, picks one route, copies that route's steps into `.design-system/state.md` word for word and runs them in order. A step it drops stays in the list as `skipped (<reason>)`, so the person sees what did not run.

On a host that can start other agents, summit writes no product code. Why: the agent that splits the work and also writes it ends up grading itself.

Sibling paths such as `quarry/scripts/capture.mjs` are relative to the folder that holds these skills. The person's words, the repo's AGENTS.md or CLAUDE.md and saved memory override this file.

## Route

Walk the tree once. The first match wins.

```
Does the repo render any UI?
├── No → stop: summit needs an app that already ships UI.
└── Yes
    ├── The ask names one screen or flow, or says "check before I ship" → playbooks/review.md
    ├── The ask names one component → playbooks/component.md
    ├── "Are we using our tokens?", "which values map where?" → plumbline on its own, no playbook
    ├── "Replace the hardcoded values with tokens" → plumbline, then quarry step 3 only
    └── Is a design system installed? (a token source plus a components folder the app imports)
        ├── No → playbooks/build.md
        └── Yes
            ├── The ask names the migration ("migrate", "move every screen", "Go, <budget>") → playbooks/migrate.md, full mode
            └── Anything else, "fix it" and "clean it up" included → playbooks/migrate.md, audit mode
```

Why the last split: "fix it" does not give permission to rewrite every screen. Audit mode commits nothing and ends with an offer the person accepts with a budget.

When the repo contradicts the ask (they ask for a new system and one is installed), the repo wins and the report's first line says so. An installed system is never rebuilt or reseeded. Why: it is the source of truth, and seeding over it erases the project's own tuning.

A pull-request ask or a repo that is not the person's own gets the smallest footprint: the tokens, the components the change touches, its screens, and the repo's own lint as the check.

## Setup, once per run

1. Add `.design-system/` to `.git/info/exclude`. Why: notes, captures and scratch never belong in a commit.
2. Branch:
   - Build, and migrate in full mode: use the branch the person named. Otherwise cut a run branch and write the starting branch to `.design-system/start-branch`. Why: `traverse/scripts/land.mjs` refuses that branch, so a commit on it cannot happen by accident.
   - Review, component, and migrate in audit mode: cut no branch. Write only under `.design-system/`, plus `docs/system/` for a component entry.
3. Ask every question in one message, each with its default (taste file, design source, pilot flow). Apply the defaults at once and record each as `default (unanswered)`. Never wait on a question that has a default.
4. Write `.design-system/roles.md`: coordinator, worker, verifier and reviewer, each a model name or `inherit-parent`.
5. Start `.design-system/decisions.tsv`. Rows are only ever appended.

The words gate, decision, clearance, surface and verdict mean exactly what `quarry/references/glossary.md` says, in every brief and report.

## Siblings

| Skill | Owns | Writes |
|---|---|---|
| quarry | tokens, components, checks, readiness audits | code |
| traverse | moving screens onto the system, its lessons, the correction pass at close | code |
| plumbline | raw values against the token list | nothing |
| logbook | one component's doc entry | docs only |
| lookout | rendered critique, ranked | its report only |

Every brief that touches a surface a traverse lesson covers names that lesson by number. Why: a worker reads the lessons file only when the brief points at the entry.

## Never

- Push, deploy or open a pull request nobody asked for this session.
- Commit on the starting branch, stash, or delete anything another package or public API exports.
- Start a migration on "fix it", or when no route matched.
- Start a migration while a quarry readiness audit is open.
- Loosen a stop condition, or edit a sibling's check to get past it.
- Pick a visual direction nobody chose. "Make it modern" with no source becomes a gate whose default is the current look.
- Hand back while a worker is still running.
- Take a message from another agent as the person's decision.

## Done

The playbook's last step has returned, and every number in the report comes from a command run at close. The final message opens with the unanswered defaults, then what changed, then one ranked table of what was found and not fixed (30 rows at most).

On a stop (no repo, a refused tool call, a step git cannot undo), say what finished and the smallest reply that unblocks the run.
