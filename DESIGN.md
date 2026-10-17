---
name: Angelo Ortiz Vega — Portfolio
description: Aurora Studio. A dark, restrained violet-black canvas with a single violet accent for a Fullstack AI Engineer.
colors:
  signal-violet: '#a78bfa'
  signal-tint: 'rgba(167, 139, 250, 0.14)'
  signal-soft: '#c4b5fd'
  glow: 'rgba(124, 92, 255, 0.35)'
  pure-white: '#ffffff'
  highlight-tint: 'rgba(167, 139, 250, 0.06)'
  outline-light: 'rgba(167, 139, 250, 0.18)'
  bright-text: '#ece9ff'
  light-text: '#bcb7d6'
  muted-text: '#9a94b8'
  dim-text: '#4b4568'
  lifted-surface: '#1b1236'
  dim-surface: '#0e0824'
  studio-canvas: '#060010'
  void-black: '#030008'
  shadow-deep: 'rgba(3, 0, 8, 0.8)'
typography:
  display:
    fontFamily: "'Inter', 'Calibre', 'San Francisco', 'SF Pro Text', -apple-system, sans-serif"
    fontSize: 'clamp(56px, 9vw, 96px)'
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: '-0.03em'
  headline:
    fontFamily: "'Inter', 'Calibre', 'San Francisco', 'SF Pro Text', -apple-system, sans-serif"
    fontSize: 'clamp(40px, 8vw, 60px)'
    fontWeight: 300
    lineHeight: 1.1
  title:
    fontFamily: "'Inter', 'Calibre', 'San Francisco', 'SF Pro Text', -apple-system, sans-serif"
    fontSize: 'clamp(22px, 5vw, 34px)'
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: '0.05em'
  body:
    fontFamily: "'Inter', 'Calibre', 'San Francisco', 'SF Pro Text', -apple-system, sans-serif"
    fontSize: '19px'
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace"
    fontSize: '12px'
    fontWeight: 400
    letterSpacing: '0.1em'
rounded:
  card: '14px'
  pill: '999px'
spacing:
  xs: '10px'
  sm: '20px'
  md: '40px'
  lg: '100px'
  xl: '150px'
  section-max: '1000px'
  content-max: '1600px'
components:
  button-primary:
    backgroundColor: 'transparent'
    textColor: '{colors.pure-white}'
    rounded: '{rounded.pill}'
    padding: '1.25rem 2rem'
    typography: '{typography.label}'
  button-primary-hover:
    backgroundColor: '{colors.signal-violet}'
    textColor: '{colors.studio-canvas}'
    rounded: '{rounded.pill}'
  button-small:
    backgroundColor: 'transparent'
    textColor: '{colors.pure-white}'
    rounded: '{rounded.pill}'
    padding: '0.75rem 1rem'
    typography: '{typography.label}'
  button-small-hover:
    backgroundColor: '{colors.signal-violet}'
    textColor: '{colors.studio-canvas}'
    rounded: '{rounded.pill}'
---

# Design System: Angelo Ortiz Vega — Portfolio

## Overview

**Creative North Star: "The Aurora Studio"**

