# Plumbline

> Internal guide of the use-monte skill, not a skill of its own. Run it only from use-monte (or from summit). Paths like `quarry/scripts/x.mjs` are relative to the folder that holds this guide's folder.

A read-only report that measures each raw value (hex, px, shadow) against a token list someone else owns. "Check the tokens on the settings page" is a complete ask: find the values and the list yourself. Classes, categories, normalising and tolerances are in `references/mapping-rules.md`.

## Steps

1. **Find the list.** Token files, theme entries, custom properties on `:root`, a component library's variable pairs. Record its name, location and how you read it.
   - A framework's default theme is not the team's list, and neither is a public design system's.
   - If reading the list fails, say so and stop. Never fill a list in from memory. Why: a remembered list maps real values onto tokens that do not exist.
2. **Find the values.** Use what the person named, else the branch's diff, else all product code. Record each value with its file, line, property and job.
3. **Resolve.** Follow every alias to its final value in each mode (light, dark). Write down every place two sources disagree.
4. **Normalise** both sides with code, never by eye: lengths to px, colours to OKLCH compared by delta E OK.
5. **Classify** each row once per mode. Check purpose first, then value:
   ```
   Does any token's stated job cover this row's job?
   ├── No → Gap. A gap never gets a new token name
   └── Yes → how many such tokens are within tolerance?
       ├── 0 → Gap (the only fitting tokens are out of tolerance)
       ├── 2 or more, nothing picks one → Ambiguous, naming every candidate
       └── 1 → values equal? → Exact
                otherwise   → Semantic, stating the difference in numbers
   ```
6. **Count.** When gaps are more than 30% of rows and number 12 or more, the list is probably the wrong one. Say so, deliver the table anyway, and lead with `Status: not actionable (gap threshold)`.

## Report

Sections, in order: Summary, Mapping, Do not use (a token whose value matches but whose job differs), Ambiguous, Gaps, For a person to decide, Source. The last line is `Coverage:` with what was scanned and what was not.

Run on its own, the chat reply gives the answer with its numbers and one prompt the person can paste to take the next step.

## Rules

- Purpose before value. Wrong: `#6b7280` mapped to `color.border.default` because the hex matches. Right: the value colours text, so the candidates are text tokens, and the border token goes under Do not use.
- A semantic token beats the primitive it aliases. Map to a primitive only when no semantic token covers the job, and say so.
- A palette class (`text-gray-500`) names a value but no job. It gets its own row, counted separately from raw values.
- Anything inferred rather than read, such as a job guessed from a class name, is marked `inferred`.
- Every count carries its unit: occurrences, lines or mapping rows.

## Stops

Stop only for these:
- No token list exists.
- One token name has two values in the same mode.
- Two sources disagree and no project rule says which wins. Report both.

Return what stopped the run, the groundwork so far, and the shortest message that unblocks it, such as "Paste `tokens.json` or give its path."

## Done

Every row has a job, a class and a reason. Every Ambiguous row names two or more candidates. `git status` is the same before and after. The last line starts with `Coverage:`.
