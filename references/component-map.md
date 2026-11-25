# Legacy to Monte

Map each legacy component by its job, not its name. Read the Monte file's header comment before the swap: it holds the props and that component's rules. All paths are under `@/components/monte/`.

| Legacy (shadcn, Radix, MUI, Chakra, Mantine, hand-rolled) | Monte |
|---|---|
| Button, IconButton, LoadingButton | `ui/button` |
| ButtonGroup, ToggleGroup | `ui/button-group`, or `ui/segmented-control` when one value is chosen |
| Input, TextField | `ui/input` inside `ui/field` |
| Textarea | `ui/textarea` inside `ui/field` |
| Label, FormItem, FormMessage, HelperText | `ui/field` |
| Select, NativeSelect | `ui/select` |
| Combobox, Autocomplete | `ui/combobox` |
| Checkbox | `ui/checkbox` |
| RadioGroup | `ui/radio-group` |
| Switch, Toggle | `ui/switch` |
| Slider | `ui/slider` |
| Badge, Chip, Tag | `ui/tag`; a run or health state is `ui/status` |
| Avatar | `ui/avatar` |
| Card, Paper, Panel, Box with a border | `ui/frame`, parts divided by `rule-row` / `rule-col`, never a card in a card |
| Separator, Divider | the `rule-row` / `rule-col` recipe |
| Alert, Callout, Banner | `ui/alert` |
| Toast, Sonner, Snackbar | `ui/toast` |
| Progress, LinearProgress | `ui/progress`; a quota or capacity is `ui/meter` |
| Skeleton | `ui/skeleton` |
| Spinner, CircularProgress | `ui/running-mark` |
| Empty, NoData | `ui/empty-state` |
| Dialog, Modal, AlertDialog | `ui/dialog` |
| Sheet, Drawer, SidePanel | `ui/sheet` |
| Popover, HoverCard | `ui/popover` |
| Tooltip | `ui/tooltip` |
| DropdownMenu, Menu, ContextMenu | `ui/dropdown-menu` |
| Command, CommandPalette, Spotlight | `ui/command` |
| Tabs | `ui/tabs`; numbered steps of one page are `ui/numbered-tabs` |
| Breadcrumb | `ui/breadcrumb` |
| Pagination | `ui/pagination` |
| Accordion, Collapsible, Disclosure | `ui/collapsible` |
| Table, DataTable, DataGrid | `ui/table`; a filter row above it is `ui/filter-bar` |
| DescriptionList, KeyValue | `ui/data-list` |
| List item with icon and meta | `ui/item` |
| Kbd | `ui/kbd` |
| Code, Pre, syntax block | `ui/code-block`; a file window is `ui/code-window`; JSON is `ui/json-view`; logs are `ui/log-viewer` |
| Copy-to-clipboard button | `ui/copy-button` |
| Chart (Recharts, Chart.js, Nivo) | `ui/chart` with `ui/chart-parts`; small multiples `ui/stem-chart`, `ui/bar-blocks`; timelines `ui/swimlanes` |
| Stat cards, KPI row | `ui/status-strip` |
| Any icon import (lucide, heroicons, react-icons, MUI icons) | `icon` (`<Icon icon={Name}/>`); a missing glyph is added to `icon.tsx` first |
| Toolbar, a row of icon buttons over an editor or canvas | `ui/toolbar` |
| Menubar | `ui/menubar`; one menu on one thing stays `ui/dropdown-menu` |
| Resizable, ResizablePanelGroup, SplitPane | `ui/resizable` |
| TreeView, Tree, nested nav or file tree | `ui/tree`; JSON stays `ui/json-view` |
| Listbox, selectable List (always open) | `ui/listbox`; a closed picker stays `ui/select` or `ui/combobox` |
| NumberInput, NumberField | `ui/number-input` inside `ui/field`; a bounded range stays `ui/slider` |
| ThemeProvider, `.dark` class, `dark:` variants | `data-theme="dark"` on `<html>` or the `.monte` element; delete every `dark:` class |

## No row matches

Never build a look-alike from raw Tailwind. Walk this:

```
Is it layout only (stack, grid, spacer, container)?
├── Yes → plain elements with Monte spacing tokens. Not a gap.
└── No
    Does a Monte component do the same job with a different name?
    ├── Yes → use it, and add the row to this file in the report
    └── No → keep the legacy component, add it to legacy.json's allowlist with
             the reason "no Monte equivalent", and list it in the report's gap table.
```

Why: an invented component carries none of Monte's focus, state and contrast rules, and it hides the gap from whoever owns the system. A listed gap gets built once, in `components/monte/ui`, by the `monte` skill's "Add a component" steps.
