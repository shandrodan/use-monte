# Lookout

> Internal guide of the use-monte skill, not a skill of its own. Run it only from use-monte (or from summit). Paths like `quarry/scripts/x.mjs` are relative to the folder that holds this guide's folder.

The rendered screen is the evidence. A description, the DOM text or the source code only supports it. Severity, the 13 criteria and the edge cases are in `references/criteria.md`. An installed design system's own rules come before them and count as agreed criteria.

## Steps

1. **Scope.** What the caller named, else the screens the branch changed, else the five top routes.
2. **Lint.** Run the project's own lint on the scoped files. Record the command and its exit code.
3. **Capture** each screen at the app's narrowest and widest widths (390 and 1280 when the app states none), in the states that matter, with a fresh navigation per width.
   ```
   Is quarry installed beside this skill?
   ├── Yes → quarry/scripts/capture.mjs, with --writes <file> listing the app's writes, or --no-backend,
   │        and --out .design-system/review/<date>-<flow>/. It blocks every write and saves each capture's accessibility tree.
   └── No → the host's browser tool. Save the accessibility tree yourself
   ```
   Run the project's accessibility scanner too, when it has one.
4. **Purpose.** State each screen's purpose in one line. Mark it `assumed` when the caller did not give it.
5. **Probe**, on a local build only: the keyboard path, focus after a close, loading and error states, a throttled tab, reduced motion, a touch width. Each probe gets a measured result or the reason it did not run. Measure press feedback with the Event Timing API (a `PerformanceObserver` on `event` entries, each `duration` under 100 ms). Never click anything that writes to shared data.
6. **Criteria.** Walk them at each width. Cite each finding by criterion number and name, or by the installed system's rule ID.
7. **Sort** every finding into `blocking`, `should-fix`, `note` or `dismissed`, with who raised it and a one-line reason.
   - With more than one reviewer available, give each the same prompt, read-only, with no persona, and sort their findings together. A finding two reviewers raised independently is the strongest signal.
   - Dismiss nitpicks, hypotheticals nobody traced to a real call site, and "I would have done it differently".
   - Within a bucket, surfaces that write data come first, then order by how many places the finding hits.
8. **Edge cases.** Mark each one shown or not shown.
9. **Verdict.** Write it last.

## Rules

- A finding carries a criterion, a findable location (the element by role and name, plus its capture: `button 'Save changes' (settings-1280.png)`), the width, and the evidence. A finding that rests on taste moves to Left out.
- Measure, don't describe. Wrong: "The spacing feels tight." Right: "The label sits 24 px from its own field and 8 px from the next one (criterion 4, settings-390.png)."
- An inferred finding is written as the check that would settle it. An inferred `blocking` finding makes the verdict `no, pending <the check>`.
- A claim that something works or is fixed names a command or capture from this session.
- Contrast, target size and keyboard problems are ranked like any other finding. A change to the accessibility tree that only adds semantics is ranked too. One that removes or restructures semantics goes to a person.
- Responsiveness (criterion 13) is never judged from a screenshot, either way. It needs a measured probe.
- The focus ring is judged the other way round: reach the control with real Tab presses and judge the ring from the capture. Why: a container that draws the ring through `:has(:focus-visible)` leaves the focused element reporting no outline.
- The product decisions behind a fix go to For a person to decide. Keeping the user's input is never one of them.

## Output

```
Line 1: the answer to the ask, in plain words.
Line 2: Ready to ship: <verdict>. <the worst problem> (blocking N, should-fix N, N questions for a person).

Any blocking            → no
An inferred blocking    → no, pending <the check>
Only should-fix         → yes, with fixes
Only notes              → yes
```

Example: `Ready to ship: no. Enter in Email cancels the invite (blocking 1, should-fix 2, 3 questions for a person).`

Then, in order:
1. **Review record.** Source, tool, widths, date, criteria file, purpose (given or assumed), every assumption and gap.
2. **Findings** by bucket: who raised it, what was seen, where, criterion, why it matters here, evidence, and the fix phrased as a check that fails on the current build (`Fix Enter in Email so that it sends 1 POST`).
3. **Edge cases not shown.** One line each.
4. **For a person to decide.**
5. **Dismissed and left out.** Each with who raised it and why.

Run on its own, save the report to `.design-system/review/<date>-<flow>.md` with the captures beside it, and add `.design-system/` to `.git/info/exclude` first. When a coordinator asks for captures only, return the capture paths, widths and the `Coverage:` line, and no findings. The chat reply gives the answer and ship lines, each command with its exit code, and one prompt the person can paste to take the next step.

## Done

Every finding has a criterion, a location, evidence and only the widths where it shows. Every probe has a result or a reason. The first line, the ship line and the summary agree. The last line is `Coverage:` with the routes, widths, themes and probes measured, then what was not.
