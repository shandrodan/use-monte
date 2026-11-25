---
name: monte
description: Monte design system rules for this project's UI. Use when building or changing any screen, component, form or style, when porting an existing screen onto Monte, or when checking UI against Monte.
---

# Monte

Monte is compact and ruled, built for infrastructure and data tools. White and cool near-black grounds, 1px rules for structure, mono capitals for every interface word, Geist for headlines and prose, zero radius, and one azure for the thing to act on. Every colour is computed in oklch from the seeds at the top of `components/monte/tokens.css`. To retune, change a seed, never a role. Why: roles point at ramp steps, so a seed change keeps every contrast pair intact.

## Setup

Once, in the root layout:

```tsx
import {MontePortalProvider} from '@/lib/monte/portal'
<body className="monte"><MontePortalProvider>{children}</MontePortalProvider></body>
```

Monte's styles and tokens apply only inside the `monte` class. Menus, dialogs, popovers and toasts render at the end of the body, and `MontePortalProvider` keeps them inside the scope. Why: without it, every overlay loses every token.

Dark mode is `data-theme="dark"` on the `monte` element or any ancestor, such as `<html>`. The theme never follows `prefers-color-scheme` on its own.

## Building a screen

```
Is this a whole screen?
├── Yes → does a block under Blocks fit?
│   ├── Yes → install it, then replace its sample data and copy with the real ones
│   └── No → start from the Page shell below
└── No → go to the component index
```

Then, for every piece of the screen:

```
Does the index list a component for this job?
├── Yes → read its source file first (the header comment has its props, variants and rules), then import it from the path in the index
├── Is it one of Toolbar, Number input, Listbox, Menubar, Resizable, Tree? → read references/ui-sdk.md first
└── No → stop and say which token or component is missing. Never invent one
```

- Build only from the index's components and the tokens under Tokens. Support pieces are under Imports.
- Ask the person only for a fact you were not given, such as a region or a limit. Decide everything else from these rules and say what you chose.
- Porting an existing screen: swap one piece at a time for its component, keep the behaviour and the copy, and delete the old styles once nothing uses them. For a whole app, use the use-monte skill when it is available.

## Checking

1. Run `npx eslint -c monte.eslint.config.mjs .` (the rules live in `lib/monte/lint`) and fix every error. Each message names its fix.
2. Render the screen at 390 and 1280 wide.
3. Check it against the global rules and the anti-slop list, fix the worst defect, and check again.
4. When the use-monte skill is available, review with its lookout guide (`guides/lookout/GUIDE.md` inside use-monte).

Done when no MUST or NEVER rule is broken and no raw colour, size or font is left.

## When rules conflict

The higher item wins:

1. Accessibility and keyboard behaviour
2. Tokens by role, never raw values
3. Existing components and recipes, never rebuilt
4. The signatures: mono capitals through the label roles, rules as structure, the one azure action, square corners
5. Compact spacing and type

## Global rules

1. monte-components-first MUST Use a Monte component or recipe before writing markup, and read its source file before building with it. Why: each one already carries the focus ring, the states and the brand rules that a hand-built copy forgets.
   - Correct: `import {Button} from '@/components/monte/ui/button'`
2. monte-scope MUST Wrap Monte UI in `className="monte"` with `MontePortalProvider` inside it. Why: a menu or dialog renders at the end of the body, outside the scope, and loses every colour without the provider.
   - Correct: `<div className="monte"><MontePortalProvider>{children}</MontePortalProvider></div>`
3. monte-tokens-only MUST Use only roles Monte defines (`text-text-2`, `bg-panel`, `border-line`). Never a hex, an arbitrary px or a `dark:` variant. Why: the dark theme swaps the roles, and a raw value stays behind.
   - Correct: `<p className="text-text-2">`
   - Wrong: `<p className="text-[#55524a]">`
4. monte-one-primary MUST Give a frame, footer, dialog or any group of actions at most one primary Button (the azure slab, or the destructive one). Every other action beside it is `variant="secondary"` or `"ghost"`. Why: the slab is how a person finds the next action, and two side by side split the eye.
   - Correct: `<Button variant="secondary">Keep</Button><Button>Run</Button>`
   - Wrong: `<Button>Keep</Button><Button>Run</Button>`
5. monte-accent-text-role MUST Set brand-coloured text, icons and lone lines in `text-accent-text` (or `border-accent-text`), never in the fill role `accent-fill`. Why: the fill is the slab's azure, while the text role is re-picked per theme for contrast: a darker azure on white, a lighter one on the dark page.
   - Correct: `<span className="text-accent-text">Running</span>`
   - Wrong: `<span className="text-accent-fill">Running</span>`
