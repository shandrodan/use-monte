# Criteria

A starting set. Replace it with criteria your team has agreed. Why: an unagreed criterion turns every finding into an argument.

## Severity

```
Can the user finish the task?
├── No, or they are likely to lose data, spend money or do something irreversible by accident → blocking
│   (a user who believes the task finished when it did not cannot finish)
├── Yes, but they lose time to confusion or detours, or may get an outcome they did not want → should-fix
└── Yes, smoothly. A small inconsistency, or a pattern to settle before other screens copy it → note
```

When a finding could go either way, pick the milder level and say why in one sentence. The one exception is a field that shows one value while the request sends another: `blocking` when the hidden value grants access, spends money or picks a recipient, `should-fix` otherwise.

## Sorting

- Merge repeats into one finding with a count. When one finding's fix lands in another, rank them together.
- Flag `system-caused` when the root cause is a token, preset or component (every menu opening on a slow preset). It merges every screen it hits, and its fix goes to the system.
- Taste moves to Left out. A deliberate departure, or a problem no criterion covers, goes to For a person to decide.

## The 13 criteria

1. **The purpose is clear on arrival.** The title, the main heading and the primary action name the same task.
2. **One action leads.** The likeliest next step carries the most visual weight, and no two actions compete for first.
3. **Visual order follows importance.** Blur the capture and name the one element that still reads first. If none does, that is a finding.
4. **Related things sit together.** A label sits closer to its own field than to the next one.
5. **Labels name the result.** A button says what happens when it is used, with no tooltip or guessing needed.
6. **The user knows where they are.** The current step, list item or section is visible, and so is the way back.
7. **The screen shows what is happening.** Loading, saving, success and failure each look different, and feedback sits at its trigger. A copy shows a brief check on its own button, not a notification. A form error marks the field itself. A failed optimistic update reverts and says so where it happened.
8. **Mistakes are hard to make and easy to undo.** Irreversible actions ask for confirmation. Reversible actions offer undo, and a confirm on a reversible action is a note. An error says what went wrong and how to fix it, next to the cause, and keeps what was entered. A field shows the value that will be sent.
9. **The task asks for no more than it needs.** Values the app already knows are prefilled.
10. **It matches the rest of the product.** Things that look the same behave the same. A departure needs a reason in code, a spec or a comment, or it is a finding. Optical misalignment and oversized icons are findings here.
11. **Content holds at the extremes.** The longest realistic names, large numbers, translated text, missing values, very short content. Text the user chose to identify something, such as a name, wraps and never truncates (`trap/chosen-text-truncated`).
12. **It works at every reviewed width.** Nothing essential is cut off or hidden without a way to reach it. Controls stay reachable at 390 and at each width where the layout switches.
13. **It answers the hand.** Every press shows feedback within 100 ms, input motion tracks the pointer, nothing waits on an animation before accepting the next input, and focus and selection land where the hand expects. The evidence is measured, never a screenshot. Cite the trap, such as `trap/press-delayed` or `trap/motion-blocks-input`.

## Edge cases

Mark each shown or not shown. A case that was not shown is a question for the designer, not a mistake.

- Data: empty; loading and slow loading; error, including a failed save; partial data; long and very short content; first use, and a returning user with lots of data.
- Access: no permission or a read-only role; offline.
- Width: narrowest, widest, and one where the layout switches.
- Flow: success after the main action; an empty state that says what goes here and offers the first action; stand-in content that is the right kind of thing at a realistic length.
- Touch: no hover that flashes or sticks, no input zoom on focus, no keyboard before the user asked for one.
- Motion: reduced motion on, the same action repeated quickly, a throttled CPU.

## Not reported

- Preferences no criterion supports.
- Token use, component choice or a spec's completeness. Plumbline and the project's check cover those. The exception is an installed system's rule, which is an agreed criterion.
- Rewritten copy. Flag the unclear text and say what is unclear.
- Code defects such as console errors. Mention them once under For a person to decide so they reach QA.
- Motion that uses a named preset correctly and still looks wrong. Hand it over with a slow-playback capture.
