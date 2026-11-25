# Mapping rules

Swap the categories, tolerances and threshold for your team's before the first real run. The skill treats whatever this file says as agreed.

## Rows that get no mapping

These are counted in the Summary and get no row:
- A role token with alpha applied: `color-mix()` over its `var()`, or a utility's alpha modifier.
- Values in the `graphic` category: logo art, illustrations, decorative gradient stops.

## Lists without purposes

```
Does the token list state a purpose for its tokens?
├── Yes → classify by purpose, then value
└── No → match on value only
    ├── every reason starts with "Value only"
    ├── Do not use stays empty, because it cannot be checked
    └── add a Consistency by role section
        └── A palette-only list (gray-500, no roles) makes nearly every palette row Exact by definition,
            so Consistency by role becomes the main output and the table keeps only rows that are not Exact
```

## Categories

A candidate token must sit in the same category as the row's job.

- Colour, by role: surface, text, border, icon, action, focus, status.
- Spacing, by job: inset (inside a component) or gap (between items). One scale often serves both, so record which job the row does.
- Size, radius, border width, typography (family, size, weight, line height, letter spacing), shadow (one row per part), opacity, motion (duration, easing), z-index.

When a row's job can't be read: Ambiguous if the jobs it might do give two or more candidates, otherwise a Gap marked `job unread`.

## Normalising

- Lengths to px, with a 16 px root for `rem` unless the project sets another. Line height to a unitless ratio.
- Colours to OKLCH plus alpha with `quarry/scripts/oklch.mjs`. It reads hex (3, 4, 6 and 8 digits), `rgb()`, `hsl()`, `hwb()`, `oklch()`, `oklab()` and CSS named colours, with alpha. It does not read `color()`, `lab()`, `lch()`, `color-mix()` or relative colours: resolve those through a browser's computed style and say so under Source.
- Compare colours by delta E OK (OKLab distance × 100) with `oklch.mjs --delta`. Under 0.5 is identical, which absorbs 8-bit rounding.
- Alpha is part of the colour. `#0F172A` at 80% is not `#0F172A`. `--delta` prints both alphas and says `alpha differs` past the opacity tolerance, and such a pair is never Exact.

## Tolerances

Apply these only after the purpose fits. A tolerance never turns a wrong-purpose token into a match. A difference equal to the limit counts as inside.

| Category | Limit |
|---|---|
| Colour | delta E OK 2 |
| Spacing, size, radius | 2 px |
| Font size | 1 px |
| Line height | 0.05 as a ratio |
| Letter spacing | 0.01 em |
| Opacity | 0.02 |
| Duration | 30 ms |
| Border width, weight, family, easing | none |

## Consistency by role

Written when the list states no purposes, or when the ask is about consistency. Group every colour row by role. For each role give the distinct values with counts, their spread in delta E OK, and the near pairs (under 5) that probably mean one thing:

```
Text: 6 values over 200 rows. gray-500 (80), gray-600 (60), #666 (10) sit within delta E OK 4 and likely mean one muted text.
```

## Conflicting sources

Two sources that disagree on a value go under Source with both sides. A project rule that settles it is quoted. Otherwise neither side is chosen and the question goes to For a person to decide.