6. monte-caps-through-roles MUST Set every interface word (button, tab, tag, table head, axis) in a label role, and every sentence in the sans. Why: the role carries the mono face, the capitals and the tracking together, and a sentence in capitals reads slowly.
   - Correct: `<span className="type-label-sm">Queued</span>`
   - Wrong: `<span className="uppercase">Queued</span>`
7. monte-rules-not-boxes MUST Box a region once with `frame` and divide its parts with rules. Never a box inside a box, never a grid behind the page. Why: rules carry Monte's layout, and extra edges or a background grid bury them.
   - Correct: `<main><div className="frame"><div className="rule-row">`
   - Wrong: `<main className="dots"><div className="frame"><div className="frame">`
8. monte-square NEVER Round a corner anywhere. Why: square corners meet the 1px rules cleanly, and one rounded part reads as another system.
   - Correct: `<div className="frame">`
   - Wrong: `<div className="frame rounded-lg">`
9. monte-focus-ring MUST Keep the 2px focus ring on every control, and never set `outline: none`. A field shows focus on its own edge. Why: keyboard users lose their place without it.
10. monte-sentence-case MUST Write sentence case in the source, and a verb with its object on actions. The label roles set the capitals. No emoji, no em dash. Why: the source then reads as plain words to a screen reader, and every screen sounds like one person.
   - Correct: `<Button>Run pipeline</Button>`
   - Wrong: `<Button>OK</Button>`

## Page shell

Every screen sits in this frame:

```
Root            <div className="monte min-h-dvh bg-page text-text-1"> with MontePortalProvider inside
Page title      <h1 className="type-title">, exactly one per page
A region        <section className="frame">, a panel-head row, parts divided by rule-row or rule-col
Several numbers a status strip: one ruled row of cells, a type-micro label over a type-code value
A run's steps   ToolCallStack beside or under the frame, never inside it
A phone moment  a component at w-full max-w-sm, sized to its content, no device frame; its one slab sits in a row of Buttons
```

## Anti-slop

Habits of generated UI that Monte bans, each with its reason.

- anti-slop-no-cell-grid NEVER Draw a cell grid or dot field behind the page or behind content. Why: the owner ruled it out. A grid behind every word fights the rules that carry the layout, and it is the first thing a generated "technical" screen reaches for.
  - Wrong: `<main className="dots min-h-dvh">`
- anti-slop-no-terminal-costume NEVER Dress a screen as a terminal: green or deep blue on black, scanlines, a `>` prompt before a headline, ASCII boxes. Why: Monte takes a terminal's discipline, not its look, and the costume makes a real tool read as a toy.
  - Wrong: `<h1 className="text-ok-text">&gt; pipelines_</h1>`
- anti-slop-no-decoration NEVER Add a gradient, blob, glow or backdrop blur. The only gradient is the light from below that the slab and edged recipes draw on a button. Why: Monte is flat fills and 1px rules, and decoration competes with the one azure action.
  - Wrong: `<div className="bg-linear-to-br from-page to-well backdrop-blur">`
- anti-slop-no-rounding NEVER Round a corner to soften a region, a control or an avatar. Why: every corner is square, and the one round corner is the part everyone notices.
  - Wrong: `<div className="frame rounded-xl">`
- anti-slop-no-accent-everywhere NEVER Use azure beyond the one primary, the selection, focus and a chart series: no azure headers, header squares, borders, icons or badges. Why: azure marks the thing to act on, and azure everywhere marks nothing.
  - Wrong: `<header className="bg-accent-fill">`
- anti-slop-no-stat-cards NEVER Lay out a row of equal cards with one number each. Why: equal boxes make every number equally loud. A status strip puts them on one ruled row where they compare.
  - Wrong: `<div className="grid grid-cols-4 gap-4"><div className="frame">…</div>…</div>`
- anti-slop-no-box-in-box NEVER Box a part inside a frame. Divide it with a rule. Why: two edges a few px apart read as a double line.
  - Wrong: `<div className="frame"><div className="frame">`
- anti-slop-no-side-rail NEVER Mark a row with a coloured bar on one edge. Why: the bar reads as a status nobody defined. A chosen row takes the selection wash, and a row draws nothing at its start.
  - Wrong: `<div className="border-s-4 border-accent-edge">`
