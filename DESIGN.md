---
name: Owen Matola Portfolio
description: A ruled engineering record. Cool paper, near-black ink, one signal-teal accent, hairlines as the only container.
colors:
  paper: "oklch(0.985 0.003 250)"
  paper-raised: "oklch(0.96 0.004 250)"
  ink: "oklch(0.2 0.015 255)"
  ink-muted: "oklch(0.46 0.018 255)"
  rule: "oklch(0.88 0.006 250)"
  rule-strong: "oklch(0.6 0.012 255)"
  signal-teal: "oklch(0.46 0.1 195)"
  on-teal: "oklch(0.985 0.003 250)"
  danger: "oklch(0.5 0.17 27)"
  success: "oklch(0.45 0.11 155)"
  night: "oklch(0.17 0.012 255)"
  night-raised: "oklch(0.21 0.014 255)"
  night-ink: "oklch(0.94 0.008 250)"
  night-ink-muted: "oklch(0.72 0.014 255)"
  night-rule: "oklch(0.32 0.014 255)"
  night-rule-strong: "oklch(0.6 0.014 255)"
  signal-teal-night: "oklch(0.8 0.11 190)"
  on-teal-night: "oklch(0.17 0.012 255)"
  danger-night: "oklch(0.76 0.14 25)"
  success-night: "oklch(0.8 0.13 155)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.5rem + 5.4vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  ui: "3px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.on-teal}"
    rounded: "{rounded.ui}"
    padding: "0 20px"
    height: "44px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ui}"
    padding: "12px"
  icon-control:
    textColor: "{colors.ink}"
    rounded: "{rounded.ui}"
    size: "44px"
  icon-control-hover:
    backgroundColor: "{colors.paper-raised}"
---

# Design System: Owen Matola Portfolio

## Overview

**Creative North Star: "The Ruled Record"**

The site is set like an engineering record: facts, architecture and repo links are the visual content, and the interface recedes. Structure comes from hairline rules and a two-column margin layout, never from cards, glow, or ornament. It reads in daylight on a phone first; a dark theme is a deep blue-black, not a navy gradient.

One accent, signal teal, appears only where something is actionable or focused. Everything else is ink on paper, with weight and tone (not chips or badges) carrying hierarchy. Geist does all the talking; Geist Mono appears only for data.

**Key Characteristics:**
- Hairline rules are the only container; no cards, no shadows, no gradients.
- Section title sits in a left margin column (13rem), content in the right.
- One radius (3px), one accent, two themes switched by `data-theme` on `<html>`.
- Hit targets are at least 44px (`min-h-11`); focus is always visible.

## Colors

Cool-neutral paper and near-black ink, hue 250-255, with a single teal signal. Values are OKLCH; the light set is the default and the night set flips via `data-theme="dark"`.

### Primary
- **Signal Teal** (`signal-teal`, night: `signal-teal-night`): primary action fill (Download CV, Send message), active-nav underline, link-hover underline, focus ring, caret, selection. Nothing else is teal.

### Neutral
- **Cool Paper** (`paper` / `night`): page ground, header, field fill.
- **Raised Paper** (`paper-raised` / `night-raised`): portrait placeholder behind the image, icon-control hover.
- **Ink** (`ink` / `night-ink`): body and headings.
- **Muted Ink** (`ink-muted` / `night-ink-muted`): labels, secondary text, dates, inactive nav.
- **Hairline** (`rule` / `night-rule`): every divider and border, set as the global border color.
- **Field Stroke** (`rule-strong` / `night-rule-strong`): form-field borders and scrollbar thumb, stronger for non-text contrast.
- **Danger / Success** (`danger`, `success`, with night variants): form error and sent confirmation text only.

### Named Rules
**The One Signal Rule.** Teal marks links-in-waiting, focus, and the single primary action per view. If it is decorative, it is wrong.

**The Hairline Container Rule.** Grouping is a 1px rule above or below, never a box, fill, or shadow.

## Typography

**Display / Body Font:** Geist (variable, with ui-sans-serif, system-ui)
**Data Font:** Geist Mono (with ui-monospace)

**Character:** One neutral grotesque at confident weights, with mono reserved for measurements so figures read as evidence.

