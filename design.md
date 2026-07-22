# JEJAKU RECEIPT — Design System Documentation

> Monochromatic precision receipt archival and telemetry platform.
> Design inspired by Nothing Technology.

---

## 1. Design Philosophy

The visual language follows an **instrument-grade, industrial premium** aesthetic. Every element is designed to feel like a scientific telemetry interface — precise, technical, and monochromatic — with deliberate use of negative space.

**Core Principles:**
- **Monochromatic first** — color is only used for semantic meaning (accent, success, error)
- **Typography as interface** — type scale, weight, and tracking carry the visual hierarchy
- **Instrument density** — compact data layouts with clear label/value pairing
- **Dot-matrix textures** — subtle grid patterns evoke technical readouts

---

## 2. Color Tokens

### Dark Mode (Default)

| Token               | Value                          | Usage                        |
|---------------------|--------------------------------|------------------------------|
| `--black`           | `#000000`                      | Page background              |
| `--surface`         | `#111111`                      | Card backgrounds             |
| `--surface-raised`  | `#1A1A1A`                      | Elevated surfaces            |
| `--border`          | `#222222`                      | Subtle separators            |
| `--border-visible`  | `#333333`                      | Visible borders, dividers    |
| `--text-disabled`   | `#666666`                      | Disabled / copyright text    |
| `--text-secondary`  | `#999999`                      | Labels, metadata             |
| `--text-primary`    | `#E8E8E8`                      | Body text, descriptions      |
| `--text-display`    | `#FFFFFF`                      | Headings, emphasis           |
| `--accent`          | `#D71921`                      | Brand accent (Nothing red)   |
| `--accent-subtle`   | `rgba(215, 25, 33, 0.15)`     | Accent backgrounds           |
| `--success`         | `#4A9E5C`                      | OK / active states           |
| `--warning`         | `#D4A843`                      | Warning states               |
| `--error`           | `#D71921`                      | Error states                 |
| `--interactive`     | `#5B9BF6`                      | Links, interactive elements  |

### Light Mode

Activated via `html.light` class toggle. All color tokens are overridden:

| Token               | Value       |
|---------------------|-------------|
| `--black`           | `#F5F5F5`   |
| `--surface`         | `#FFFFFF`   |
| `--text-display`    | `#000000`   |
| `--text-primary`    | `#1A1A1A`   |
| `--interactive`     | `#007AFF`   |

---

### Monetary & Price Display Standard

- **Price & Expenditure Color Mandate**: All transaction prices, monetary figures, expenditure totals, receipt amounts, and currency readouts on the Dashboard MUST be styled in **vibrant orange (`var(--orange)` / `#FF5C00`)** font color to maintain immediate telemetry recognition and data hierarchy.

## 3. Typography

### Font Stack

| Variable          | Font                              | Usage                         |
|-------------------|-----------------------------------|-------------------------------|
| `--font-display`  | Doto → Space Mono → monospace     | Display headings (JK-02, STACK, PRICING) |
| `--font-body`     | Space Grotesk → DM Sans → sans    | Body text, subtitles, descriptions |
| `--font-data`     | Space Mono → JetBrains Mono       | Labels, badges, metrics, nav links |

### Dynamic Font Family Switcher (`FontToggleButton`)

Users can switch the font family dynamically via the `[ T ]` header navbar toggle button. Font preferences persist in `localStorage`:

| Mode        | Font Family               | Overrides                                  |
|-------------|---------------------------|--------------------------------------------|
| `DEFAULT`   | Nothing Space Stack       | `Space Grotesk`, `Space Mono`, `Doto`      |
| `INTER`     | Inter                     | Universal system-wide `Inter` override     |
| `JAKARTA`   | Plus Jakarta Sans         | Universal system-wide `Plus Jakarta Sans`  |

### Minimum Font Size Mandate (10px Minimum)

- **Absolute Minimum Font Size**: `10px` (`0.625rem`).
- All subtext, metadata labels, barcode parameters, and status indicators below 10px (e.g. 6px, 7px, 8px, 9px) have been upgraded to `10px` minimum.

### Type Scale