- anti-slop-no-status-dots NEVER Show a status with a round dot. A status is a square mark plus a word. Why: a round dot is the one curve on a square screen, and its meaning rides on hue alone.
  - Wrong: `<span className="size-2 rounded-full bg-ok"/> Passed`
- anti-slop-no-label-above-title NEVER Put a small label, category or number above a headline. Why: the headline already names the section. A name belongs in a panel header row, never stacked over a title.
  - Wrong: `<p className="type-label">Overview</p><h2 className="type-heading">Runs</h2>`
- anti-slop-no-caps-sentences NEVER Set a sentence, description or headline in mono capitals. Why: mono capitals are for words a person scans. A sentence in them reads slowly and shouts.
  - Wrong: `<p className="type-label">The backfill wrote 1,204 partitions.</p>`
- anti-slop-no-emoji NEVER Use emoji in copy, titles or buttons, or as icons. Why: emoji render differently on every device and turn a tool into a chat thread.
  - Wrong: `<Button>Deploy 🚀</Button>`
- anti-slop-no-hype NEVER Write seamless, effortless, supercharge, unleash or blazing. Say what happens. Why: people trust a tool that states the fact.
  - Wrong: `Blazing-fast pipelines.`
- anti-slop-no-brackets-everywhere SHOULD Keep brackets for a machine action, a tool call or a step an agent took, never around a person's button. Why: brackets say a machine did this, and on a person's action they blur who acted.
- anti-slop-no-fake-data SHOULD Fill examples with believable data, never Lorem ipsum, John Doe or 1,234. Why: placeholder data hides the truncation and alignment problems that real data shows.
- anti-slop-no-blinking-caret NEVER Leave a caret blinking at rest, or type out text a person is waiting to read. Why: a caret belongs to typing. At rest it reads as a field waiting for input, and slow typing hides an answer behind an effect.
  - Wrong: `<span className="caret animate-[blink_1s_steps(1)_infinite]"/>`
- anti-slop-no-scroll-reveal NEVER Fade or slide content in as it scrolls into view. Why: content that hides until scrolled to gets missed.
  - Wrong: `<motion.section whileInView={{opacity: 1}}>`
- anti-slop-dialog-controlled MUST Open a Dialog with `open` and `onOpenChange`, and never mount it only while open. Why: a dialog that unmounts skips its exit and loses the trigger that focus returns to.

## Reject list

A screen with any of these is not Monte:
- Rounded corners, shadows, gradients, blur, a grid behind the page.
- Brand-coloured text or icons in the fill role, a warning in the brand colour, a second slab.
- Bold, capitals outside the label roles, a sentence in capitals.

## Imports
- `import {useOverlayOpen, overlayModel, overlayOpenChanged, overlayMayClose, overlayRunStarted, overlayRunSettled, isThenable, closesAfter, useDefaultAction, useScrollBody, overlaySurface, overlayModal, overlayMotion, overlayHeaderClass, overlayTitleClass, overlayHeadMetaClass, overlayBodyClass, overlayDescriptionClass, overlayFooterClass, overlayMetaClass, overlayErrorClass, scrimClass, menuPopupClass, menuVarsClass, menuItemClass, menuCheckItemClass, menuLabelClass, menuSeparatorClass, menuShortcutClass, optionItemClass, optionCheckClass} from '@/lib/monte/overlay'`: What every overlay shares: the edged panel surface, the way it arrives, and the list rows of selects, comboboxes and menus.
- `import {useScrollTabStop, findAll} from '@/lib/monte/scroll'`: Support file: the tab stop a scrolling data region takes while it overflows, and the case-free search matcher.
- `import {motionDefaults, parseDuration, easeOut, useMotionToken, useTimeline} from '@/hooks/monte/use-timeline'`: The frame clock under Monte's typing, scrambles and connectors: deterministic given a clock, final at once under reduced motion.
- `import {typedAt, firstChars, useTyping} from '@/hooks/monte/use-typing'`: Types text in at about 55 characters a second behind a caret shown only while typing.
- `import {scrambleGlyphs, scrambleTick, hash, scrambleAt, useScramble} from '@/hooks/monte/use-scramble'`: Resolves a mono label through glyphs in about 0.4 seconds.
- `import {drawAt, useDraw} from '@/hooks/monte/use-draw'`: Draws connectors out one hop at a time, about 0.3 seconds a hop.
- `import {controlHeight, reducedMotion, cn, mergeClass, mergeRefs} from '@/lib/monte/utils'`: cn, which merges class names and resolves conflicts between Monte's type roles and button surfaces; mergeClass, which keeps Monte's classes when a caller passes a className function; mergeRefs; and controlHeight, the one height formula for one-line controls.
- `import {Icon} from '@/components/monte/icon'`: The one import point for icons: Lucide, squared off with square ends, mitred joins and a 1.25px line.
- `import {MontePortalProvider, useMontePortal, useMonteModal, cycleTab, coarsePointer} from '@/lib/monte/portal'`: Puts overlays inside the .monte scope so they keep its tokens, and makes the page inert behind a modal.
- `import {MonteDirection, useDomDirection} from '@/lib/monte/direction'`: Hands the reading direction to Base UI and to popups opened from a right-to-left subtree.

