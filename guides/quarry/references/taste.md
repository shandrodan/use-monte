# Taste

Default answers to "what should the UI look and read like?". This is a starting point the person accepts, edits or replaces, not a rule. Keep the headings if you replace it. The run saves the accepted copy to `.design-system/taste.md`, and every skill reads that copy only.

## Bans

Offer the list once at the start with nothing ticked. Each ban the person ticks becomes a check rule and holds in code, copy, docs, examples and showcases. The one exception is a `Don't:` line showing the thing to avoid.

- Uppercase labels
- A middle dot or bullet between items
- Em dashes, in product copy and in docs
- Exclamation marks
- Emoji
- Gradients

## Voice

For copy the run writes: empty states, toasts, docs.

- Take the voice from the app's existing strings. Add nothing here unless the person fills it in.
- Sentence case for headings, labels and menu items.
- Plain verbs, the product's own nouns, straight quotes.

## Widths and themes

- Capture at the app's own narrowest and widest widths. When the app states none, use 390 and 1280 px.
- Use only the themes the app ships. Never add a theme.

## A reference for structure

- For a docs site, take the shape of a mature public system's docs (an introduction, foundation pages, one page per component), and never its values, names or brand.
- A component page runs: description, examples, variants, states, props, usage, accessibility, tokens, related.
- To find roles the app has not named yet, compare its colour roles with that system's surface levels, text emphasis steps and control heights. Never copy one of its values.

## Project rules

No rule pack ships here. `check-system.mjs` holds the generic rules: raw values, palette classes, arbitrary values, native controls, clickable divs. A project adds its own rules as lint rules or config, and a rule counts only after it has been seen failing on a planted violation.
