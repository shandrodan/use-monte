# Logbook

> Internal guide of the use-monte skill, not a skill of its own. Run it only from use-monte (or from summit). Paths like `quarry/scripts/x.mjs` are relative to the folder that holds this guide's folder.

Writes a draft entry for one component using only what its sources say. Gaps are marked, never filled. It judges no design, edits no code and publishes nothing. The headings and a worked example are in `references/doc-format.md`.

## Before writing

Search for each of these. If one is still missing after the search, stop:

| Missing | Why it stops the run |
|---|---|
| The component's code | Nothing else can source its variants, props or behaviour |
| A variant list (props type or stories) | A guessed list documents a different component |
| Any use, real or planned | Invented uses read as real ones, and readers copy them first |

These do not stop the run. They are marked as what they are:
- A props type with no variant prop: Variants reads `None.`
- Only one real use, or only planned uses: marked `single use` or `planned`.
- A deprecated predecessor: marked `deprecated`.

A stopped run returns the stop, the facts found so far by section, and the smallest reply that unblocks it ("one screen name, what put the component there, and which variant it showed").

## Steps

1. Paste the nine headings from `references/doc-format.md` into the draft, empty.
2. Read the component's code, props type, styles and stories. Record each as a Sources line.
3. Find two real uses, by searching call sites or from the ask.
4. Trace which source gave each example, variant, prop, state and token. Each disagreement between sources becomes a Conflicts line, with the quoted rule that settles it or `no rule, not chosen`.
5. Fill each section from sourced facts only. Copy token names and example code character for character.
6. Write the Usage rules last, in the rule shape from `references/doc-format.md`. Cut any rule you cannot break with a real snippet. Why: a rule nothing can violate changes no one's code.
7. Fill Guessed at: one line per judgement call.
8. Reread the draft against Done.

## Output

The entry, followed by Sources, Conflicts, Guessed at, and Gates (each a question with its default) where a rule adds one.

Run on its own, it saves to `docs/system/<name>.md` with a draft comment on line 1 and writes each missing example file. The reply opens with the path, what the entry covers and its status, then up to three questions with defaults and one prompt the person can paste to take the next step. Counts in the reply come from `grep -o` on the saved file, below the draft comment.

## Rules

- Never write a variant, prop, token, example or use without a listed source. A planned use says `planned`.
- Never invent a state or a precedence order to make a section look complete.
- A behaviour that looks like a bug is written down as it behaves, followed by a `Defect:` line to the owner: what goes wrong for the user, and the smallest fix.
- A part also used on its own gets a `### Parts` subsection under Description. A compound component (`Tabs` with `Tab`) is one entry.

## Done

Every variant, prop, token and example has a Sources line. Every Usage rule has evidence and a `Don't:` line. Every conflict is listed. The nine headings are present and in order, and a section with nothing sourced reads `Not applicable: <reason>`.