## Icons
Import a glyph beside Icon from the path under Imports and pass it in: `<Icon icon={Activity} size={16}/>`. These are all the names; another needs adding to that file first.
Activity, Add, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Branch, Calendar, Checkmark, ChevronDown, ChevronLeft, ChevronRight, ChevronSort, ChevronUp, Chip, Close, Code, Copy, Cube, DataBase, DataTable, Document, Download, Edit, ErrorOutline, Filter, Flow, Folder, Information, Launch, Lightning, Locked, Meter, Moon, OverflowMenuHorizontal, Pause, Play, Renew, Search, ServerDns, Settings, StopOutline, Subtract, Sun, Terminal, Time, TrashCan, Undo, Upload, View, ViewOff, WarningAlt, ArrowsHorizontal, CollapseAll, ExpandAll, Misuse, TextWrap

## Tokens
The closed list. Use a token through its class, never a raw value: colors are utilities named after the role (bg-code-surface, text-text-1, border-line-faint); sizes read the scale (type-body, rounded-4xl, h-(--control-lg), duration-(--dur-press)).
The class to use follows each token in brackets. Color names take bg-, text- or border-. A token with no class is read as a value, such as h-(--name).
- Surfaces: --page (bg-page), --panel (bg-panel), --well (bg-well), --code-surface (bg-code-surface), --hover (bg-hover), --pressed (bg-pressed), --selected (bg-selected), --selected-strong (bg-selected-strong), --scrim (bg-scrim)
- Text: --text-1 (text-text-1), --text-2 (text-text-2), --text-3 (text-text-3), --text-disabled (text-text-disabled), --text-inverse (text-text-inverse)
- Lines: --line-faint (border-line-faint), --line (border-line), --line-control (border-line-control), --mark (border-mark), --dot, --line-width, --focus-width (focus-ring), --focus-offset, --dot-pitch, --rail-pitch, --rail-dot, --pending-cell
- Accent: --accent (bg-/text-/border-accent-fill), --accent-text (bg-/text-/border-accent-text), --accent-edge (bg-/text-/border-accent-edge)
- Primary: --primary-bg (bg-/text-/border-primary), --primary-text (bg-/text-/border-primary-foreground), --primary-edge, --primary-hover, --primary-edge-hover, --primary-pressed, --primary-light, --primary-light-hover, --primary-ring
- Secondary: --secondary-bg (bg-/text-/border-secondary-bg), --secondary-hover, --secondary-pressed, --secondary-edge, --secondary-edge-hover, --secondary-light, --secondary-light-hover, --secondary-ring
- Checked: --check-bg, --check-edge, --check-mark, --check-off (bg-/text-/border-check-off), --check-off-hover (bg-/text-/border-check-off-hover), --check-range (bg-/text-/border-check-range)
- Field: --field-bg, --field-hover, --field-edge, --field-edge-hover, --field-ring-hover, --field-focus-bg, --field-focus-edge, --field-ring-focus, --field-ring-fail, --field-inset-sm, --field-inset, --field-inset-lg, --row-highlight, --row-highlight-edge
- Status: --ok (bg-/text-/border-ok), --ok-text (bg-/text-/border-ok-text), --ok-tint (bg-/text-/border-ok-tint), --warn (bg-/text-/border-warn), --warn-text (bg-/text-/border-warn-text), --warn-tint (bg-/text-/border-warn-tint), --fail (bg-/text-/border-fail), --fail-text (bg-/text-/border-fail-text), --fail-tint (bg-/text-/border-fail-tint)
- Data: --data-1 (bg-/text-/border-data-1), --data-2 (bg-/text-/border-data-2), --data-3 (bg-/text-/border-data-3), --data-4 (bg-/text-/border-data-4), --data-5 (bg-/text-/border-data-5), --data-6 (bg-/text-/border-data-6)
- Focus: --focus (bg-/text-/border-focus), --caret
- Elevation: --shadow-none
- Type: --font-sans (font-sans), --font-mono (font-mono), --mono-scale, --weight-normal (font-normal), --type-display (type-display), --type-title (type-title), --type-heading (type-heading), --type-heading-sm (type-heading-sm), --type-figure (type-figure), --type-body (type-body), --type-body-sm (type-body-sm), --type-caption (type-caption), --type-label-lg (type-label-lg), --type-label (type-label), --type-label-sm (type-label-sm), --type-micro (type-micro), --type-code (type-code), --type-code-sm (type-code-sm), --tracking-display (tracking-display), --tracking-title (tracking-title), --tracking-heading (tracking-heading), --tracking-body (tracking-body), --tracking-label, --tracking-label-lg, --tracking-label-sm
- Space: --space-0-5, --space-1, --space-1-5, --space-2, --space-3, --space-4, --space-5, --space-6, --space-8, --space-10, --inset
- Size: --control-sm, --control, --control-lg, --row, --row-sm, --head, --icon, --icon-sm, --marker, --cap, --rail
- Radius: --radius
- Motion: --dur-press, --dur-state, --dur-overlay, --dur-wipe, --dur-draw, --dur-type, --dur-scramble, --dur-pending, --overlay-shift, --dur-light, --dur-glow, --ease-out (ease-out), --ease-soft (ease-soft), --ease-in (ease-in), --ease-linear (ease-linear)
- Layers: --z-raised, --z-overlay
- Layout: --overlay-sm (max-w-overlay-sm), --overlay (max-w-overlay), --overlay-lg (max-w-overlay-lg), --popover (max-w-popover), --toast, --menu-min, --popup-max, --tooltip-max, --label-col, --meter, --measure (max-w-measure), --measure-hint (max-w-measure-hint)
- Scrollbar: --scrollbar-thumb, --scrollbar-size, --scrollbar-gap