### Hierarchy
- **Display** (600, fluid 2.75rem to 5.25rem, line-height 1, -0.035em): the name in the hero only.
- **Headline** (600, fluid 1.375rem to 1.75rem, 1.2, -0.02em): section titles in the margin column; the current job title.
- **Lead** (400, fluid 1.125rem to 1.375rem, 1.5, muted): role phrase under the name; project short description.
- **Title** (600, 1.125rem): prior job titles and project-page block headings.
- **Body** (400, 1rem to 1.125rem, relaxed, capped at 60-65ch): prose.
- **Label** (500, 0.875rem): links, buttons, form labels, nav; sentence case.
- **Data** (Geist Mono, 0.75rem): date ranges, skill level words, technology lists, project "built with".

### Named Rules
**The Mono Is Data Rule.** Geist Mono is for dates, levels, versions and stacks only, never headings or prose.

**The Level-As-Weight Rule.** Skill confidence is conveyed by weight and tone (semibold, medium, regular muted, italic muted) with the level word always printed.

Tabular numerals (`.tabular`) wherever figures align. Headings use `text-wrap: balance`.

## Layout

A single `max-w-5xl` container with 16px (24px from sm) side padding. Home sections use a ruled band (`border-t`, 56px vertical padding, 80px from sm) containing a grid: 13rem title column plus fluid content at lg, stacked below, with the title sticky at `top-24`. The hero is a fluid column plus a 16rem portrait column at lg (portrait first and 160-224px wide on small screens). Project pages use a fluid column plus a 15rem sticky facts aside. Rows in definition lists use 12px vertical padding with a bottom rule; a 7rem label column in hero facts. Gaps cluster on 8, 16, 24, 40-48px. Sections anchor with `scroll-margin-top: 4.5rem` below the 64px fixed header.

## Elevation & Depth

Flat. There are no shadows and no gradients on the site pages. Depth is conveyed only by rules and the header's border appearing after 24px of scroll. The header is opaque paper, not blurred.

### Named Rules
**The Flat-Always Rule.** No box-shadow, no blur, no glow on page surfaces; state changes use underline color, opacity, or a raised-paper fill.

## Shapes

One 3px radius (`rounded-ui`) on buttons, fields, icon controls and the portrait. Everything else is square-cornered rules. The portrait is a 4:5 rectangle with a hairline border. No pills or circles on UI controls.

## Components

### Buttons
- **Primary:** teal fill, on-teal text, 3px radius, 44px min height, 20-24px horizontal padding, 14px medium label; hover drops opacity to 0.9; disabled 0.6 opacity with wait cursor. One per view (Download CV, Send message).
- **Text link:** ink, medium 14px, 2px underline in hairline color with 4px offset; hover turns the underline teal. Used for GitHub, Contact, email, project links.

### Navigation
Fixed opaque header, 64px. Name at left, six anchor links, GitHub icon control and theme toggle at right. Inactive links muted; active link ink, medium, with a 2px teal underline (scroll-spy at a 35% probe line). Below md, a 44px menu control opens a ruled list with 48px rows; Escape closes it.

### Inputs / Fields
- **Style:** paper fill, 1px field-stroke border, 3px radius, 12px padding, 16px text; labels above in 14px medium.
- **Focus:** global 2px teal outline with 3px offset (1px inside fields).
- **Error / Success:** danger or success colored 14px medium text in live regions.

### Ruled Definition List
The recurring signature: label in muted, value in ink, rows separated by hairlines. Used for hero facts, skills, and project facts.

### Icon Control
44px square, hairline border, 3px radius, ink glyph, raised-paper fill on hover.

## Do's and Don'ts

### Do:
- **Do** put grouping in hairline rules and the left-margin title column.
- **Do** keep teal to the primary action, focus, active nav and link-hover underline.
- **Do** use `rounded-ui` (3px) for every control and set mono type only for data.
- **Do** keep 44px minimum hit targets and honor `prefers-reduced-motion`.
- **Do** derive hero facts from `data/` so the first screen stays true.

### Don't:
- **Don't** use shadows, gradients, glow, glass, or colored backgrounds as containers.
- **Don't** add pills, badges, status dots, or icon tiles.
- **Don't** introduce a second accent or a second radius.
- **Don't** set Geist Mono on headings or prose.