Inspired by [React Bits](https://reactbits.dev/): a deep violet-black canvas (`#060010`) with a faint, slow violet aurora behind it. The tone is sober: motion and glow exist to add quality, not spectacle — they stay behind the content and respond to the cursor, never competing with the text.

Typography stays precise: ultra-light display weights (200) let large text sit without mass, and a monospaced family carries labels, nav items and buttons so UI chrome still reads as engineering tooling. The one expressive gesture on type is the animated violet gradient on the hero surname.

Interaction is smooth and luminous: cards follow the cursor with a spotlight glow, buttons light up in the signal violet, the hero name enters as one piece.

**Key Characteristics:**

- Violet-black canvas with a fixed, very dim aurora background and faint grid
- A single accent: signal violet (and its lighter tint for gradients)
- Ultra-light to light heading weights — mass through scale, not weight
- All interactive chrome in monospaced uppercase
- Rounded geometry: 14px cards, fully pill-shaped buttons, chips and filters
- Cursor-reactive spotlight on cards; hero name enters as one piece (no per-word animation)
- Everything animated respects `prefers-reduced-motion`

## Colors

One structural white, one violet signal, one deep ramp.

### Primary

- **Bone White** (`#ffffff`): Primary interactive color — button text/borders at rest, link hover, logo. Not softened.

### Signal & Accents

- **Signal Violet** (`#a78bfa`): The main accent. Section counters (via gradient), hover fills on buttons and active filters, selection highlight, focus rings, inline links.
- **On Signal** (`--on-signal`: `#060010` in dark, `#ffffff` in light): text color on filled Signal Violet surfaces (button hover, active filters, text selection).
- **Signal Tint** (`rgba(167, 139, 250, 0.14)`): Washes behind hovered nav links and the hero greeting pill.
- **Signal Soft** (`#c4b5fd`): Lighter violet used only as the second stop of the brand gradient (`--gradient-text`: violet → soft violet).
- **Glow** (`rgba(124, 92, 255, 0.35)`): Spotlight on cards, button hover halo, loader glow.

### Neutral

- **Bright Text** (`#ece9ff`): Headings.
- **Light Text** (`#bcb7d6`): Subheadings, nav items at rest.
- **Muted Text** (`#9a94b8`): Body copy.
- **Dim Text** (`#4b4568`): Disabled states, placeholders, scrollbar thumb.
- **Lifted Surface** (`#1b1236`) / **Dim Surface** (`#0e0824`): Cards and layered panels.
- **Studio Canvas** (`#060010`): Primary background. **Void Black** (`#030008`): loader and deepest floor.
- **Outline Light** (`rgba(167, 139, 250, 0.18)`): Borders and hairlines — violet-tinted rather than white.
- **Shadow Deep** (`rgba(3, 0, 8, 0.8)`): Elevation shadows.

### Light theme

A lavender-white variant (`#faf8ff` canvas, `#140d30` text, signal `#6d28d9`) is available from the nav toggle; the aurora drops to 45% opacity. Colors live in `src/styles/colors.js` and are mirrored as defaults in `variables.js`.

### Named Rules

**The One Accent Rule.** Violet is the only hue — no cyan, pink or other colors anywhere. The violet→soft-violet gradient is reserved for the hero surname, section counters, the experience tab indicator and the loader logo. Never on body text or large fills.

**The White Is Active Rule.** `#ffffff` means "interactive or highest contrast". It is not decorative trim.

## Typography

**Display / Body:** Inter / Calibre — San Francisco / system-ui fallback.
**Mono:** SF Mono — Fira Code, Fira Mono, Roboto Mono fallbacks.

### Hierarchy

- **Display** (200, `clamp(56px, 9vw, 96px)`, −0.03em): Hero name. "Angelo" and "Ortiz." enter together; "Ortiz." carries the animated gradient.
- **Headline** (300, `clamp(40px, 8vw, 60px)`): Page-level subheadings.
- **Title** (300, `clamp(22px, 5vw, 34px)`, 0.05em, uppercase): Numbered section headings, preceded by a gradient counter.
- **Body** (400, 19px, 1.3; 17px ≤480px): Primary prose.
- **Label / Mono** (400, 12–13px, 0.08–0.12em, uppercase): Buttons, nav, chips, overlines.

### Named Rules

**The Mono-Is-Chrome Rule.** Monospaced text signals UI infrastructure — button, label, badge, code — never running prose.

## Layout

Main content sits in a `max-width: 1600px` shell with `150px` horizontal padding (down to `25px` on mobile); section content is capped at `1000px` and centered. Sections use `72px` vertical padding (`60px` ≤768px, `48px` ≤480px).

Featured projects use a 12-column grid with alternating sides, collapsing to one column ≤768px.

The **aurora background** is `position: fixed` behind `#content` (z-index 0 vs. 1).

Contact has a soft radial glow behind the CTA.

Navigation is a **floating glass pill** (max 1120px wide, 60px tall, fully rounded, `--nav-bg` + `backdrop-filter`, violet hairline) centered over a transparent header. The header hides on scroll-down and returns on scroll-up. The link for the section under the reading line gets the hover tint (`aria-current="location"`, home page only). Language is a text toggle (`EN | ES`, active language underlined) rather than a flag. Mobile keeps the same pill with the hamburger inside.

Breakpoints (max-width): 330 / 400 / 480 / 600 / 768 / 900 / 1080 / 1200 / 1400px.

## Elevation & Depth

Depth now comes from light, not only shadow: the aurora, translucent surfaces (`backdrop-filter: blur`) and cursor spotlights. Classic shadows remain for state changes.

- **Ambient Lift** (`0 10px 30px -15px shadow-deep`): project cards.
- **Hover Depth** (`0 20px 30px -15px shadow-deep`): cards on hover, which also rise 7px.
- **Button Halo** (`0 0 28px -4px glow`): buttons on hover/focus.
- **Nav Scroll** (`0 10px 30px -10px shadow-deep`).

## Shapes

- **Cards** (project cards): `14px` radius, 1px `outline-light` border.
- **Buttons, filters, skill pills, nav links, hero greeting:** fully rounded (`999px`).
- Section divider rules fade out left-to-right (`outline-light` → transparent).

## Components

### Aurora Background & Dot Grid (`fx/AuroraBackground`, `fx/DotGrid`)

A fixed, non-interactive layer mounted once at the root (`gatsby-browser.js` / `gatsby-ssr.js` via `wrapRootElement`), so it persists across page navigations without flicker. From back to front:

1. Three soft violet radial gradients (top-left, right-middle, bottom-left). Opacity token `--aurora-opacity`: 1 in dark, 0.5 in light.
2. A static 32px CSS dot texture — the fallback, hidden once the WebGL grid is running.
3. **Interactive dot grid** (WebGL2, adapted from React Bits' Dot Grid, MIT + Commons Clause — keep the attribution header in `DotGrid.js`): ~3px dots on a 32px grid, resting at 20% alpha in `--signal-color`. The cursor pushes nearby dots through damped springs coupled to their neighbours (a connected sheet); close dots swell and shift toward `--signal-soft` with a soft halo. Masked toward the edges like the old texture. Tuned deliberately subtle (strength 0.4, little bounce, no stretch, no click shockwave).

- **Intro:** on a fresh visit to the home page the dots stay hidden and bloom outward from the center (~1.1s) as the loader's curtain opens (the loader fires a `portfolio:reveal` event; a 6s fallback starts it regardless). No intro on other routes or later navigations.
- **Behavior:** the animation loop stops when everything is at rest, pauses when the tab is hidden, and caps the pixel ratio at 2. Touch input is ignored. Under `prefers-reduced-motion` the grid is static. Without WebGL2 the CSS dots remain. Colors are read from the theme variables and refresh when the theme toggles.

### Spotlight Cards (`fx/spotlight`)

`onSpotlightMove` writes `--mx/--my` from the cursor; the `spotlight` mixin paints a radial `glow` gradient behind content on hover. Used on project cards and blog entries.

### Gradient Text (`fx/GradientText`)

Animated violet→soft-violet gradient clipped to text; static under reduced motion.

### Case Study Card (`sections/caseStudy`)

The one saturated block on the page: a 24px-radius violet gradient card (`#5b3df5 → #a78bfa`) with a fading dot texture, placed right after About. A mono overline ("Case study · Logistics"), an oversized light headline stating the outcome, one sentence on the author's own contribution, and a white pill CTA to the external story. Text on it is white regardless of theme.

### Buttons

Mono, uppercase, tracked, pill-shaped. Transparent with a violet hairline at rest; on hover/focus fill with Signal Violet, text inverts to `#060010`, and the Button Halo appears. Transition `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

- Big: `1.25rem 2rem`, 0.12em · Default: `1.25rem 1.75rem`, 0.1em · Small: `0.75rem 1rem`, 0.08em

### Navigation

Floating pill; the links sit at the true center (logo and tool buttons each take equal flexible space); links are mono, 11px, uppercase, pill-highlighted on hover with Signal Tint.

### Experience metrics

Numbers inside bullets (220K, 8.5K, 20+, 250+…) are wrapped in `<strong>` and lifted to the heading text color, so the outcome reads first.

### Inline Links

Inherit color; hover → white with a 1px underline growing from 0 to 100%.

### Chips / Skill Pills

Pill-shaped, mono 12px, `highlight-tint` background with an `outline-light` border; hover lifts 2px. Technology icons rest in monochrome (`grayscale` + 80% opacity) and regain their brand colors on hover, so the page keeps a single accent hue. Skills are a compact strip of three groups (AI in production · Backend & systems · Frontend & cloud) separated by hairlines — three columns on desktop, stacked ≤900px. The list is curated to what defines the current role (Full Stack AI Engineer), not exhaustive; older stacks live in Experience.

### Hero

The hero opens directly on the name — no rotating multilingual greeting. Order: name, role line, one-sentence positioning, current-employer line, location, CTA.

### Loader / Splash

A short intro (~1.8s by design), played once per browser session, skippable with a click or key press, and skipped entirely under `prefers-reduced-motion`:

1. On a dark dot-textured field with a soft violet glow at the center seam, the **whole logo (hexagon and A) pulses as one unit** from the very first paint (CSS, so it also runs while the page is still hydrating). There is no progress counter or bar.
2. At ~250ms the page mounts underneath the loader (so the heavy React work happens while the screen is only the pulsing logo, never during the curtain), and the name types in in mono. A quiet "Click or press any key to skip" hint fades in at ~600ms.
3. At ~1.0s the content steps back; at ~1.1s the screen splits into two halves that slide up and down (`easeInOutExpo`, 700ms). At that moment the loader fires `portfolio:reveal` — the hero entrance and the dot-grid intro start on that event, so both play as the curtain opens, not behind it.
   Accessibility: the loader is a `role="status"` live region with a visually hidden "Loading" label. A watchdog closes it after 6s if the timeline ever stalls. The logo gradient uses the theme tokens (`--signal-color` → `--signal-soft`), so it also reads in the light theme.

### Fancy List & Numbered Heading

Fancy list bullet `▹` in Signal Violet. Numbered heading: gradient mono counter, uppercase title, fading trailing rule.

## Do's and Don'ts

### Do:

- Keep motion ambient and in the background; content stays readable at all times.
- Use the gradient only where The One Accent Rule allows.
- Use pill shapes for interactive chips/buttons and `14px` for contained surfaces.
- Write button and label copy in mono, uppercase, tracking ≥ 0.08em.
- Gate every animation with `prefers-reduced-motion`.
- Use weight 200–300 for display and heading text.

### Don't:

- Don't introduce any hue besides violet (no cyan, pink, orange), and no marquees or extra ambient motion.
- Don't put the aurora or gradient behind long-form text at high opacity.
- Don't add radii other than `14px` (surfaces) and `999px` (controls).
- Don't set the sans-serif stack on labels, buttons, or nav.
- Don't add new decorative animation without a reduced-motion fallback.
