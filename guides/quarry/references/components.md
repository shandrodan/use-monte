# Components

What each family's one canonical component carries before anything migrates onto it. Every rule here comes from a gap a migration found one screen at a time.

## Pick one per family

Group the inventory into families (button, input, dialog, badge). Then pick one per family:

```
Which implementation becomes canonical?
├── The one with the most real call sites
├── tie → the one with the better accessibility (name, role, keyboard)
└── tie → the one with the fewest props that still do the job
```

- Every other implementation in the family is a duplicate and gets an old-to-new map.
- A registry file lists every canonical component with its import path, its status and what it replaces. `rule/unregistered-ui` and `rule/deprecated-import` read it.
- Keep a stock library component stock. Deprecate only wrappers the app wrote. A stock file you do customise goes on the drift list with its hash, and `rule/stock-edit` fails on any later edit. Why: an unrecorded edit is lost on the next library update.
- Prefer composition (`asChild`, `render`) to a `variant` that swaps the element.

## Census before the pilot

Count the call sites of every primitive the app renders, not just controls: text, small text (meta, caption), icon, badge tones, icon-button tones, link, divider. The text and small-text primitives ship in wave 1 with Button. Why: a migration without them reaches for a raw `<p>` or `<span>` on every screen, and each one becomes a gap row later.

## States

- Precedence, strongest first: disabled, invalid, focus, pressed, hover, selected, rest. Hover never overrides focus or invalid, and disabled controls get no hover.
- Pending: the idle label stays, a spinner sits inside the same box, `aria-busy` is set, and `aria-disabled` with an early return blocks a second submit while focus stays put. Never `disabled`, never a swapped label, never a width change.
- Never draw a disabled control's required marker in red.
- Every primitive has a default accessible name and a `label` override, both stated in its doc. A size toggle that shows "S", "M", "L" is named "Small", "Medium", "Large".
- State words stay accurate in states no fixture reaches: `selected`, `queued`, `uploading`, `done`. Test the picked state, the pending state, and an error inside a collapsed section.
- Never make `title` or `children` required on a primitive. Why: legacy screens omit them, and each required prop became a gap row.
- A default that guards a destructive or typed action (a confirmation-phrase match, a default focus) changes only with the owner's ruling and a list of callers. Verify the riskiest callers before any sweep.

## Behaviour contract

Every interactive primitive gets a table of what fires when, and every row is a test.

| Event | Expected | Test |
|---|---|---|
| Enter or Space right after a picker opens | Nothing is written. Selecting needs an arrow key or a pointer | open, press, assert 0 writes |
| Escape in a dialog | The top layer closes and focus returns to the opener | assert `document.activeElement` |
| Confirm succeeds / fails / the opener is gone | Focus goes to the opener / the opener / the next row or the list | assert each |
| A keystroke the sanitiser would change | Ignored, never committed as something else | type `2.5`, assert the box and the value |
| Text the control cannot parse | Submit is refused and the field says why. The last good value is never sent | type `abc`, submit, assert 0 requests |

Every overlay and form primitive's PR carries its focus-return matrix.

## Layout

- A table has a responsive plan, not just `hideBelow`: one primary flexible column, a minimum width and a stacked tier. Measure that row controls stay reachable inside the scroller at 390, 768, 1280 and 1920. A column newly hidden at 390 is always a gate.
- A template exposes a named width, a per-route column override (the deepest route wins) and an aside slot. Keep one page width per section, and give reading content a measure inside it (`trap/text-measure`) rather than narrowing one page. Why: a visible jump at 1280 came from two systems with different wide tokens and padding.
- A change to the shell or a page template is verified on one route per layout family at three widths: compare main's `scrollHeight` with its `clientHeight`, check centring on auth pages, and count `aria-current` per tablist.
- Removing or renaming a system API sweeps every caller in the same change, dirty files included, or keeps an alias for one wave. Typecheck every consumer afterwards.
- A component's docs run: description, examples, variants, states, props, usage, accessibility, tokens, related. Logbook writes them.
