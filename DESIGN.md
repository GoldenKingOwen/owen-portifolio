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
  headline-large:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
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
    lineHeight: 1.5
rounded:
  ui: "3px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  header: "64px"
  section-tight: "56px"
  section-default: "80px"
  section-roomy: "112px"
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
  diagram-box:
    textColor: "{colors.ink}"
    rounded: "{rounded.ui}"
    padding: "8px 12px"
---

# Design System: Owen Matola Portfolio

## Overview

**Creative North Star: "The Ruled Record"**

The site is set like an engineering record: facts, architecture and repo links are the visual content, and the interface recedes. Structure comes from hairline rules, a two-column margin layout, and one flat Card component for grouped content; never from glow, glass, or ornament. It reads in daylight on a phone first; a dark theme is a deep blue-black, not a navy gradient.

One accent, signal teal, appears only where something is actionable or focused (plus one structural marker in the architecture diagram). Everything else is ink on paper, with weight and tone (not chips or badges) carrying hierarchy. Geist does all the talking; Geist Mono appears only for data.

Rhythm varies by purpose rather than repeating one block: reference lists (Skills, Education) run tight, the work (Projects) and the close (Contact) run roomy, and only the closing section gets a larger title.

**Key Characteristics:**
- Hairline rules and the single Card component are the only containers; no shadows, no gradients, no backdrop blur on any surface. The architecture diagram is outlined rules, never a Card.
- Cards are allowed, as ONE component (`components/ui/Card.tsx`) with a defined anatomy: a flat tinted surface, a 1px border, the single 3px radius, no shadow, no gradient. Still refused: nested cards (never a Card inside a Card), identical-card grids with no hierarchy, glow orbs, gradients, glassmorphism and backdrop blur, shadows as decoration, icon-in-rounded-tile stacks, pill-badge clouds, and eyebrow chips.
- Section title sits in a left margin column (13rem), content in the right.
- One radius (3px), one accent, two themes switched by `data-theme` on `<html>`.
- Hit targets are at least 44px (`min-h-11`); focus is always visible.
- An arrow means the link leaves the site.

## Colors

Cool-neutral paper and near-black ink, hue 250-255, with a single teal signal. Values are OKLCH; the light set is the default and the night set flips via `data-theme="dark"`. In the stylesheet the roles are variables (`--bg`, `--bg-raised`, `--ink`, `--ink-muted`, `--rule`, `--rule-strong`, `--accent`, `--accent-ink`, `--danger`, `--success`) exposed to Tailwind as `background`, `raised`, `foreground`, `muted`, `border`, `field`, `accent`, `accent-ink`.

### Primary
- **Signal Teal** (`signal-teal`, night: `signal-teal-night`): primary action fill (Download CV, Send message), active-nav underline, link-hover underline, focus ring, caret, selection, and the 2px gateway outline in the architecture diagram. Nothing else is teal.

### Neutral
- **Cool Paper** (`paper` / `night`): page ground, header, field fill, modal ground.
- **Raised Paper** (`paper-raised` / `night-raised`): portrait placeholder behind the image, icon-control hover, certificate thumbnail hover and well.
- **Ink** (`ink` / `night-ink`): body and headings.
- **Muted Ink** (`ink-muted` / `night-ink-muted`): labels, secondary text, dates, project status line, inactive nav.
- **Hairline** (`rule` / `night-rule`): every divider and border. It is the global default border color, declared in `@layer base` so a utility like `border-field` or `border-accent` overrides it.
- **Field Stroke** (`rule-strong` / `night-rule-strong`): form-field borders, architecture-diagram boxes and connectors, scrollbar thumb. Stronger than the hairline for non-text contrast. Computed exactly from the OKLCH tokens (OKLCH to linear sRGB to WCAG relative luminance): 3.78:1 against light paper and 4.85:1 against the night ground; both clear the 3:1 non-text floor. The decorative hairline (`rule`) is deliberately below that (1.37:1 light, 1.51:1 dark) and must never be the only boundary of a control.
- **Danger / Success** (`danger`, `success`, with night variants): form error and sent confirmation text only.

