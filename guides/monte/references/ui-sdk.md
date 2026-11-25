# ui-sdk components in Monte

Six Monte components run on ui-sdk (`@ui-sdk/react`) instead of Base UI: Tree, Toolbar, Menubar, Listbox, NumberInput, Resizable. Their look comes from `components/monte/ui-sdk.css`, which draws ui-sdk's `data-slot` parts in Monte tokens. `@ui-sdk/core/web.css` is not loaded and must not be: about 75 of its slot names are also Monte's own (`button`, `field`, `select-trigger`), so it restyles Monte's Base UI components with rounded, shadowed defaults.

## Which engine to reach for

Monte never ships two components for one job, so the job picks the engine. An agent never imports `@ui-sdk/react/*` or `@base-ui/react/*` in screen code: always the Monte wrapper in `components/monte/ui`.

```
Does Monte's index list a Base UI component for this job (Select, DropdownMenu, Dialog, Tabs, Input ...)?
 ├── Yes → use it. Never the ui-sdk part of the same name: ui-sdk.css does not style it.
 └── No
      ├── Is it one of Tree, Toolbar, Menubar, Listbox, NumberInput, Resizable? → use that wrapper.
      └── Otherwise → stop and say the component is missing. Do not drop in a raw ui-sdk part.
```

Why: only the six wrappers have a Monte skin. A raw `@ui-sdk/react/date-picker` inside `.monte` renders unstyled.

Agents: only these six are visible to the agent bridge (`lib/monte/agent.ts`). A control an agent must set or press on its own has to be one of them; Monte's Base UI controls are invisible to `snapshot()`.

## Tree

Use for a hierarchy a person browses and picks from: schemas and tables, folders, pages. A JSON value is `JsonView`. A flat list with no levels is `Listbox`.

Variants: `size` = `default`, `sm`. Nothing else exists. `default` (32px rows) is the default; `sm` (26px) is for a side panel or a resizable pane.

```tsx
// Correct (the showcase, ui-sdk-section.tsx)
<Tree aria-label="Warehouse" value={table} onValueChange={value => setTable(value)} defaultExpanded={['analytics']} size="sm">

// Incorrect: no name, so an agent and a screen reader cannot find it; state kept in a click handler an agent never fires
<Tree size="compact" onClick={e => setTable(e.target.textContent)}>
```

## Toolbar

Use for the tools that act on the view next to it (wrap, copy, download), as one tab stop with arrow keys.

```
Are the buttons two to five views of one thing (Table / JSON)?
 ├── Yes → SegmentedControl
 └── No
      ├── Are they tools for the adjacent view, often icon-only? → Toolbar
      └── Default: related actions, each its own tab stop → ButtonGroup
```

Variants: Toolbar `size` = `sm` (26px, the default), `default` (32px). ToolbarButton `variant` = `ghost` (the default), `secondary`. Nothing else exists: no primary slab in a toolbar, because the frame footer holds the one primary.

```tsx
// Correct (the showcase, ui-sdk-section.tsx)
<Toolbar aria-label="Results" className="ms-auto -me-1.5">
  <ToolbarToggle aria-label="Wrap lines"><Icon icon={TextWrap}/></ToolbarToggle>

// Incorrect: a Monte Button inside the bar adds a second tab stop the arrow keys skip, and a slab
<Toolbar aria-label="Results"><Button>Download</Button></Toolbar>
```

## Menubar

Use for an application's several menus (File, Edit, View) in one row. A list of actions on one thing is `DropdownMenu`.

Variants: MenubarContent `size` = `default` (32px rows, the default), `sm` (26px). Nothing else exists. `MenubarContent` opens into `MontePortalProvider`'s container itself; never pass it another `container`.

```tsx
// Correct: a destructive item carries destructive and the sentence a person approves
<MenubarItem value="Delete query" destructive data-agent-confirm="Deletes the saved query weekly_revenue.sql">Delete query</MenubarItem>

// Incorrect: run through onClick, which an agent never fires, and nothing asks the person first
<MenubarItem onClick={deleteQuery}>Delete query</MenubarItem>
```

Run items through the menu's `onAction(value)`.

## Listbox

Use for a list that stays open on the page: a region to run in, columns to export.

```
Does the choice need to stay visible on the page?
 ├── No
 │    ├── Typing to find it among many? → Combobox
 │    └── Default: one of many in a popup → Select
 └── Yes
      ├── Two to five choices, one picked? → RadioGroup
      └── Default: a longer list, or several picked → Listbox
```

Variants: `edge` = `framed` (the default, its own 1px edge), `bare` (fills a frame body, so the frame edge is the only one). `size` = `default`, `sm`. Nothing else exists. Past 8 rows, give it `max-h-*`; it scrolls inside its edge.

```tsx
// Correct (the showcase, ui-sdk-section.tsx)
<Listbox aria-labelledby={regionLabel} defaultValue="eu-west-1" onValueChange={value => onLog(`Region: ${value}`)} className="max-h-48">

// Incorrect: a framed listbox inside a frame body draws a box in a box
<div className="frame"><Listbox aria-label="Regions" className="frame">
```

## NumberInput

Use when the exact number matters and a person may type it: replicas, a row limit, a budget. Free text is `Input`; a value dragged on a track is `Slider`.

Variants: `size` = `sm` (26px), `default` (32px, the default), `lg` (36px), the heights of Input. Nothing else exists. Save in `onValueCommit`, not `onValueChange`, which fires on every step.

```tsx
// Correct (the showcase, ui-sdk-section.tsx)
<NumberInput aria-labelledby={limitLabel} defaultValue={1000} min={100} max={100000} step={100} onValueCommit={value => onLog(`Row limit: ${value}`)}/>

// Incorrect: a text Input with type="number" has no locale format, no clamping, and no stepper an agent can drive
<Input type="number" defaultValue={1000}/>
```

## Resizable

Use for panes a person resizes: a schema tree beside a query. Panes of fixed size are a flex row with `rule-col`.

Variants: none. The handle is the frame's own 1px rule. Name every handle for what it resizes.

```tsx
// Correct (the showcase, ui-sdk-section.tsx): inside the Specimen frame, no second edge
<Resizable className="h-96">
  <ResizablePanel id="schema" defaultSize={32} minSize="180px" collapsible>
  <ResizableHandle aria-label="Resize schema"/>

// Incorrect: no height (it collapses to nothing), a rule-col that doubles the handle's rule, an unnamed handle
<Resizable><ResizablePanel className="rule-col"/><ResizableHandle/></Resizable>
```

## Agent rules for all six

- Name every one: `aria-label`, or `aria-labelledby` to a visible label. Labels must differ on the page: a step finds its target by label, and "Region" also matches "Region filter".
- Keep state in `on<Key>Change`/`onAction`. An agent's change runs no click or key handler; `details.source === 'agent'` tells it apart and `details.cancel()` refuses it.
- Put `data-agent-confirm="<what it does, from app state>"` on anything that deletes, pays or sends. Without an approver set by `setAgentApprover`, the bridge refuses that step.
- Create the bridge with `monteAgent()` from `lib/monte/agent.ts` in client code only, in an effect or a handler. `useWebMcpTools()` hands the same tools to a WebMCP browser agent.