| Token           | Desktop    | Tablet (≤768px) | Phone (≤480px) |
|-----------------|------------|-----------------|----------------|
| `--display-xl`  | 4.5rem     | 3rem            | 2.5rem         |
| `--display-lg`  | 3rem       | 2.25rem         | 2rem           |
| `--display-md`  | 2.25rem    | 1.75rem         | 1.5rem         |
| `--heading`     | 1.5rem     | 1.25rem         | 1.125rem       |
| `--subheading`  | 1.125rem   | (unchanged)     | (unchanged)    |
| `--body`        | 1rem       | (unchanged)     | (unchanged)    |
| `--body-sm`     | 0.875rem   | (unchanged)     | (unchanged)    |
| `--caption`     | 0.75rem    | (unchanged)     | (unchanged)    |
| `--label`       | 0.6875rem  | (unchanged)     | (unchanged)    |

---

## 4. Spacing Scale

| Token          | Value  |
|----------------|--------|
| `--space-2xs`  | 2px    |
| `--space-xs`   | 4px    |
| `--space-sm`   | 8px    |
| `--space-md`   | 16px   |
| `--space-lg`   | 24px   |
| `--space-xl`   | 32px   |
| `--space-2xl`  | 48px   |
| `--space-3xl`  | 64px   |
| `--space-4xl`  | 96px   |

---

## 5. Layout System

### Page Container

All pages use an identical wrapper:

```css
display: flex;
flex-direction: column;
min-height: 100vh;
width: 100%;
max-width: 1200px;
margin: 0 auto;
padding: var(--space-md);
```

### Main Content Grid (`.main-grid`)

Two-column asymmetric split on desktop, single stack on mobile:

| Breakpoint  | Columns            |
|-------------|--------------------|
| < 768px     | `1fr` (stacked)    |
| ≥ 768px     | `1.2fr 1fr` (hero left, content right) |

### Header (`.header`)

Horizontal on desktop, vertical stack on mobile (≤768px). Navigation links use `.nav-link` class with `.header-right` wrapping enabled.

---

## 6. Component Patterns

### Hero Section

Every page follows the same hero structure:

1. **Badge** — bordered container with mono label (e.g. `TELEMETRY INSTRUMENT`)
2. **Display Title** — `--font-display` at `--display-xl`, bold
3. **Subtitle** — `--font-body` at `--display-md`, light weight
4. **Metrics Row** — flex row of label/value pairs, wraps on mobile

### Card (Tech Stack)

```
┌─────────────────────────────────────────┐
│  [Logo]  Title          [Version Badge] │
│          Role                           │
│                                         │
│  Description text...                    │
└─────────────────────────────────────────┘
```

- Border: `1px solid var(--border-visible)`, radius `12px`
- Background: `var(--surface)` with `.dot-grid-subtle`
- Card header wraps on narrow screens

### Footer Specifications

Three-column auto-fit grid (`minmax(240px, 1fr)`) with labeled spec items:
- **OPTICS** — Sensor specification
- **INTEGRATION** — Export capabilities
- **SPEED** — Processing latency

Followed by a centered copyright line.

### Buttons

| Style       | Background           | Border                      | Text Color       |
|-------------|----------------------|-----------------------------|------------------|
| Primary     | `var(--text-display)` | none                       | `var(--black)`   |
| Secondary   | transparent          | `1px solid var(--border-visible)` | `var(--text-primary)` |

Both: `border-radius: 999px`, `font-data`, `13px`, `letter-spacing: 0.06em`

### Custom Expanding Dropdown (`CustomDropdown.tsx`)

- **Standardization Mandate**: Native OS browser `<select>` popups are strictly prohibited. All dropdown selections MUST use the custom `CustomDropdown` component.
- **Trigger Button**: Styled with `var(--surface-raised)`, `border: 1px solid var(--border-visible)`, Nothing green active state indicator `[●]`, and rotating chevron indicator `▼`.
- **Expanding Panel**: Displays an inline list box container directly beneath the trigger button with `[✓]` item selection indicators, `rgba(74, 158, 92, 0.12)` active item highlights, and click-outside dismissal.

---

## 7. Responsive Breakpoints & Standardization