### Named Rules
**The One Signal Rule.** Teal marks links-in-waiting, focus, and the single primary action per view. The only structural use is the diagram's gateway outline, chosen during the redesign; revisit if wanted. If it is decorative, it is wrong.

**The Hairline Container Rule.** Grouping is a 1px rule above or below, never a box, fill, or shadow. The architecture diagram is the single deliberate exception, because boxes are its content.

## Typography

**Display / Body Font:** Geist (variable, with ui-sans-serif, system-ui)
**Data Font:** Geist Mono (with ui-monospace)

**Character:** One neutral grotesque at confident weights, with mono reserved for measurements so figures read as evidence.

### Hierarchy
- **Display** (600, fluid 2.75rem to 5.25rem, line-height 1, -0.035em): the name in the hero only.
- **Headline Large** (600, 2.25rem, 1.25, -0.025em; 1.5rem on mobile for the lead project, 3rem and line-height 1 for the emphasized Contact title): the lead project title and the closing section title. Reserved; one of each per page.
- **Headline** (600, fluid 1.375rem to 1.75rem, 1.2, -0.02em): section titles in the margin column; the current job title; the project-page h1 below sm.
- **Lead** (400, fluid 1.125rem to 1.375rem, 1.5, muted in the hero): role phrase under the name; first About paragraph; project short description (ink on the home page, muted on the project page).
- **Title** (600, 1.125rem): prior job titles, education programs, secondary project titles, project-page block headings.
- **Body** (400, 1rem to 1.125rem, relaxed, capped at 60-65ch): prose.
- **Label** (500, 0.875rem): links, buttons, form labels, nav; sentence case. Skill category headings are 0.875rem semibold.
- **Data** (Geist Mono, 0.75rem): date ranges, skill level words, the project status line, the "studying since" year.

### Named Rules
**The Mono Is Data Rule.** Geist Mono is for dates, levels, status and years only, never headings or prose.

**The Level-As-Weight Rule.** Skill confidence is conveyed by weight and tone (semibold, medium, regular muted, italic muted). Skills are grouped by level within each category and the level word is printed once per group, in the left column of the group's row.

Tabular numerals (`.tabular`) wherever figures align. Headings use `text-wrap: balance`.

## Layout

A single `max-w-5xl` container with 16px (24px from sm) side padding. The fixed header is the `--header-h` token (4rem); `section[id]` scroll-margin-top uses the same token so a section's top rule lands under the header's own border, and the nav's JS scroll offset is that same 64px.

Home sections are a ruled band (`border-t`) containing a grid: 13rem title column plus fluid content at lg, stacked below, with the title sticky at `top-24`. Section padding comes from a density prop: tight 40px (56px from sm) for Skills and Education, default 56px (80px) for About and Experience, roomy 64px (112px) for Projects and Contact. The hero has no top rule and sits at the top with 112px (144px from sm) of top padding; it is a fluid column plus a 16rem portrait column at lg (portrait first and 160-224px wide on small screens).

Projects: the lead project has no top rule of its own (the section rule is above it) and carries the architecture diagram; secondary projects sit in a two-column grid from md (40px column gap, 48px row gap), each with a 1px top rule and 24px padding. Project pages use a fluid column plus a 15rem sticky facts aside, blocks separated by a top rule. Definition-list rows use 12px vertical padding with a bottom rule; label columns are 7rem (hero facts), 11rem (About), 6.5rem (Skills levels). The footer is one row from md (name and year left, three links right), stacked below. Gaps cluster on 8, 16, 24, 40-48px.

## Elevation & Depth

Flat. There are no shadows and no gradients on the site pages. Depth is conveyed only by rules and the header's border appearing after 24px of scroll. The header is opaque paper, not blurred. The one overlay, the certificate viewer, sits over a 60% black scrim with a bordered paper panel.

### Named Rules
**The Flat-Always Rule.** No box-shadow, no blur, no glow on page surfaces; state changes use underline color, opacity, or a raised-paper fill.

## Shapes

One 3px radius (`rounded-ui`) on buttons, fields, icon controls, the portrait, diagram boxes and the modal. Everything else is square-cornered rules. The portrait is a 4:5 rectangle with a hairline border. No pills or circles on UI controls.

