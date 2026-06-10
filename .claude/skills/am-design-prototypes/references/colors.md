# AM Color Palette

Source: `Guidelines/DesignGuides/ColorScheme` (Storybook), derived from `src/assets/styles/_variables.scss`. The product primarily uses **blue and green** as its core brand colors. Use the palette with clear intent: white keeps layouts clean, blue guides interaction and structure, green communicates positive or supportive states. Do not introduce colors outside this palette.

## theme.color.neutral — text, surfaces, structural neutrals

| Name | Value |
|---|---|
| White | `#FFFFFF` |
| Surface | `#F8F8F8` |
| Off White | `#F2F0EB` |
| Text Primary | `#2B2B2B` |
| Text Secondary | `#707070` |
| Border | `#D9D9D9` |

## theme.color.primary — primary blue brand and UI actions

| Name | Value |
|---|---|
| Blue | `#4C8BA5` |
| Dark Blue | `#3E7287` |
| Light Blue | `#D7E7F0` |
| Highlight Blue | `#4D8BA5` |
| Highlight Surface | `#F0F8FF` |

## theme.color.secondary — supportive green success palette

| Name | Value |
|---|---|
| Green | `#98C44C` |
| Dark Green | `#77993C` |
| Green Light | `#CBE1A5` |
| Soft Green Surface | `#EAF3DB` |

## theme.color.accent — warning, attention, highlights

| Name | Value |
|---|---|
| Orange | `#FFA600` |
| Golden Orange | `#DFA54E` |
| Amber | `rgba(255,166,0,0.2)` |
| Soft Amber | `rgba(255,166,0,0.05)` |

## theme.color.feedback — error and destructive

| Name | Value |
|---|---|
| Red | `#E74C3C` |
| Red Light | `#FF6961` |
| Soft Red Surface | `rgba(231,76,60,0.08)` |

## Usage guidelines (verbatim from the Storybook)

- **White `#FFFFFF`** — base surfaces and clean layouts: page backgrounds, cards/tables/content containers, modal and form surfaces.
- **Border `#D9D9D9`** — default neutral border for separation and structure: card/table/container outlines, default input borders, subtle dividers.
- **Soft Green Surface `#EAF3DB`** — filled form fields and soft confirmation states: filled text inputs after user entry, text areas that should feel valid and calm, completed form values.
- **Green `#98C44C`** — success states, positive highlights, confirmed actions: borders for completed/valid form fields, success and positive action buttons, positive highlights in tables, cards, KPI sections.
- **Warning Orange `#FFA600`** — warning states and attention-drawing highlights: warning badges and labels, non-destructive attention states, highlighted notices.
- **Error Red `#E74C3C`** — errors, destructive actions, invalid states: form validation errors, destructive actions or critical warnings, error text/borders/feedback.
- **Primary Blue `#4C8BA5`** — primary brand emphasis and repeated interactive UI: interactive controls, links and secondary actions, info-focused emphasis.

## Text color guidelines

Use text colors based on information hierarchy and meaning. Keep long-form content readable with neutral colors; reserve blue, green, and red for text that communicates interaction or state.

| Name | Hex | Usage | Example |
|---|---|---|---|
| Text Primary | `#2B2B2B` | Default body text, headings, main readable content | Page titles, table values, paragraphs |
| Text Secondary | `#707070` | Supporting text, visible but less prominent | Descriptions, helper copy, metadata |
| Primary Blue Text | `#4C8BA5` | Interactive or highlighted text — actionable or brand | Links, highlighted labels, important headings |
| Info Text | `#4C8BA5` | Informational text/helper guidance that stands out without feeling like error/success | "Hinweis: Änderungen an Ihrer Buchung werden nicht gespeichert" |
| Green Text | `#98C44C` | Positive text, success indicators, highlighted values | Positive KPI values, "Gewonnen" labels |
| Error Red Text | `#E74C3C` | Error messages, destructive text, invalid field feedback | "Dieses Feld ist erforderlich." |