## Components

Six components run on ui-sdk instead of Base UI: Toolbar, Number input, Listbox, Menubar, Resizable and Tree. Read [references/ui-sdk.md](references/ui-sdk.md) before picking one over its Base UI neighbour. Never import `@ui-sdk/core/web.css` or a raw `@ui-sdk/react/*` part: the css restyles Monte's own components, and a raw part has no Monte skin.

### Actions
- [Button](components/monte/ui/button.tsx): Starts an action. `import {Button, buttonVariants} from '@/components/monte/ui/button'`
- [Button group](components/monte/ui/button-group.tsx): Joins related buttons into one control. `import {ButtonGroup, ButtonGroupMenu, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants} from '@/components/monte/ui/button-group'`
- [Copy button](components/monte/ui/copy-button.tsx): Copies a value. `import {CopyButton} from '@/components/monte/ui/copy-button'`
- [Toolbar](components/monte/ui/toolbar.tsx): Groups the tools for one view into a single tab stop. `import {Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarLink, ToolbarInput, ToolbarToggle, ToolbarToggleGroup, ToolbarToggleIcon, toolbarVariants, toolbarButtonVariants, createToolbarController} from '@/components/monte/ui/toolbar'`

### Inputs
- [Field](components/monte/ui/field.tsx): Gives an input its label and error. `import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle, Form, FormActions, FormStatus, Label, LabelHint, labelClasses, useFieldDisabled} from '@/components/monte/ui/field'`
- [Input](components/monte/ui/input.tsx): Takes one line of text. `import {Input, InputAction, InputControl, InputLeading, InputPending, InputRoot, InputTrailing} from '@/components/monte/ui/input'`
- [Textarea](components/monte/ui/textarea.tsx): Takes several lines of text. `import {Textarea} from '@/components/monte/ui/textarea'`
- [Select](components/monte/ui/select.tsx): Picks one option from a list. `import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, NativeSelect, fieldTriggerClass, fieldTriggerSize} from '@/components/monte/ui/select'`
- [Combobox](components/monte/ui/combobox.tsx): Finds one or more values by typing. `import {Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxCreate, ComboboxEmpty, ComboboxField, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, normalizeEmail, splitEmails, validateEmail, useComboboxAnchor} from '@/components/monte/ui/combobox'`
- [Number input](components/monte/ui/number-input.tsx): Takes a number to type or step. `import {NumberInput, numberInputVariants, createNumberInputController} from '@/components/monte/ui/number-input'`

