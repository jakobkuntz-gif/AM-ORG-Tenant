---
name: am-design-prototypes
description: Build UI prototypes and mockups that follow the Anfragen-Manager (AM) design system by Verbund Pflegehilfe — the design guidelines from the AM Storybook. Use this skill whenever the user asks for a prototype, mockup, demo, wireframe, screen design, UI sketch, or frontend code for AM or any Anfragen-Manager feature, even if they don't mention "design system" or "Storybook". Also use it when the user asks to visualize a feature idea or product ticket as UI, or asks for React/HTML code for the AM app. It contains the official colors, typography, button styles, chips, toasts, form patterns, and icons.
---

# AM Design Prototypes

Build prototypes that look like they were lifted straight out of the Anfragen-Manager app. AM is a German-language lead-management product (Verbund Pflegehilfe), so prototypes are stakeholder-facing and must feel like the real product — same colors, same type, same component shapes, German UI copy.

## Two modes — pick one first

1. **Standalone mockup (default)** — a self-contained HTML or React artifact for stakeholder demos. No AM repo imports. Recreate the look using the exact token values below and the ready-made stylesheet in `assets/am-prototype.css`. Choose this unless the user clearly wants repo code.
2. **Repo code** — real code for the AM repo (`PH.AnfragenManager.Web.UI`): React + TypeScript, SCSS classes, MUI, react-hook-form. Use the existing shared classes and components (see `references/components.md`) instead of inventing styles. Choose this when the user says the code should go into the app/repo, mentions file paths, or asks for a component to implement.

If it's ambiguous, build the standalone mockup — it's the safer default for demos — and mention that repo-ready code is possible too.

## Core tokens (memorize these — they define the AM look)

**Colors** (full palette + usage rules: `references/colors.md`)

| Token | Hex | Use for |
|---|---|---|
| Text Primary | `#2B2B2B` | body text, headings, table values |
| Text Secondary | `#707070` | helper text, descriptions, metadata |
| Border | `#D9D9D9` | card/input/table borders, dividers |
| Surface | `#F8F8F8` | page background |
| White | `#FFFFFF` | cards, modals, content containers |
| Primary Blue | `#4C8BA5` | links, interactive controls, headers, info |
| Dark Blue | `#3E7287` | hover/darker blue |
| Light Blue | `#D7E7F0` / `#F0F8FF` | blue surfaces, info backgrounds |
| Green | `#98C44C` | success, positive values, valid fields |
| Dark Green | `#77993C` | success icons, darker green |
| Soft Green Surface | `#EAF3DB` | filled/valid form fields, success toast bg |
| Orange | `#FFA600` | warnings, attention (non-destructive) |
| Red | `#E74C3C` | errors, destructive actions, invalid fields |

The product's core brand colors are **blue and green**. White keeps layouts clean, blue guides interaction, green communicates positive states. Don't introduce colors outside this palette.

**Typography** (full patterns: `references/typography.md`)

Font: **Roboto** (weights 400/500/700). Sizes only from the scale: **12, 13, 14, 16, 20, 24 px**.
- Page header: 24px / 700 / `#4C8BA5` (blue, not black!)
- Section header: 20px / 700 / `#4C8BA5`
- Body: 14px / 400 / `#2B2B2B`
- Form label: 14px / 700 / `#2B2B2B`
- Helper: 13px / 400 / `#707070`
- Error text: 14px / `#E74C3C` · Success text: 14px / 700 / `#98C44C` · Info text: 14px / `#4C8BA5`

**Shape**: cards/containers use `border: 1px solid #D9D9D9; border-radius: 12px; background: #FFFFFF; padding: 16px`. Toasts use radius 10px, inputs ~6px.

## Component recipes

Read `references/components.md` before building anything with buttons, chips, toasts, forms, or cards — it has the exact specs and the repo class names. Quick orientation:

- **Buttons**: primary green (`btn`, "Speichern"), info blue (`btn-info`, "Weiter"), outline variants for secondary/cancel. Paired actions sit in a `button-group` — outline button left, filled button right.
- **Priority chips**: Hoch = red, Mittel = orange, Niedrig = blue.
- **Toasts**: 5 variants (success/error/warning/info/notification) with exact bg/border/icon colors and a progress bar at the bottom.
- **Forms**: bold label above the field, 6-column grid (half = span 3, third = span 2), filled fields get a soft green treatment, errors get red border + red message below.
- **Icons**: `references/icons.md`. In standalone mockups, use FontAwesome (CDN or inline SVG); the app itself mixes FontAwesome, Fontello classes, app SVGs.

## German UI copy

Write all visible UI text in German with proper umlauts (Speichern, Zurück, Abbrechen, Bestätigen, Bitte auswählen — not "Zurueck"). Use realistic domain content: Pflegeheime, Anfragen, Leads, Klienten, Hausbesuche. Realistic data makes stakeholder demos land; "Lorem ipsum" undermines them.

## Standalone mockup workflow

1. Read `references/components.md` (and `colors.md`/`typography.md` if the screen needs more than the core tokens above).
2. Start from `assets/am-prototype.css` — copy it into the artifact's `<style>` (or translate it to inline styles in React). It already implements buttons, cards, chips, toasts, form fields, and the page scaffold with the correct values.
3. Load Roboto: `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`.
4. Build the screen with realistic German content and interactive states where they help the demo (hover, filled fields, a visible toast).
5. Self-check against the tokens: headers blue and bold? Only palette colors? Only scale font sizes? Labels bold above fields? Cards 12px radius with `#D9D9D9` border?

## Repo code workflow

Reuse before you create: the app already has shared button classes (`btn`, `btn-info`, `btn-outline`, sizes), form components (`EditableInput`, `CustomTextArea`, `MultiSelectDropdown`, `ListByGroupDropdown`, `AdditionalSingleFieldList`), `CardContainer`, `Badge`, MUI (`Chip`, `Checkbox`, `Radio`, `FormControlLabel`, `Button`) and react-hook-form with `Controller`. Don't write ad-hoc `sx` styling or new chip/button classes when a shared one exists — the Storybook explicitly calls this out. See `references/components.md` for import paths and usage shapes taken from the Storybook source.
