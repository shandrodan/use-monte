# Entry format

Replace this file with your team's format. The skill treats whatever it says as agreed. The order leads with the job and an example to copy, then variants and states, then the API, usage and accessibility. Why: readers copy the first example they see, so it has to be the right one.

## Headings

Exactly these nine H2s, in this order. Add, drop or rename nothing.

1. `## Description` (may hold `### Parts`)
2. `## Examples` (holds `### Example files`)
3. `## Variants` (one H3 per axis, named after its prop)
4. `## States`
5. `## Props`
6. `## Usage`, with these six H3s: `### When to use`, `### When not to use`, `### Rules`, `### Content`, `### Anti-slop`, `### Limits`
7. `## Accessibility`
8. `## Tokens`
9. `## Related`

## Each section

**Description.** One sentence on the job the component does, never on how it looks. Below it, one line: the import, client or server, the source path, the registry status.

**Examples.** The default example first, copied verbatim from a story or example file, with its path above it. When none exists, use the most common real call site with the unrelated props removed and nothing else changed, labelled `simplified from <path>`. Then `### Example files`: a table of file, what it covers and its caption, holding the default, every variant value and state that looks or behaves differently, and one composition inside a parent.

**Variants.** One H3 per axis, one line per value with the job it covers. When two values cover the same job, say so. No variant prop: `None.` and why.

**States.** One line per state that exists, saying what the user can do in it. Check default, hover, focus, pressed, disabled, pending and error, and drop any it lacks. A state shown only visually names its cue. State precedence goes here when states can overlap.

**Props.** From code only: name, type, default, when to change it. `NOT SUPPLIED` when no props type was read.

**Usage.**
- *When to use / When not to use.* Two to four lines each. Each line is a situation the designer is in, never a property of the component. Each "when not" names the other component and says "instead".
- *Rules.* Behaviour over time, input methods, focus, feedback, composition, placement, density.
- *Content.* Per copy slot: casing, template, length, forbidden words.
- *Anti-slop.* What an agent writes by default that this app does not. To find it, give one fresh agent a task that needs the component and compare its code with the real call sites. `Not applicable: <reason>` when nothing differs.
- *Limits.* A number set below a measured breaking point, or `NEEDS REVIEW (not measured)` plus what to measure.

**Accessibility.** The native element or primitive underneath, the role, the keys that operate it, where focus goes afterwards, the accessible name in every variant. Mark which facts came from code and which from a rendered story.

**Tokens.** Token names grouped by what they control, spelled exactly as the source spells them, read from named references in the styles and never from raw values.

**Related.** Components people confuse with this one, each with when to pick it instead.

## Rule shape

```
- `rule/<component>-<slug>`: When <condition>, <action> instead of <alternative>, because <reason>. Evidence: <ground>. Check: <lint | test | probe | review> <what runs>.
  - Don't: <one line of real code that breaks it>
  - Do: <the fix>
```

Evidence is one of: two call sites, a measurement with its path, a named principle, or the person's words.

Before a rule ships:
1. Write a violating snippet and confirm the check or a reviewer catches it.
2. Negate the rule. If the opposite sounds just as reasonable, sharpen it.
3. Sweep every call site. Each one follows the rule or is a listed exception.

## Worked example

A Toast from an imaginary task tracker, cut down to the parts that teach the most.

````markdown
## Description
Toast confirms the result of something the user just did, without taking them off the screen.

`import { Toast } from "@/components/toast"`, client only, `src/components/toast/Toast.tsx`, status NOT SUPPLIED (no registry in this repo).

## Variants

### tone
- Success: an action finished, and it can often be undone
- Error: an action failed, and it may be retried
- Warning: NEEDS REVIEW. In the stories but missing from the `tone` type. See Conflicts

## States
- Visible: the timer runs, and the action and close button can be activated
- Paused: focus or the pointer is inside, and the timer stops
- Leaving: input is ignored. Leaving beats Paused. Error toasts have no timer

## Usage

### Rules
- `rule/toast-error-persists`: When `tone` is `"error"`, keep the toast until it is closed or its action runs, instead of timing it out, because its Retry is the only way back to the failed request. Evidence: single use `RemoveMember.tsx:41`. Check: review.
  - Don't: `<Toast tone="error" duration={6000} message="Could not remove Dana" />`
  - Do: `<Toast tone="error" message="Could not remove Dana" action={{ label: "Retry", onAction: retry }} />`

### Anti-slop
Not applicable: a fresh agent asked to "confirm that a card moved" wrote the same call as the Board screen.
````