### Selection
- [Checkbox](components/monte/ui/checkbox.tsx): Turns one option on or off. `import {Checkbox, CheckboxGroup} from '@/components/monte/ui/checkbox'`
- [Radio group](components/monte/ui/radio-group.tsx): Picks one of a few choices. `import {RadioGroup, RadioGroupItem, RadioGroupOption} from '@/components/monte/ui/radio-group'`
- [Switch](components/monte/ui/switch.tsx): Turns a setting on or off at once. `import {Switch} from '@/components/monte/ui/switch'`
- [Slider](components/monte/ui/slider.tsx): Picks a number or a range. `import {Slider} from '@/components/monte/ui/slider'`
- [Segmented control](components/monte/ui/segmented-control.tsx): Switches between a few views of one thing. `import {SegmentedControl, SegmentedControlItem, segmentedVariants} from '@/components/monte/ui/segmented-control'`
- [Listbox](components/monte/ui/listbox.tsx): Picks one or more options from a list that stays open. `import {Listbox, ListboxItem, ListboxItemIcon, ListboxGroup, ListboxGroupLabel, ListboxSeparator, listboxVariants, createListboxController} from '@/components/monte/ui/listbox'`

### Display
- [Tag](components/monte/ui/tag.tsx): Labels what something is or how it stands. `import {Tag, tagVariants} from '@/components/monte/ui/tag'`
- [Status strip](components/monte/ui/status-strip.tsx): Shows the few numbers to check first, in one ruled row. `import {StatusStrip, StatusStripCell, StatusStripLabel, StatusStripValue, StatusStripUnit, stripVariants} from '@/components/monte/ui/status-strip'`
- [Avatar](components/monte/ui/avatar.tsx): Shows who or what acted. `import {Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants, initialsOf} from '@/components/monte/ui/avatar'`
- [Kbd](components/monte/ui/kbd.tsx): Shows a key or a shortcut. `import {Kbd, KbdGroup, shortcut} from '@/components/monte/ui/kbd'`
- [Item](components/monte/ui/item.tsx): Shows one thing as a row in a list. `import {Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemMeta, ItemLink, ItemActions, itemVariants, itemGroupVariants} from '@/components/monte/ui/item'`
- [Data list](components/monte/ui/data-list.tsx): Lists label and value pairs about one thing. `import {DataList, DataListItem, DataListLabel, DataListValue, DataListEmpty, dataListVariants} from '@/components/monte/ui/data-list'`

### Feedback
- [Status](components/monte/ui/status.tsx): Says where a job or a run stands. `import {Status, StatusMark, statusVariants, statuses, statusLabels, statusRank} from '@/components/monte/ui/status'
import {RunningMark} from '@/components/monte/ui/running-mark'`
- [Meter](components/monte/ui/meter.tsx): Shows how full something is. `import {Meter, MeterLabel, MeterValue, MeterStack, meterStatus} from '@/components/monte/ui/meter'`
- [Progress](components/monte/ui/progress.tsx): Shows how far a task got. `import {Progress, ProgressLabel, ProgressValue} from '@/components/monte/ui/progress'`
- [Alert](components/monte/ui/alert.tsx): Reports a problem or a change in the current view. `import {Alert, AlertTitle, AlertDescription, AlertAction, AlertClose, alertVariants} from '@/components/monte/ui/alert'`
- [Toast](components/monte/ui/toast.tsx): Reports something that happened out of view. `import {Toaster, toast, toastManager, readingTimeout} from '@/components/monte/ui/toast'`
- [Empty state](components/monte/ui/empty-state.tsx): Explains why a region is empty. `import {Empty, EmptyIcon, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyCode, EmptyRetry, emptyVariants} from '@/components/monte/ui/empty-state'`
- [Skeleton](components/monte/ui/skeleton.tsx): Holds the shape of content while it loads. `import {Skeleton, SkeletonText, SkeletonRows, SkeletonSwap} from '@/components/monte/ui/skeleton'`

