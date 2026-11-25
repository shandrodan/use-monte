# Parity

In one migration, dozens of behaviour regressions passed typecheck, lint, unit tests and the system's check. A verifier driving a real browser caught them, and many first verdicts came back with issues. Each class below is a table: run the same inputs through the old control and the new one, and fix every differing row or have a person approve it.

`parity.mjs number|date --old <module or json> --new <module or json>` runs the first two classes. A results file needs a result for every input, and for dates every time zone, on both sides, or the row fails. Fill the other classes by driving the app, by hand or with the host's browser tool.

## Classes

**Numbers.** Type and paste each of these 19 into the control: `2.5`, `-3`, `1e3`, `12.50`, `0.123456789`, `1,234.56`, `  42 `, empty, `abc`, `12abc`, `007`, `-0`, a 20-digit number, `1.2.3`, `.5`, `5.`, `+3`, a Unicode minus, `1 000`. Compare what the box shows, what the control commits, and whether submit is enabled.
- Wrong: an integer field commits 25 for `2.5`, 3 for `-3`, 13 for `1e3`, and sends `12.50` as `12.5`. A box holding `abc` submits the last good value.
- Right: the same answers as before, or a rejected row a person approved, and submit refused while the text does not parse.

**Dates.** Run every date surface under `TZ=America/Los_Angeles` and `TZ=Asia/Tokyo` at least, and compare the payload, not the label. If legacy already differs between zones, report it and fix it only as an `intended change` row.
- Wrong: `2025-03-15` comes back as `03/14/2025` west of UTC.
- Right: the same calendar day in every zone.

**Uploads.** Test an extension only, a MIME type only, an upper-case extension, a wrong MIME type and a rejected type.
- Wrong: `accept` checks the extension, so a file with the right MIME type and no extension is refused.

**Enter and Space on open.** For a picker that writes on select, press Enter and then Space right after it opens, at 0 and at 300 ms. Expect no write.
- Wrong: the first enabled option fires a write.

**Accessible names.** Diff the accessibility tree before and after: names, roles, headings, `aria-current`. A shortened visible label keeps its full accessible name.
- Wrong: size buttons announced as "S", "M", "L".

**Focus.** For each dialog, read `document.activeElement` after Escape, after Cancel, after a confirm that succeeds, after one that fails, and when the opener disappears. Record the old values first.
- Wrong: a confirmed row delete leaves focus on `body`.

**Refetch errors.** Make the next fetch of a loaded record return 500, then dispatch focus events on `window`. The page keeps its data.
- Wrong: a background refetch replaces a loaded record with an error page.

**Filters.** Assert the stored value for every filter operator, not the chip that displays it.
- Wrong: "is" stores the complement.

**Widths inside the scroller.** Measure row controls and headers inside the scroll container at 390, 768, 1280 and 1920. A control reachable before stays reachable.
- Wrong: no row control in view while a script measuring the window passed.

**Fixtures.** Use a title longer than 100 characters, a long file name and more rows than fit at 1920. Why: short fixtures hid truncation and unreachable pages on several surfaces.

## Reading the table

The columns are case, old result, new result, expectation and verdict. An expectation is `same`, `rejected`, `intended change` or `preexisting`. An `intended change` row whose result did not change fails, so a fix that quietly never landed is caught. The table exits 0 only when every row meets its expectation, which makes it something a person can approve.

## Without a browser

Run the pure functions through `parity.mjs`, and state in the verdict that the control itself is `blocked`. A write surface is never `verified` this way.
