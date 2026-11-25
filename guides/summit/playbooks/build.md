# Build

For an app with no design system, or one that has drifted, when nobody asked for a migration.

1. **Measure.** Run `node quarry/scripts/check-system.mjs --no-allowlist --no-self-test --json` and count raw values in occurrences, by rule. Also record whether a system is installed, the duplicate component families and the number of surfaces. With 8 surfaces or fewer, use one worker and no rolling window. Why: the coordination costs more than it saves on a small app.
2. **Frame.** Write the complaint in the person's words, pick the pilot flow and accept the taste file (quarry step 1).
3. **Build.** Run quarry steps 1 to 6, one writing step at a time. Judge each return from `git diff`, never from the worker's message. Why: workers report "done" on work they stopped halfway through.
4. **Audit.** Run quarry's five readiness audits. Every open row goes in the report, and the playbook ends with the check in place and no screens migrated.
5. **Measure again** with the step 1 command. Report both counts in the same unit.
6. **Offer** the migration with its size in surfaces. Do not start it.

Done when the check exits 0 on a clean clone, the pilot matches its baseline except for listed intended changes, and the report has the before and after counts.