### Overlays
- [Dialog](components/monte/ui/dialog.tsx): Asks for a decision on top of the page. `import {Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogAction, DialogConfirmField, dialogVariants, useDialog} from '@/components/monte/ui/dialog'`
- [Sheet](components/monte/ui/sheet.tsx): Opens the details of one thing at the side. `import {Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription, SheetAction, SheetSection, SheetField, useSheet} from '@/components/monte/ui/sheet'`
- [Popover](components/monte/ui/popover.tsx): Shows a few lines next to a control. `import {Popover, PopoverTrigger, PopoverClose, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, PopoverInfo} from '@/components/monte/ui/popover'`
- [Tooltip](components/monte/ui/tooltip.tsx): Names a control on hover or focus. `import {Tooltip, TooltipTrigger, TooltipContent, TooltipChip, TooltipProvider, TooltipShortcut, tooltipPopupClass, tooltipMotionClass} from '@/components/monte/ui/tooltip'`
- [Dropdown menu](components/monte/ui/dropdown-menu.tsx): Lists the actions on one thing. `import {DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuLinkItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent} from '@/components/monte/ui/dropdown-menu'`
- [Command](components/monte/ui/command.tsx): Finds and runs a command by typing. `import {Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandLoading, CommandGroup, CommandItem, CommandLabel, CommandShortcut, CommandSeparator, CommandFooter, CommandHint, useCommand} from '@/components/monte/ui/command'`
- [Menubar](components/monte/ui/menubar.tsx): Holds an application's menus in one row. `import {Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarItemIcon, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarGroup, MenubarGroupLabel, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubTrigger, MenubarSubContent, menubarContentVariants, createMenubarController} from '@/components/monte/ui/menubar'`

### Navigation
- [Tabs](components/monte/ui/tabs.tsx): Switches between panels of one view. `import {Tabs, TabsList, TabsTrigger, TabsContent, TabsCount, tabsListVariants, tabBase, useActiveInView} from '@/components/monte/ui/tabs'`
- [Numbered tabs](components/monte/ui/numbered-tabs.tsx): Steps through the few numbered sections of one page. `import {NumberedTabs, NumberedTabsList, NumberedTabsTrigger, NumberedTabsContent, NumberedTabsPanels} from '@/components/monte/ui/numbered-tabs'`
- [Breadcrumb](components/monte/ui/breadcrumb.tsx): Shows where the page sits, as a path. `import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, BreadcrumbValue, BreadcrumbTrail} from '@/components/monte/ui/breadcrumb'`
- [Pagination](components/monte/ui/pagination.tsx): Moves through pages of results. `import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationInfo, PaginationNav, paginationRange} from '@/components/monte/ui/pagination'`

### Layout
- [Collapsible](components/monte/ui/collapsible.tsx): Shows and hides a region. `import {Collapsible, CollapsibleGroup, CollapsibleTrigger, CollapsibleCaret, CollapsibleContent} from '@/components/monte/ui/collapsible'`
- [Frame](components/monte/ui/frame.tsx): Boxes a region once and divides it by rules. `import {Frame, FrameHeader, FrameTitle, FrameStatus, FrameValue, FrameActions, FrameBody, FrameDescription, FrameFooter, FrameMeta, frameVariants} from '@/components/monte/ui/frame'`
- [Resizable](components/monte/ui/resizable.tsx): Splits a region into panes a person resizes. `import {Resizable, ResizablePanel, ResizableHandle, createResizableController} from '@/components/monte/ui/resizable'`

### Data
- [Table](components/monte/ui/table.tsx): Lists records that share the same fields. `import {Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, TableEmpty, TableLoading, TableTitle, TableToolbar, TableSortButton, TableRowActions, TableRowAction, tableClassName, bodyClassName, rowClassName, headClassName, cellClassName} from '@/components/monte/ui/table'`
- [Filter bar](components/monte/ui/filter-bar.tsx): Narrows a table, a log or a list in one row. `import {FilterBar, FilterBarSearch, FilterToggle, FilterBarSelect, FilterBarClear, FilterBarCount, useFilteredRows} from '@/components/monte/ui/filter-bar'`
- [Tree](components/monte/ui/tree.tsx): Browses a hierarchy and picks from it. `import {Tree, TreeItem, TreeItemLabel, TreeItemIndicator, TreeItemCheckbox, TreeGroup, treeVariants, createTreeController, treeFromPaths, visibleTreeRows} from '@/components/monte/ui/tree'`

### Code
- [Code block](components/monte/ui/code-block.tsx): Shows code or commands to copy. `import {CodeBlock, TokenLine, WrapToggle, tokenize, parseLines, commandLines, maskSecret, gutterStyle, maxLinesStyle, matchClass, currentMatchClass, languageLabels} from '@/components/monte/ui/code-block'`
- [Code window](components/monte/ui/code-window.tsx): Shows a file as a numbered window, with the line that failed. `import {CodeWindow} from '@/components/monte/ui/code-window'`
- [JSON view](components/monte/ui/json-view.tsx): Shows structured data as a foldable tree. `import {JsonView, pathOf} from '@/components/monte/ui/json-view'`
- [Log viewer](components/monte/ui/log-viewer.tsx): Shows a job's output lines as they stream. `import {LogViewer} from '@/components/monte/ui/log-viewer'`

