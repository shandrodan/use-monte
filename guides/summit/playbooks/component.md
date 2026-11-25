# Component

For an ask about one component.

1. **Find** the component's source, its stories and two real call sites. With no code, no variant list or no use, stop and name what is missing. Why: logbook stops on the same three, so starting it without them wastes a run.
2. **Document** with logbook. Save the draft to `docs/system/<name>.md`.
3. **Review** one screen that uses the component with lookout, at both widths.
4. **Map** the component's styles with plumbline. Report raw values as gaps and fix none of them. Why: this playbook writes docs only, and a fix needs its own branch and checks.
5. **Report** the entry's path, its conflicts and the questions with their defaults.

Done when the entry meets logbook's Done list and the reply lists every `Guessed at` line.
