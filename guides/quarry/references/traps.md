# Traps

Behaviour bugs that turn up in any app. Each has a fixed ID, and specs, reviews and checks all cite that ID, so a finding, a spec line and a failing check name the same thing. Where `check-system.mjs` flags a trap it uses the same ID, and `--explain <id>` prints its rule.

A trap beats the app's majority. When the app makes the mistake everywhere, the fix still wins and the conflict becomes a gate whose default is the fix. Why: copying a bug onto every screen makes it the system's bug.

Add a trap only after it has cost a real run, and never list an ID twice.

## From a symptom

```
What does the person say?
├── "laggy", "slow to respond"     → press-delayed, motion-input-lag, motion-blocks-input
├── "it jumps"                     → loading-layout-shift, numbers-shift, weight-shift
├── "fine on desktop, bad on phone" → touch-hover-flash, hover-unguarded, touch-input-zoom, viewport-height
├── "I can't click it"             → decor-pointer, list-dead-gap, exit-eats-input
└── "the focus ring comes and goes" → hover-beats-focus, open-trigger-unfocused, disabled-drops-focus
```

Each ID below is written without its `trap/` prefix. The format is: smell → fix.

## Actions and forms

- `button-div`: a `div` or `span` with `onClick` → a `button`, or an `a` when it navigates.
- `role-button`: `role="button"` on anything but a `<button>` → a real button. Why: Enter, Space and disabled never get rebuilt correctly by hand.
- `native-control`: a raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<dialog>` outside the ui folder when the system has that component → the system component.
- `link-as-button`: an `<a>` with a background and padding, or a Button variant on a link → one element, a Button rendered as the link.
- `link-wraps-button`: a link around a button, or a button around a link → one element. Two tab stops for one action is the bug.
- `button-clone`: another element wearing the Button's classes → render the Button.
- `button-icon-name`: an icon-only button with no accessible name → name it in every variant.
- `button-type`: a button inside a form with no `type` submits the form → default to `type="button"`.
- `button-label-wrap`: a button label that breaks onto two lines at 390 px → `white-space: nowrap`, a shorter label, or a full-width button.
- `control-height`: a button, input and select side by side at different heights → one height token per size. Measure in the browser; more than 1 px apart fails.
- `submit-repeat`: a pending submit takes a second click or Enter → `aria-disabled` plus an early return, keeping focus.
- `loading-label-swap`: `{saving ? "Saving..." : "Save"}` → keep the idle label, put a spinner in the same box, set `aria-busy`.
- `loading-layout-shift`: the box changes size between idle and pending → measure both; any change fails.
- `disabled-drops-focus`: a focused control turns `disabled` while it works and focus falls to `body` → `aria-disabled` while pending.
- `disabled-still-hovers`: a disabled control changes colour on hover → hover styles skip `[disabled]` and `[aria-disabled]`.
- `hover-beats-focus`: hover hides the focus ring or the invalid border → focus and invalid outrank hover.
- `weight-shift`: font weight changes on hover or selection → show the state with colour, fill or an underline.
- `focus-ring-shape`: a ring that ignores the radius or that a parent's `overflow` clips → an outline that follows the radius.
- `field-label`: the placeholder is the only name → a visible label bound to the control.
- `label-unbound`: a `<label>` with no `htmlFor` and no control inside → bind it. Clicking the label must focus the control.
- `field-input-type`: a field without `type`, `autocomplete` and `inputmode` → set all three for the field's kind.
- `field-affix-focus`: an icon or prefix beside the input instead of inside its box → inside the hit area, or its own named button.
- `field-form-enter`: fields outside a `form`, so Enter does nothing → one `form`, one submit, native constraints passed through.
- `field-error-link`: error text near the field but not tied to it → `aria-invalid` plus `aria-describedby`.
- `field-error-timing`: errors from the first keystroke → first on blur or submit, live after that.
- `date-local-midnight`: a date-only value sent through a midnight `Date` (`new Date("2025-03-15")`) and shown or sent in another time zone → keep it a `YYYY-MM-DD` string, or read and write it in UTC. Test west of UTC.
- `field-keeps-input`: a failed request clears what was typed → keep every value the person entered.
- `required-everywhere`: a required marker on every field → mark whichever of required and optional is rarer.
- `touch-input-zoom`: input text under 16 px on a phone → 16 px at touch widths. Never disable pinch zoom.
- `zoom-disabled`: `user-scalable=no` or `maximum-scale=1` → remove it.
- `touch-autofocus`: `autoFocus` on a page field → drop it on touch, unless typing is the page's only job.

## Choices, toggles, overlays, menus

- `select-value-lost`: a select loses its value when the form errors or its options reload → the value outlives errors and refetches.
- `select-empty-value`: an optional select with no way back to "none" → a clear control or an explicit empty option.
- `select-async`: "No results" flashes while a search is running → loading wins over empty.
- `toggle-switch-submit`: a switch that only applies on Save → a switch acts at once. Otherwise it is a checkbox.
- `toggle-indeterminate`: "select all" with no mixed state → three defined states.
- `overlay-title`: a dialog with no title → a title part, visible or visually hidden.
- `overlay-focus-return`: focus lands on `body` after a close → back to the opener, or to a named fallback when the opener is gone.
- `overlay-conditional-render`: `{open && <Dialog>}` → keep it mounted and pass `open`.
- `overlay-destructive`: a destructive confirm that closes on an outside click → only Cancel and Escape dismiss it.
- `overlay-pending-dismiss`: Cancel or Escape closes a dialog mid-submit → block dismissal while pending.
- `overlay-no-max-height`: a dialog taller than a 320 px screen with no scroll → `max-height: calc(100dvh - 2rem)` and `overflow-y: auto`.
- `exit-eats-input`: a press during an exit animation reopens the layer or is lost → the exiting layer takes no pointer input.
- `escape-nested`: Escape closes the dialog behind an open menu → Escape closes the top layer only.
- `open-trigger-unfocused`: an open menu's trigger looks the same as at rest → show the focus look while it is open.
- `menu-navigation`: menu items that navigate, built as buttons → links, so opening in a new tab works.
- `menu-only-path`: an action reachable only by right-click or hover → a visible second path.
- `menu-diagonal`: a submenu that closes when the pointer moves diagonally towards it → a short delay or a safe triangle.
- `list-dead-gap`: rows spaced with margin, so the gaps are dead → padding, so the hit areas touch.
- `tooltip-essential`: information that only a tooltip holds → put it on the page. The tooltip only repeats it.
- `tooltip-disabled-trigger`: a tooltip explaining why a button is disabled → visible text, or an `aria-disabled` button that stays focusable.
- `tooltip-interactive`: a link inside a hover tooltip → tooltips hold text only. Anything clickable is a popover.
- `toast-errors`: an error that needs action, shown only in a timed toast → keep it until it is closed or acted on.
- `toast-timer`: the timer keeps running under the pointer or in a hidden tab → pause on hover, focus and hidden.
- `live-region-double`: two layers announce the same message → one announcing layer.

## Navigation, data, layout

- `tabs-routes`: tabs that change the URL, built as a tablist → links with `aria-current`, or panels, never both.
- `current-unmarked`: the current item looks current but is not marked → `aria-current` or `aria-selected`.
- `narrow-hidden-nav`: at 390 px, nav links or columns sit past a clipped edge with no cue → a menu button, a wrap, or a fade at the edge. The gate lists each hidden item.
- `link-cue`: a link in body text with no underline, in the text's own colour → a resting cue. Changing it is a gate listing every surface.
- `table-divs`: a table built from divs → a `table`, or the grid role with its keyboard model.
- `chosen-text-truncated`: a name or other text the user chose, cut with an ellipsis → wrap it. Never truncate it.
- `empty-value`: a blank cell here, a typed dash there, "N/A" elsewhere → one empty-value primitive, announced as "None".
- `numbers-shift`: changing numbers set in proportional figures → `font-variant-numeric: tabular-nums`.
- `color-only-status`: a status shown only by colour → text or an icon carries it.
- `text-measure`: reading lines longer than 75ch or shorter than 30ch → `max-width` in `ch` on reading columns.
- `overflow-scrollbar`: `overflow: auto` on a box 1 or 2 px shorter than its content → leave room, or clip.
- `viewport-height`: `100vh` or `h-screen` on a shell or sheet → `dvh`, or `svh` when it must not change while scrolling.
- `safe-area`: controls under the notch or the home indicator → `env(safe-area-inset-*)` with `viewport-fit=cover`.
- `scroll-chain`: scrolling a panel to its end starts scrolling the page → `overscroll-behavior: contain`, and lock page scroll under a modal.
- `decor-pointer`: a glow or gradient layer above content catches clicks → `pointer-events: none` on decoration.
- `touch-hover-flash`: hover styles fire on tap and stick → wrap them in `@media (hover: hover)`.
- `hover-unguarded`: a `:hover` rule outside that media query reveals content → guard it, and give touch another path.
- `touch-tap-highlight`: the tap highlight removed with no pressed style → a pressed state from pointer-down.
- `press-delayed`: press feedback waits for release or for an animation → feedback within 100 ms of pointer-down.
- `surface-double-edge`: one surface with both a border and a shadow → a border on resting surfaces, a shadow on raised ones.
- `weight-synthesized`: a weight token the loaded font files do not contain → name only weights that exist. `font-synthesis: none` reveals the gap.
- `illustration-announced`: an HTML illustration read out in fragments → `role="img"` with a label, or `aria-hidden`.
- `loader-small-dots`: a dot loader smaller than 20 px → a thin ring.
- `gesture-drag`: a drag that drops when the pointer leaves, or jumps on a second touch → pointer capture, ignore extra touches, decide the release on velocity.
- `gesture-axes`: one swipe moves both the element and the page → `touch-action` set to the axis the element owns.

## Motion

- `motion-transition-all`: `transition: all` or `transition-all` → name the properties, usually `transform` and `opacity`.
- `motion-ease-in-enter`: an entrance on `ease-in` → enters ease out.
- `motion-exit-slower`: an exit longer than its enter → exits are shorter.
- `motion-overshoot`: a `cubic-bezier` value outside 0 to 1 on a routine change → keep every value inside 0 to 1.
- `motion-linear`: linear easing on anything but progress and loops → ease out for enters, symmetric between two points.
- `motion-frequent`: entrance motion on navigation, list rows or primary actions → none, or first open only.
- `motion-input-lag`: an element that follows the pointer through an easing curve → track the input every frame and carry the release velocity.
- `motion-blocks-input`: an entrance that ignores clicks until it finishes → accept input at once.
- `motion-origin`: a menu that grows from its own centre → grow from the trigger and exit in reverse. Dialogs stay centred.
- `motion-restart`: retriggering restarts from the start value → continue from the current value.
- `motion-layout-property`: animating width, height, top, left or margin → `transform` and `opacity` only.
- `reduced-motion-ignored`: movement under `prefers-reduced-motion: reduce` → drop the movement and keep the fade that explains the change.
- `loop-offscreen`: a loop running off screen or in a hidden tab → pause it out of view.
- `theme-transition`: a theme switch fires every hover transition → disable transitions for that frame.
- `demo-on-timers`: a showcase demo stepping on `setTimeout` → wait on `getAnimations()` and their `finished` promises.