Raster brand assets are flat, with no gradient: the favicon and Apple icon are a solid teal (`#0f6f73`) tile carrying a white "O" / "OM" monogram, and the social card is a flat blue-black ground (`#0d1117`) with a lighter teal (`#5fd0d3`) accent bar. These hex values live in the image routes, not in the CSS tokens.

## Components

### Buttons
- **Primary:** teal fill, on-teal text, 3px radius, 44px min height, 20-24px horizontal padding, 14px medium label; hover drops opacity to 0.9; disabled 0.6 opacity with wait cursor. One per view (Download CV, Send message). Download CV carries a leading down-arrow glyph as a download cue.
- **Text link:** ink, medium 14px, 2px underline in hairline color with 4px offset; hover turns the underline teal. Used for GitHub, Contact, email, project links.

### External Link
One component, `ExternalLink`, owns the outbound arrow: it opens in a new tab, renders a 14px up-right arrow inline with the last word (so it never strands on wrap) and a screen-reader "(opens in a new tab)". Internal links, including the project write-up link, anchors and mailto, carry no arrow.

### Navigation
Fixed opaque header, 64px (`--header-h`). Name at left, six anchor links, GitHub icon control and theme toggle at right. Inactive links muted; active link ink, medium, with a 2px teal underline (scroll-spy at a 35% probe line). Below md, a 44px menu control opens a ruled list with 48px rows; Escape closes it.

### Inputs / Fields
- **Style:** paper fill, 1px field-stroke (`rule-strong`) border, 3px radius, 12px padding, 16px text; labels above in 14px medium.
- **Focus:** global 2px teal outline with 3px offset (1px inside fields).
- **Error / Success:** danger or success colored 14px medium text in live regions.

### Ruled Definition List
The recurring signature: label in muted, value in ink, rows separated by hairlines. Used for hero facts, About facts, skills (level label in mono, names beside it) and project facts.

### Project Entry
Not a card. Title, then one mono muted status line directly beneath (every project, so status never depends on wrapping), then description, "Problem solved", the technology list, and a row of links. The lead project is larger and has no top rule; secondary projects have a hairline above.

### Architecture Diagram
A ruled, typographic diagram of the multi-tenant portal, shown in the lead project block and on the tenant project page. Labels come from the project copy: frontends, an edge-only gateway, five services, and RabbitMQ. Boxes are 1px field-stroke rectangles (3px radius, 8px by 12px padding); the gateway box is 2px teal. Connectors are 1px vertical rules in field-stroke, 16px tall. Services sit in a 2-column grid, 5 from sm. A small muted caption states the diagram is drawn from project notes.

### Icon Control
44px square, hairline border, 3px radius, ink glyph, raised-paper fill on hover.

## Do's and Don'ts

### Do:
- **Do** put grouping in hairline rules and the left-margin title column.
- **Do** keep teal to the primary action, focus, active nav, link-hover underline, and the diagram gateway.
- **Do** route every outbound link through `ExternalLink`; keep internal links arrow-free.
- **Do** use `rounded-ui` (3px) for every control and set mono type only for data.
- **Do** use `border-field` (rule-strong) for form and diagram strokes; leave the hairline as the default.
- **Do** set section rhythm with the density prop and reserve `emphasis` for the closing section.
- **Do** keep 44px minimum hit targets and honor `prefers-reduced-motion`.
- **Do** derive hero facts from `data/` so the first screen stays true.

### Don't:
- **Don't** use shadows, gradients, glow, glass, or backdrop blur on any surface; a card is a flat tint, a border and a radius.
- **Don't** nest a Card inside a Card, or lay out identical cards with no hierarchy (one featured card leads; the rest are quieter).
- **Don't** put icons in rounded tiles, or fill a card with pill badges or eyebrow chips.
- **Don't** add pills, badges, status dots, or icon tiles.
- **Don't** introduce a second accent or a second radius.
- **Don't** set Geist Mono on headings or prose.
- **Don't** repeat the level word on every skill row or put an arrow on a link that stays on the site.