### Charts
- [Chart](components/monte/ui/chart.tsx): Shows numbers over time as a line or an area. `import {Chart, ChartFrame, ChartPlot, LineChart, ChartContainer, WithChart, useChart, useOptionalChart, useElementWidth, useElementDirection, useRovingPoints, useDrawn, seriesTone, ChartSwatch, ChartTooltip, ChartTooltipContent, ChartTooltipRow, ChartDataTable, ChartLegend, niceScale, tickCount, formatCompact, formatExact, unitFormat, numberAt, linearPath, stepPath, wipeStyle, drawStyle} from '@/components/monte/ui/chart'
import {toneClass, toneFill, toneArea} from '@/components/monte/ui/chart-parts'
import {EMPTY_VALUE, CHART_EMPTY} from '@/components/monte/ui/chart-scale'`
- [Stem chart](components/monte/ui/stem-chart.tsx): Prints one value per period on a square-headed stem. `import {StemChart} from '@/components/monte/ui/stem-chart'`
- [Swimlanes](components/monte/ui/swimlanes.tsx): Shows the steps of a flow across the systems they run in. `import {Swimlanes, stepVariants} from '@/components/monte/ui/swimlanes'`
- [Bar blocks](components/monte/ui/bar-blocks.tsx): Splits one total into its parts as blocks as wide as their share. `import {BarBlocks, blockVariants} from '@/components/monte/ui/bar-blocks'`

### Runs and agents
- [Tool-call row](components/monte/ai/tool-call-row.tsx): Draws a run's steps as ruled boxes, joined by connectors. `import {ToolCallStack, ToolCallRow, formatElapsed, stepWords} from '@/components/monte/ai/tool-call-row'`
- Tool call (not installed in this project): Shows one tool an agent called in a run.
- Activity (not installed in this project): Says what a run is doing now.
- Prompt input (not installed in this project): Takes the next instruction for an agent.
- Message (not installed in this project): Shows one turn of a run's thread.
- Response (not installed in this project): Renders an agent's answer as it streams.

## Blocks
Whole screens built only from the components above. Installed ones live in components/monte/blocks.
- Job runs: Every pipeline's runs as one table: a Status word per row, IDs and numbers in mono and Run now. `components/monte/blocks/job-runs.tsx` `import {JobRuns} from '@/components/monte/blocks/job-runs'`
- Failed load: A load that failed: the alert with Retry load, the model with its failing line banded, and the step's log. Not installed in this project.
- On call: A failed job at phone width: its header, the failure in a sentence, its facts in a 2x2 grid, Acknowledge and Retry step. Not installed in this project.
- Run progress: A backfill followed at phone width: the live step, partitions done, the run's numbers as a strip and its steps. Not installed in this project.
- Warehouse capacity: How full a warehouse is: credits, storage and concurrency as meters, storage by schema, queries by hour and Resize warehouse. Not installed in this project.
- Sync flow: A nightly sync across the systems it touches as swimlanes, the rows it loaded by source, and Run sync. Not installed in this project.
- Pipeline history: A pipeline's page under its path: runs per day, its latest partitions and its schedule as numbered tabs. Not installed in this project.

## Foundations
- [Color](components/monte/tokens.css): White and cool near-black, rules for structure, and one azure that changes how it shows by theme: a solid slab in light, a tint with an azure line in dark.
- [Typography](components/monte/tokens.css): Mono capitals for the interface, Geist for headlines and prose, one weight.
- [Space](components/monte/tokens.css): A 4px grid, 32px controls and 40px rows.
- [Radius](components/monte/tokens.css): Zero, everywhere.
- [Borders and lines](components/monte/styles.css): Rules divide content; a frame is a region's one outer edge.
- [Elevation](components/monte/tokens.css): No shadows: an overlay is the panel with a rule edge, set apart by its fill and, for a dialog, the scrim.
- [Motion](components/monte/tokens.css): Typing, scrambles, wipes and connectors that draw; ease-out, no springs.
- [Iconography](components/monte/icon.tsx): Lucide at 16px, squared off to match square corners.
- [Anti-slop](#anti-slop): The habits of generated UI to avoid, and what to do instead.

## Add a component

A new component goes in `components/monte/ui` (or `components/monte/ai` for runs and agents). Build it from the tokens in `components/monte/tokens.css` and the recipes in `components/monte/styles.css`, and give it a header comment stating its props, variants and rules, the way the existing ones do. Then add its line to the index above. Why: agents find components through the index and learn them from the header comment, so a component missing either one is invisible.
