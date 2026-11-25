# Tokens

These defaults suit a hand-rolled app. When the repo already has a token source other tools read, keep its format, apply these rules inside it, and record the departure. Never rename a foundation's own token names. Why: every tool and doc that reads them breaks.

## Layers

| Layer | Holds | Read by |
|---|---|---|
| Primitive | Raw values under palette names: `gray.900`, `space.4` | Semantic tokens only |
| Semantic | Roles: `color.text.subtle`, `color.surface.raised`, `space.inset.md` | Components and product code |
| Component | A value one component themes apart from its role | That component only |

- Product code reads semantic tokens only. A semantic token aliases a primitive, never a raw value.
- Start with zero component tokens. Delete any component token that only aliases a semantic one.
- A theme changes which primitive each semantic token points at. Every semantic token resolves in every theme.
- A theme the app ships on any route counts as shipped, even half built. Each value it lacks is a gate whose default is the nearest existing role.

## Naming

```
Is the name about what the value is for?
├── No (color.red, gray-light) → rename it by purpose: color.text.danger
└── Yes → order the parts: category, role, variant, state
```

- Pair every surface with its foreground (`surface.inverse` with `text.inverse`) and check contrast on that pair.
- One word per idea across categories. If `subtle` means lower emphasis in text, it means the same in borders, and neither `muted` nor `secondary` also appears.
- Keep a name the app already uses, even one you would not choose. Split a token only when the inventory shows it doing two jobs.
- A role that starts with its property's word doubles in the class (`text-text-muted`). The check's `rule/doubled-utility` flags it.
- A brand or product word in a semantic name is a gate.

## Never a token

`0`, `100%`, `auto`, `currentColor`. A value used once in one layout. Values the content sets (an aspect ratio, chart colours from a scale). A third-party widget's internals. Logo and illustration art. Arithmetic between tokens (`calc(var(--space-inset-md) * 2)`). A value inside tolerance of an existing token maps to that token instead.

## Tolerances

Apply these only after the purpose fits. Plumbline uses the same table, so the merge decisions and its report agree.

| Category | Limit |
|---|---|
| Colour | delta E OK 2 (under 0.5 counts as exact) |
| Spacing, size, radius | 2 px |
| Font size | 1 px |
| Line height | 0.05 as a ratio |
| Opacity | 0.02 |
| Duration | 30 ms |
| Border width, weight, family, easing | none: each value is a choice |

A merge inside tolerance is a decision. A merge past it is a gate whose default is the merge, naming the largest shift and the surfaces it touches.

## Generating

Use the repo's generator, or a short script. The output is sorted, its first line says it is generated and by which command, and a second run leaves no diff. Errors name the token path and the valid options.

A brand colour given as hex keeps its exact value. Convert it to another format with code, never by eye, and keep the hex in the token's description.

Never reset a styling framework's whole palette to stop palette classes. Why: stock components read black, white and transparent from it. `rule/palette-use` catches palette classes instead.

## Motion

Name the presets before the first component, one per job: `instant` (press), `micro` (hover), `enter`, `exit`, `overlay`, `sheet`, `collapse`, `loader`, `follow` (drag). Each has a duration, an easing, the properties it animates and its reduced-motion form.

- High-frequency surfaces (navigation, list rows, primary actions, menus) get `instant`, or motion on first open only. Why: motion a person sees 50 times a day turns into lag.
- Enters ease out, exits are shorter than enters, nothing enters from `scale(0)`, and only progress and loops are linear.
- Animate `transform` and `opacity` only.
- Fix a motion finding with the first of these that clears it: delete the animation; shorten or shrink it; fix its curve or origin; make it interruptible; move it to `transform` and `opacity`.
- When the app has no motion for a job, the gate default is `instant`.
