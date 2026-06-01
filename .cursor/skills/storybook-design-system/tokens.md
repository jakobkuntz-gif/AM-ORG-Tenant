# Design tokens (verified fallback)

Use when Storybook docs are unreachable. Prefer live Storybook values when available.

## Colors

### Neutral
| Token | Hex |
|-------|-----|
| White | `#FFFFFF` |
| Background | `#F8F8F8` |
| Off-white | `#F2F0EB` |
| Text | `#2B2B2B` |
| Muted text | `#707070` |
| Border | `#D9D9D9` |

### Primary
| Token | Hex |
|-------|-----|
| Primary | `#4C8BA5` |
| Primary dark | `#2F7287` |
| Primary light | `#D7E7F0` |
| Primary surface | `#F0F9FF` |

### Secondary (green)
| Token | Hex |
|-------|-----|
| Green | `#98C44C` |
| Green dark | `#77993C` |
| Green light | `#CBE1A5` |
| Green surface | `#EAF3DB` |

### Accent / feedback
| Token | Hex |
|-------|-----|
| Accent orange | `#FFA600` |
| Accent soft | `rgba(255, 166, 0, 0.05)` |
| Error | `#E74C3C` |
| Error light | `#FF6961` |
| Error surface | `rgba(231, 76, 60, 0.08)` |

## Typography

| Role | Size |
|------|------|
| Page header | 24px |
| Section header | 18px |
| Body / label | 14px |
| Helper | 13px |

## Surfaces

- **Page background**: `#FFFFFF` or `#F8F8F8` depending on layout (main content often white)
- **Card shadow**:
  ```css
  0 8px 24px rgba(0, 0, 0, 0.07),
  0 2px 6px rgba(0, 0, 0, 0.04);
  ```

## Buttons

- Primary fill: `#4C8BA5`; hover: `#2F7287`
- Secondary: `#D7E7F0` background, `#2F7287` text

## Status / priority chips

| Semantic | Background | Text |
|----------|------------|------|
| Low / info | `#F0F9FF` | `#4C8BA5` |
| Medium / warning | `rgba(255,166,0,0.05)` | `#FFA600` |
| High / error | `rgba(231,76,60,0.08)` | `#E74C3C` |
| Success | `#EAF3DB` | `#77993C` |

## CSS variables (HTML prototypes)

```css
:root {
  --primary: #4c8ba5;
  --primary-dark: #2f7287;
  --primary-light: #d7e7f0;
  --primary-surface: #f0f9ff;
  --bg: #f8f8f8;
  --line: #d9d9d9;
  --text: #2b2b2b;
  --muted: #707070;
  --white: #ffffff;
  --off-white: #f2f0eb;
  --green: #98c44c;
  --green-dark: #77993c;
  --green-light: #cbe1a5;
  --green-surface: #eaf3db;
  --orange: #ffa600;
  --amber-soft: rgba(255, 166, 0, 0.05);
  --red: #e74c3c;
  --red-light: #ff6961;
  --red-surface: rgba(231, 76, 60, 0.08);
  --card-elevated-shadow:
    0 8px 24px rgba(0, 0, 0, 0.07),
    0 2px 6px rgba(0, 0, 0, 0.04);
}
```
