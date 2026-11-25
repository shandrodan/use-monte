# Correction pass

Run this at close, and whenever the person says a fixed mistake came back. Assume every future contributor is an agent that sees only the files it opened, copies the nearest example and takes the shortest path that compiles. The goal: a change that looks right from one file is right for the whole repo.

## 1. Find the classes

Read the run's reverts, its `blocked` and rework rows, the review comments, `decisions.tsv`, and any code comment explaining a workaround. Group what you find. A class counts once it has happened twice. Ignore one-offs. Why: a fix for a one-off adds a rule nobody needs.

## 2. Fix each class at the highest level that works

```
Can the structure make the mistake impossible?
(one owner per piece of state, one supported way per task, internals that cannot be imported, one source of truth, the old module deleted)
├── Yes → do that
└── No → can a type or a lint rule catch it? (the message names the fix: "use Text, see docs")
    ├── Yes → do that. When the pattern is already common, fail only when a change adds more
    └── No → can a test catch the behaviour?
        ├── Yes → write the test
        └── No → docs or brief text, for judgement calls only
```

Why this order: nothing fails when an agent skips a doc, so docs come last.

- A ban ships in the same change as its check, and the check is proven to fail on a real past case before it counts.
- An exception sits on the offending line with a reason, an expiry date and the name of the person who allowed it.
- A ban that exists only in a brief is listed as unenforced.

## 3. Keep the rule table

The table lives in the system's agent instructions.

| Rule | Enforced by | Proven against |
|---|---|---|
| Exact edits, never `sed -i` | a host hook, and `land.mjs` committing named paths only | a run where most workers used it despite a prose ban |
| No curly quotes in payload strings | an element-scoped exemption, and a byte compare with the base | a copied prompt that shipped with a curly apostrophe |
| Table controls reachable inside the scroller | verifier measurements at four widths | no row control in view while a window-based script passed |
| Named page widths (wide, hub) match legacy at 1280 | a width table and a measured content box | a visible jump from two different wide tokens |
| Upload `accept` matches MIME as well as extension | a `parity.mjs` class and a lint on `accept=` | a file refused for having no extension |
| Request bodies are equal before and after, or the change is announced | `land.mjs --bodies-check` with intended-change rows | a pair joined from two runs that passed and was reverted |
| A shared file changes only its own rows | `land.mjs --also` | a ratchet recomputed over a folder holding other workers' files |
| No live run before every write is seen blocked | `capture.mjs --writes`, `capture-guard.mjs prove` | an abort filter on the wrong URL shape that created real records |

A rule already in the table with nothing enforcing it is a repeat: fix it one level higher in the same change. Drop a rule once its mistake can no longer happen.

## 4. Reply

Each class with its evidence, the level chosen, and why a higher level did not work. Proposals for token or lint changes wait for a person, except additions to a ratchet.