| Breakpoint | Target | Sidebar & Header Behavior | Grid Layout & Typography Standards |
|------------|--------|---------------------------|-----------------------------------|
| **≤ 480px** | Small Phones | Sticky left sidebar (`70px` width) with vertical button stack. Header controls flex wrap. | 1-column metrics grid. `1.25rem` hero title font. 100% fluid card width (`maxWidth: 100%`). |
| **≤ 768px** | Mobile/Tablets | Sticky left sidebar auto-collapses to `70px` width. Header search bar & buttons wrap. | Single-column main layout (`flex-direction: column`). Inner table `overflow-x: auto`. |
| **≥ 768px** | Tablets+ | Sidebar expands to `250px` on desktop with full text labels & system sublinks. | Multi-column main grid (`1.2fr 1fr`). Full `--display-xl` scale. |
| **≥ 992px** | Desktops | Sticky expanded left sidebar (`250px`). Full multi-column telemetry grid. | 3-column stack grid. `--display-xl` scale. |

### Core Responsiveness Standards:
1. **Zero Text Clipping**: Display headings feature `word-break: break-word` & `overflow-wrap: anywhere`.
2. **Horizontal Containment**: Tables and complex readouts use inner `overflow-x: auto` containers.
3. **Sticky Left Sidebar**: The left sidebar remains sticky (`position: sticky`, `top: 0`, `height: 100vh`) across all viewports, collapsing cleanly on mobile/tablet screens.

---

## 8. Page Structure

### Routes

| Route          | Purpose                    | Hero Badge            |
|----------------|----------------------------|-----------------------|
| `/`            | Landing / Scanner Console  | `TELEMETRY INSTRUMENT`|
| `/dashboard`   | Operator telemetry console | `CONSOLE // METRICS`  |
| `/onboarding`  | 6-step calibration flow    | `PROVISIONING`        |
| `/tech-stack`  | Technology catalog         | `SYSTEM COMPONENTS`   |
| `/pricing`     | Pricing plan               | `ACQUISITION MODEL`   |
| `/login`       | Operator auth login        | `AUTHENTICATION`      |
| `/register`    | Operator registration      | `PROVISIONING`        |

### Navigation Architecture

- **Top Navbar (Header Right)**: `[ HOME ] | [ DASHBOARD ] | [ ONBOARDING ] | [ LOGIN ] | [ REGISTER ] | [ INSTALL APP ] | [ FONT ] | [ THEME ]`
- **Footer Navigation**: `[ TECH STACK ] | [ PRICING ]` positioned above the copyright line (`© 2026 JK ARCHIVAL. DESIGN INSPIRED BY NOTHING.`)

---

## 9. Progressive Web App (PWA)

### Manifest

Located at `public/manifest.json`. Configured for standalone display with black theme, portrait orientation, and custom monochromatic icons (192×192, 512×512).

### Service Worker

Located at `public/sw.js`. Uses a **network-first** strategy with cache fallback:
1. All GET requests attempt network fetch first
2. Successful responses are cached
3. On network failure, serves cached response
4. Falls back to cached homepage as offline page

### Install Button

The `PWAInstallButton` component (`src/app/components/PWAInstallButton.tsx`):
- Captures the `beforeinstallprompt` event
- Shows `[ INSTALL APP ]` in accent color when install is available
- Shows `[ INSTALLED ]` (disabled) after installation
- Falls back to manual install instructions for non-Chromium browsers
- Registers the service worker on mount

---

## 10. Visual Textures

### Dot Grids

| Class             | Dot color              | Size     | Usage               |
|-------------------|------------------------|----------|----------------------|
| `.dot-grid`       | `var(--border-visible)` | 16×16px | Prominent backgrounds |
| `.dot-grid-subtle`| `var(--border)`         | 12×12px | Card backgrounds      |

### Scrollbar

Custom webkit scrollbar: 6px width, `--border-visible` thumb, `--black` track.

---

## 11. Files

| File                                      | Purpose                                 |
|-------------------------------------------|-----------------------------------------|
| `src/app/globals.css`                     | Design tokens, resets, responsive utilities |
| `src/app/layout.tsx`                      | Font loading, PWA meta tags, manifest link |
| `src/app/page.tsx`                        | Landing page with scanner console       |
| `src/app/tech-stack/page.tsx`             | Technology catalog page                 |
| `src/app/pricing/page.tsx`                | Pricing plan page                       |
| `src/app/components/PWAInstallButton.tsx` | PWA install button component            |
| `public/manifest.json`                    | PWA web app manifest                    |
| `public/sw.js`                            | Service worker (network-first caching)  |
| `public/icon-192x192.png`                 | PWA icon (192×192)                      |
| `public/icon-512x512.png`                 | PWA icon (512×512)                      |

