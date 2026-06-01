---
name: storybook-design-system
description: >
  Use this skill whenever writing, editing, or reviewing any UI code in this project.
  This skill ensures all components, design tokens, spacing, colors, and typography
  come from the company Storybook design system — never from raw HTML or ad-hoc styles.
  Trigger whenever the user asks to: build a UI, create a component, add a page, style
  something, fix a layout, or write any React/JSX code. Also trigger for reviews or
  refactors of existing UI code to check it conforms to the design system.
---

# Storybook Design System Skill

## Storybook URL
```
https://am-storybook-12032-write-story-book.azurewebsites.net/
```

## Core Principle

**Never invent UI from scratch.** Before writing any component, layout, or style, check
whether the design system already provides it. If it does, use it. If it doesn't, use
design tokens (colors, spacing, typography) to stay consistent.

---

## Step 1: Discover the Design System (do this first, always)

Before writing any UI code, fetch the Storybook component index:

```
GET https://am-storybook-12032-write-story-book.azurewebsites.net/index.json
```

If that 404s, try:
```
GET https://am-storybook-12032-write-story-book.azurewebsites.net/stories.json
```

Parse the response to get a list of all available components and their stories.
This is your source of truth — it reflects the current state of the design system.

For a specific component's docs/args, fetch:
```
GET https://am-storybook-12032-write-story-book.azurewebsites.net/stories.json  (look up storyId)
```

Or navigate to the component's iframe URL:
```
https://am-storybook-12032-write-story-book.azurewebsites.net/iframe.html?id=<story-id>&viewMode=docs
```

### Design guide entry points

| Topic | Story ID |
|-------|----------|
| Color scheme | `guidelines-designguides-colorscheme--docs` |
| Icons | `guidelines-designguides-icons--docs` |
| Typography | `guidelines-designguides-typographyscale--docs` |
| Buttons | `guidelines-designguides-button-styles--docs` |
| Chips | `guidelines-designguides-chip--docs` |
| Toasts | `guidelines-designguides-toast--docs` |
| Forms / inputs | `guidelines-designguides-inputdropdownformshowcase--docs` |

If Storybook docs iframes show "No Preview", use `index.json` story `importPath` values to locate source files, or ask the user for a screenshot.

---

## Step 2: Map the Task to Design System Elements

For any UI task, identify which design system elements apply:

| Need | Look for in Storybook |
|------|----------------------|
| A button / CTA | `Button`, `IconButton`, `LinkButton` stories |
| Form inputs | `Input`, `Select`, `Checkbox`, `Radio`, `Switch` stories |
| Layout / spacing | Spacing tokens, `Stack`, `Grid`, `Container` stories |
| Typography | `Text`, `Heading`, typography token stories |
| Colors | Color token stories or design token docs |
| Feedback / status | `Alert`, `Toast`, `Badge`, `Tag` stories |
| Navigation | `Nav`, `Breadcrumb`, `Tabs`, `Menu` stories |
| Modals / overlays | `Modal`, `Drawer`, `Tooltip`, `Popover` stories |
| Data display | `Table`, `Card`, `List` stories |
| Loading states | `Spinner`, `Skeleton` stories |

### Known UI stories (Anfragen-Manager stack)

| Need | Story ID |
|------|----------|
| Sidebar nav | `ui-nav-managementnavbar--default` |
| Cards | `ui-card-cardcontainer--default` |
| Tables | `ui-table-generictablev2--default` |
| Search input | `ui-inputs-searchinput--default` |
| Basic modal | `ui-modals-basicmodal--default` |
| Confirmation modal | `ui-modals-confirmationmodal--default` |
| Tabs | `ui-tabs-generictabpanel--default` |
| Inline loader | `ui-spinner-inlineloader--default` |

---

## Step 3: Rules for Writing Code

### ✅ Always do this

1. **Import from the design system package** — check the story source to find the correct
   import path (e.g. `import { Button } from '@am/ui'` or wherever the package lives).
   If unclear, look at existing source files in the project for the import pattern.

2. **Use component props as documented** — check the `args` / `argTypes` in the story
   for the correct prop names, variants, and sizes. Don't guess prop names.

3. **Use design tokens for any custom styles** — colors, spacing, font sizes, border
   radii must come from CSS variables or token constants defined in the design system.
   Never hardcode hex values, pixel values, or font stacks.

4. **Match the story's code pattern** — if a story shows a component used a certain way,
   follow that exact pattern (composition, prop usage, children structure).

5. **Use the smallest/most specific component available** — prefer a specific `IconButton`
   over a generic `Button` with an icon prop if both exist.

6. **Icons** — use Storybook icon families (App SVG, Fontello, image-bg, Font Awesome).
   For HTML prototypes, prefer Font Awesome solid (`fa-solid`) when matching production.
   Do not substitute Lucide or other libraries unless the user explicitly requests it.

### ❌ Never do this

- Never use raw `<button>`, `<input>`, `<select>` etc. when a design system component exists
- Never hardcode colors like `color: '#3B82F6'` or `background: 'red'`
- Never hardcode spacing like `margin: '16px'` — use tokens
- Never create a new one-off styled component for something the design system already covers
- Never import from a different UI library (MUI, Antd, Chakra) when a custom component exists

---

## Step 4: When Something Doesn't Exist in the Design System

If you've checked the Storybook and the component or token genuinely doesn't exist:

1. **Compose from primitives** — combine existing design system components rather than
   building from scratch with raw HTML
2. **Use design tokens for all styling** — even custom components must use the token system
3. **Note the gap** — add a comment like `// TODO: candidate for design system addition`
   so the team can track what's missing

---

## Step 5: Verify Before Finishing

Before presenting code to the user, do a quick self-check:

- [ ] Every interactive element uses a design system component
- [ ] No hardcoded color values
- [ ] No hardcoded spacing/sizing values
- [ ] All imports point to the correct design system package
- [ ] Props match what's documented in the Storybook stories
- [ ] Layout uses design system layout primitives where available

---

## Fetching Component Details (reference)

To get full details on a specific component, use the Storybook iframe in docs mode:

```
https://am-storybook-12032-write-story-book.azurewebsites.net/iframe.html?id={story-id}&viewMode=docs
```

Story IDs follow the pattern: `category-componentname--variantname`
Example: `guidelines-designguides-button-styles--primary-buttons`, `ui-card-cardcontainer--default`

You can also fetch the raw story source by reading the story file path returned in
the index JSON — this shows exactly how the component is meant to be used.

## Additional resources

- Verified color/typography/surface tokens (fallback when docs are unavailable): [tokens.md](tokens.md)

---

## Notes

- The Storybook is at `https://am-storybook-12032-write-story-book.azurewebsites.net/` — always fetch live,
  never rely on cached knowledge of what components exist
- If the Storybook is temporarily unavailable, ask the user before proceeding with
  assumptions — don't invent a component API you haven't verified
- Stack: React + JavaScript (no TypeScript types needed, but still match prop names exactly)
- Page background: white (`#FFFFFF`); elevated cards use soft layered shadow (see tokens.md)
