# AM Components

Specs from the Storybook guideline pages. Each section gives the visual spec (for standalone mockups) and the repo classes/components (for repo code).

## Cards / containers

- `border: 1px solid #D9D9D9; border-radius: 12px; background: #FFFFFF; padding: 16px;`
- Page content max-width ≈ 1080–1200px.
- Repo: `CardContainer` from `@/components/ui/card/CardContainer` — props seen in Storybook: `title`, `size="full"`, `variant="inline"`.

## Buttons

Repo uses shared HTML button classes — reuse these, never invent new button styles:

| Class | Role | Typical label |
|---|---|---|
| `btn` | Primary action (green) | "Speichern" |
| `btn btn-info` | Informational primary (blue) | "Weiter" |
| `btn-outline` | Secondary/cancel (green outline) | "Abbrechen" |
| `btn-outline-info` | Secondary informational (blue outline) | "Details ansehen" |

Sizes: `btn-small`, `btn-medium-small`, `btn-medium`, `btn-lg`. States/helpers: `disabled` attribute for deactivated, `mobile-button`, `full-width-button`.

**Button groups**: paired back/confirm actions use `<div class="button-group">` — outline button left ("Zurück"), filled button right ("Speichern"). Right-aligned variant: `button-group end` (e.g. `btn-outline-info` "Sekundär" + `btn-info` "Bestätigen").

Standalone visual spec (matches the app look): font Roboto 14px/500–700, padding ~8px 20px, border-radius ~6px, white text on `#98C44C` (primary) or `#4C8BA5` (info); outline variants: transparent bg, 1px border + text in the variant color. Hover: darken (`#77993C` / `#3E7287`). Disabled: ~50% opacity, no pointer.

MUI is also themed: `<Button variant="contained" color="primary">` (blue) and `color="secondary"` (green) align with the app theme.

## Chips / badges

Canonical guideline: **reuse these chip states instead of ad hoc `sx` styling or custom chip class combinations.**

**Priority chips** (lead priority): pill with a small numbered badge + label.
- Hoch (high) → **error/red** styling (`#E74C3C` tones)
- Mittel (medium) → **warning/orange** styling (`#FFA600` tones)
- Niedrig (low) → **blue informational** styling (`#4C8BA5` tones)

Standalone spec: pill `border-radius: 999px; padding: 4px 12px; font-size: 13px; font-weight: 700;` soft tinted background (e.g. `rgba(231,76,60,0.08)` for high) with text/badge in the strong color. Repo: `priority-chip-guideline high|medium|low` classes + `Badge` from `@/components/ui/chip` (`value`, `variant="high|medium|low"`).

**Filter tooltip chips**: circular count chips for totals (`filter-category__count-badge`, green variant `--green` for positive counts) and outlined chips for selected filter labels (`filter-category__filter-chip`, e.g. "Hausbesuch"). Repo uses MUI `Chip` with these classes.

## Toast messages

5 variants. Shape: flex row, icon left, bold title + message text, close (×) top-right, **4px progress bar along the bottom** in the variant color. Box: `min-width 280px; max-width 420px; padding 14px; border-radius 10px; border 1px solid; box-shadow 0 6px 18px rgba(0,0,0,0.08)`. Text color always `#2B2B2B`.

| Variant | Background | Border | Icon color | Icon (FontAwesome) | Example title / message |
|---|---|---|---|---|---|
| success | `#EAF3DB` | `#98C44C` | `#77993C` | faCircleCheck | "Erfolgreich gespeichert" / "Änderungen wurden erfolgreich gespeichert." |
| error | `rgba(231,76,60,0.08)` | `rgba(231,76,60,0.2)` | `#E74C3C` | faCircleExclamation | "Fehler" / "Fehler beim Speichern." |
| warning | `rgba(255,166,0,0.05)` | `rgba(255,166,0,0.2)` | `#DFA54E` | faTriangleExclamation | "Warnung" / "Einige Dateien konnten nicht hochgeladen werden." |
| info | `#F0F8FF` | `#C2D0D8` | `#4C8BA5` | faCircleInfo | "Hinweis" / "Diese Änderungen werden erst nach dem Speichern übernommen." |
| notification | `#F0F8FF` | `#C2D0D8` | `#4C8BA5` | message icon | "Neue Anfrage erhalten" / "Eine neue Anfrage ist eingegangen und wartet auf Ihre Bearbeitung." |

Progress bar color = border/icon strong color (`#98C44C`, `#E74C3C`, `#DFA54E`, `#4C8BA5`).

## Forms

Layout: a **6-column grid** (`gap: 16px`): full-width field = span all 6, half = span 3, third = span 2. Below 900px viewport, everything collapses to a single column.

Field anatomy:
- **Label**: bold (`14px/700 #2B2B2B`), placed above the field (repo class: `bolder d-block`), with trailing colon ("Titel:").
- **Input**: 1px `#D9D9D9` border, radius ~6px, padding ~8–10px, 14px text. Placeholder like "Titel eingeben", "Bitte auswählen".
- **Filled/valid**: soft green treatment — background `#EAF3DB` and/or green border `#98C44C`.
- **Error**: red border (`#E74C3C`) + error message below in red 14px (repo class `error-message`, textarea error class `input-text-area--error`). Example: "Mindestens 10 Zeichen eingeben."
- **Helper text**: 13px `#707070` below the field.

Repo building blocks (all wired through react-hook-form `Controller`):
- `EditableInput` (`@/components/ui/inputs/EditableInput`) — props: `value`, `fieldName`, `placeholder`, `error`, `onChange`
- `CustomTextArea` (`@/components/ui/inputs/CustomTextArea`) — `value`, `rows`, `placeholder`, `className`, `onChange`
- `ListByGroupDropdown` (`@/components/ui/dropdown/ListByGroupDropdown`) — grouped select; `groups` ([{header, options:[{id,label}]}]), `optionsFlat`, `keineVorlagePlaceholder`, className `group-by-select input-dropdown`
- `MultiSelectDropdown` (`@/components/ui/dropdown/MultiSelectDropdown`) — `options`, `selectedValues`, `onChange`, `getLabel`, `placeholder`
- `AdditionalSingleFieldList` (`@/components/ui/inputs/AdditionalSingleFieldList`)
- MUI `RadioGroup`/`Radio`/`Checkbox` with `FormControlLabel` for radios and checkboxes ("E-Mail" / "Telefon" / "Portal", "Newsletter erhalten", "Datenschutz bestätigt")

## Example screen vocabulary

Realistic AM domain content for demos: Anfragen (leads), Klienten, Pflegeheime ("Pflegeheim Berlin/Hamburg/Köln"), Vorlagen (templates, grouped "Standard"/"Spezial"), Hausbesuch, Rückruf, lead status "Gewonnen", booking hints ("Hinweis: Änderungen an Ihrer Buchung werden nicht gespeichert").
