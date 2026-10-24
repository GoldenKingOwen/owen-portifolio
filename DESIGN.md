---
name: Owen Matola Portfolio
description: A ruled engineering record. Cool paper, near-black ink, one signal-teal accent, hairlines for structure and one flat Card for grouped content.
colors:
  paper: "oklch(0.985 0.003 250)"
  paper-raised: "oklch(0.96 0.004 250)"
  paper-raised-hover: "color-mix(in oklch, oklch(0.96 0.004 250), oklch(0.2 0.015 255) 5%)"
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
  night-raised-hover: "color-mix(in oklch, oklch(0.21 0.014 255), oklch(0.94 0.008 250) 6%)"
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
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  card-title-featured:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.35vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
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
  card-padding: "20px"
  card-padding-sm: "24px"
  card-padding-featured: "24px"
  card-padding-featured-sm: "32px"
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
  card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.ui}"
    padding: "20px"
  card-interactive-hover:
    backgroundColor: "{colors.paper-raised-hover}"
  card-featured:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title-featured}"
    rounded: "{rounded.ui}"
    padding: "24px"
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

One accent, signal teal, appears only where something is actionable or focused (plus one structural marker in the architecture diagram and the featured card's top border). Everything else is ink on paper, with weight and tone (not chips or badges) carrying hierarchy. Geist does all the talking; Geist Mono appears only for data.

Rhythm varies by purpose rather than repeating one block: reference lists (Skills, Education) run tight, the work (Projects) and the close (Contact) run roomy, and only the closing section gets a larger title. Inside a section, hierarchy comes from one featured card leading and quieter default cards following.

**Key Characteristics:**
- Hairline rules and the single Card component are the only containers; no shadows, no gradients, no backdrop blur on any surface. The architecture diagram is outlined rules, never a Card.
- Cards are allowed, as ONE component (`components/ui/Card.tsx`): a flat tinted surface (`--bg-raised`), a 1px border, the single 3px radius, no shadow, no gradient, no blur. Still refused: nested cards (never a Card inside a Card), identical-card grids with no hierarchy, glow, gradients, glassmorphism and backdrop blur, shadows as decoration, icon-in-rounded-tile stacks, pill-badge clouds, and eyebrow chips.
- Section title sits in a left margin column (13rem), content in the right.
- One radius (3px), one accent, two themes switched by `data-theme` on `<html>`.
- Hit targets are at least 44px (`min-h-11`); focus is always visible.
- An arrow means the link leaves the site.

## Colors

Cool-neutral paper and near-black ink, hue 250-255, with a single teal signal. Values are OKLCH; the light set is the default and the night set flips via `data-theme="dark"`. In the stylesheet the roles are variables (`--bg`, `--bg-raised`, `--bg-raised-hover`, `--ink`, `--ink-muted`, `--rule`, `--rule-strong`, `--accent`, `--accent-ink`, `--danger`, `--success`) exposed to Tailwind as `background`, `raised`, `raised-hover`, `foreground`, `muted`, `border`, `field`, `accent`, `accent-ink`.

### Primary
- **Signal Teal** (`signal-teal`, night: `signal-teal-night`): primary action fill (Download CV, Send message), active-nav underline, link-hover underline (including the interactive card's title underline), focus ring, caret, selection, the 2px top border of a featured card, and the 2px gateway outline in the architecture diagram. Nothing else is teal.

### Neutral
- **Cool Paper** (`paper` / `night`): page ground, header, field fill (also inside a card), modal ground.
- **Raised Paper** (`paper-raised` / `night-raised`): the card surface, portrait placeholder behind the image, icon-control hover, certificate thumbnail surface and well.
- **Raised Paper Hover** (`paper-raised-hover` / `night-raised-hover`): the interactive card's hover surface (and the certificate thumbnail's). A `color-mix` of the card surface toward ink, 5% in light and 6% in dark. Flat; no filter or overlay.
- **Ink** (`ink` / `night-ink`): body and headings.
- **Muted Ink** (`ink-muted` / `night-ink-muted`): labels, secondary text, dates, project status line, inactive nav, card meta.
- **Hairline** (`rule` / `night-rule`): every divider and the card edge. It is the global default border color, declared in `@layer base` so a utility like `border-field` or `border-accent` overrides it.
- **Field Stroke** (`rule-strong` / `night-rule-strong`): form-field borders, architecture-diagram boxes and connectors, the interactive card's hover border and title underline, scrollbar thumb. Stronger than the hairline for non-text contrast. Computed exactly from the OKLCH tokens (OKLCH to linear sRGB to WCAG relative luminance): 3.78:1 against light paper and 4.85:1 against the night ground; on the card surface 3.51:1 light and 4.49:1 dark. All clear the 3:1 non-text floor.
- **Danger / Success** (`danger`, `success`, with night variants): form error and sent confirmation text only.

### Card surface contrast
Computed from the tokens the same way. Muted text on the card surface: 6.34:1 light, 7.15:1 dark; on the hover surface 5.65:1 light, 6.38:1 dark. Ink on the card surface: 16.12:1 light, 14.86:1 dark. The card edge (hairline against the page) is decorative at 1.37:1 light and 1.51:1 dark, and the tint step between page and card is 1.08:1: the card is identified by content and position, never by its edge alone, and the hairline must never be the only boundary of a control. Controls inside a card (form fields) carry their own field-stroke border.

### Named Rules
**The One Signal Rule.** Teal marks links-in-waiting, focus, and the single primary action per view. The only structural uses are the diagram's gateway outline and the featured card's top border, chosen during the redesign; revisit if wanted. If it is decorative, it is wrong.

**The Hairline Container Rule.** Grouping is a 1px rule above or below, or one Card. Never a box, fill, or shadow of any other kind. The architecture diagram is the single deliberate exception, because boxes are its content.

**The One Card Rule.** There is one card and it lives in `components/ui/Card.tsx`. A new grouped surface extends that component (slots, variant, modifier) rather than styling a second box.

## Typography

**Display / Body Font:** Geist (variable, with ui-sans-serif, system-ui)
**Data Font:** Geist Mono (with ui-monospace)

**Character:** One neutral grotesque at confident weights, with mono reserved for measurements so figures read as evidence.

### Hierarchy
- **Display** (600, fluid 2.75rem to 5.25rem, line-height 1, -0.035em): the name in the hero only.
- **Headline Large** (600, 2.25rem, -0.025em; 3rem from sm and line-height 1 for the closing section title, 1.25 for the project-page h1): the closing section title and the project-page h1 from sm. Reserved.
- **Card Title Featured** (600, 1.5rem, 1.875rem from sm, line-height 1.25, -0.025em): the title of a featured card (the lead project, the current role). One per section.
- **Headline** (600, fluid 1.375rem to 1.75rem, 1.2, -0.02em): section titles in the margin column; the project-page h1 below sm.
- **Lead** (400, fluid 1.125rem to 1.375rem, 1.5, muted in the hero): role phrase under the name; first About paragraph; the lead project's short description (ink).
- **Title** (600, 1.125rem, 1.375): the default card title; project-page block headings. Skill category, prior job and later education card titles step down to 1rem (600).
- **Body** (400, 1rem to 1.125rem, relaxed, capped at 60-65ch): prose; project-card description at 1rem; card secondary lines at 0.875rem muted.
- **Label** (500, 0.875rem): links, buttons, form labels, nav; sentence case.
- **Data** (Geist Mono, 0.75rem): the card meta line (project status, date ranges), skill level labels, the "studying since" year.

### Named Rules
**The Mono Is Data Rule.** Geist Mono is for dates, levels, status and years only, never headings or prose.

**The Level-As-Weight Rule.** Skill confidence is conveyed by weight and tone (semibold, medium, regular muted, italic muted). Within each skill card, skills are grouped by level and the level word is printed once per group, as a mono label stacked above the names.

Tabular numerals (`.tabular`) wherever figures align. Headings use `text-wrap: balance`.

## Layout

A single `max-w-5xl` container with 16px (24px from sm) side padding. The fixed header is the `--header-h` token (4rem); `section[id]` scroll-margin-top uses the same token so a section's top rule lands under the header's own border, and the nav's JS scroll offset is that same 64px.

Home sections are a ruled band (`border-t`) containing a grid: 13rem title column plus fluid content at lg, stacked below, with the title sticky at `top-24`. The content column carries `data-section-body`. Section padding comes from a density prop: tight 40px (56px from sm) for Skills and Education, default 56px (80px) for About and Experience, roomy 64px (112px) for Projects and Contact. The hero has no top rule and sits at the top with 112px (144px from sm) of top padding; it is a fluid column plus a 16rem portrait column at lg (portrait first and 160-224px wide on small screens).

Card grids use a 16px gap (24px from sm). Skills is a row-major grid of static cards, 1 column, 2 from sm, 3 from lg, with `items-start` so each card keeps its natural height and short groups never stretch into empty boxes. Projects stacks a featured interactive card at full width above a two-column grid from md of two default interactive cards. Experience and Education are `ol` grids, two columns from md; in Experience the current role (featured) spans both columns, in Education an entry with coursework or achievements spans both and plain ones pair up; their cards fill the row height. Contact is one card, max-width `xl`, 40px below the intro. Under Education, a collapsed certificates disclosure opens a 2/3/4-column grid (12px gap) of thumbnail buttons.

Inside a card: header is a column with a 4px gap, the body starts 16px below, the footer 20px below, footer links 24px apart. Project pages use a fluid column plus a 15rem sticky facts aside, blocks separated by a top rule. Definition-list rows use 12px vertical padding with a bottom rule; label columns are 7rem (hero facts) and 11rem (About). Skill levels inside a card are stacked rows separated by hairlines. The footer is one row from md (name and year left, three links right), stacked below. Gaps cluster on 8, 16, 24, 40-48px.

## Elevation & Depth

Flat. There are no shadows and no gradients on any surface. Depth is conveyed by one tonal step: the card surface sits one raised-paper step off the page (a 1.08:1 tint), edged by a hairline. An interactive card answers the pointer by moving its border to the field stroke and its surface to the hover tint in 150ms, with no transform. The header's border appears after 24px of scroll; the header is opaque paper, not blurred. The one overlay, the certificate viewer, sits over a 60% black scrim with a bordered paper panel.

### Named Rules
**The Flat-Always Rule.** No box-shadow, no blur, no glow on page surfaces; state changes use underline color, opacity, a border shift, or a raised-paper fill.

## Shapes

One 3px radius (`rounded-ui`) on buttons, fields, icon controls, cards, the portrait, diagram boxes and the modal. Everything else is square-cornered rules. The portrait is a 4:5 rectangle with a hairline border. No pills or circles on UI controls.

A card is a 1px hairline rectangle with the 3px radius. A featured card replaces its top edge with a 2px teal border; it keeps that border on hover and shifts only the other three edges to the field stroke.

Raster brand assets are flat, with no gradient: the favicon and Apple icon are a solid teal (`#0f6f73`) tile carrying a white "O" / "OM" monogram, and the social card is a flat blue-black ground (`#0d1117`) with a lighter teal (`#5fd0d3`) accent bar. These hex values live in the image routes, not in the CSS tokens.

## Components

### Buttons
- **Primary:** teal fill, on-teal text, 3px radius, 44px min height, 20-24px horizontal padding, 14px medium label; hover drops opacity to 0.9; disabled 0.6 opacity with wait cursor. One per view (Download CV, Send message).
- **Text link:** ink, medium 14px, 2px underline in hairline color with 4px offset; hover turns the underline teal. Used for GitHub, Contact, email, project links and the certificates disclosure toggle.

### Card
The one container component. A flat tinted surface that groups related facts so they can be scanned one group at a time.
- **Surface:** `--bg-raised`, 1px hairline border, 3px radius, no shadow, no gradient, no blur. Padding 20px (24px from sm). Rendered as `article` by default, `li` or `div` via `as` (the Contact form is a `div`).
- **Slots:** `CardHeader` (column, 4px gap), `CardTitle` (a real heading, `h3` under the section `h2`, 600 weight), `CardMeta` (one mono 12px muted line), `CardBody` (16px below the header, grows to fill), `CardFooter` (links row, 20px below the body, 24px column gap, wraps).
- **Variants:** `default` is static, with no hover. `interactive` gives the title one real link, stretched over the whole card with `::after` so there are never nested links; the title is underlined 2px in the field stroke (teal on hover). Hover moves the border to the field stroke and the surface to the raised-hover tint in 150ms (`transition-colors`), no transform. The focus ring is drawn on the card (2px teal outline, 4px offset) when the title link has keyboard focus (`has-[.card-link:focus-visible]`), not on the title text.
- **Featured modifier:** combinable with either variant. A 2px teal top border, 24px padding (32px from sm), and a larger title (1.5rem, 1.875rem from sm). One lead card per section. A featured interactive card keeps its teal top border on hover.
- **Footer behavior:** the footer row ignores the pointer (`pointer-events-none`) so empty space still activates the stretched title link; only anchors inside it take pointer events, and it sits above the stretched link (`z-10`).
- **Hooks:** every card carries `data-reveal` and `data-card` (`default`, `interactive`, `default-featured`, `interactive-featured`); Experience and Education cards add `data-entry`.
- **Use:** Skills (one static card per category); Projects (featured interactive portal card plus two default interactive cards); Experience (featured current role, quieter default cards); Education (one default card per qualification); Contact (the form in one card). About, hero and footer stay uncarded.
- **Never:** a Card inside a Card, identical cards with no featured lead or size hierarchy, icons in tiles, chips or pill badges inside a card.

### Project Card
A Card (`interactive`, featured for the lead) whose title link is the write-up link. Meta line is the project status in mono (every project, so status never depends on wrapping). Body: short description, a muted "Problem solved" line, the technology list as plain comma-separated text, and (for the lead) the architecture diagram. Footer: a visible "Read the write-up" cue (aria-hidden, not a second link; the stretched title link takes the click) followed by the source and live `ExternalLink`s as separate, labelled tab stops.

### External Link
One component, `ExternalLink`, owns the outbound arrow: it opens in a new tab, keeps the label's last word and the 14px up-right arrow together in one no-wrap span (so the arrow never strands on its own line when the label wraps) and adds a screen-reader "(opens in a new tab)". Internal links, including the project write-up link, anchors and mailto, carry no arrow.

### Navigation
Fixed opaque header, 64px (`--header-h`). Name at left, six anchor links, GitHub icon control and theme toggle at right. Inactive links muted; active link ink, medium, with a 2px teal underline (scroll-spy at a 35% probe line). Below md, a 44px menu control opens a ruled list with 48px rows; Escape closes it.

### Inputs / Fields
- **Style:** paper fill (the page ground, so a field inside the Contact card reads as a recess), 1px field-stroke (`rule-strong`) border, 3px radius, 12px padding, 16px text; labels above in 14px medium.
- **Focus:** global 2px teal outline with 3px offset (1px inside fields).
- **Error / Success:** danger or success colored 14px medium text in live regions.

### Ruled Definition List
The recurring signature outside cards: label in muted, value in ink, rows separated by hairlines. Used for hero facts, About facts and project-page facts. Inside a skill card the same pattern runs vertically (mono level label stacked over the names).

### Certificate Thumbnail
A button in the Education disclosure that borrows the card tokens (raised surface, hairline border, 3px radius, border to field stroke and surface to raised-hover over 150ms on hover) at 8px padding, holding a rasterized first page and a two-line title. It is not the Card component and not a Card slot; see the not-canonized note.

### Architecture Diagram
A ruled, typographic diagram of the multi-tenant portal, shown inside the lead project card and on the tenant project page. Labels come from the project copy: frontends, an edge-only gateway, five services, and RabbitMQ. Boxes are 1px field-stroke rectangles (3px radius, 8px by 12px padding); the gateway box is 2px teal. Connectors are 1px vertical rules in field-stroke, 16px tall. Services sit in a 2-column grid, 5 from sm. A small muted caption states the diagram is drawn from project notes. Its boxes are outlined rules, not Cards, so it does not break the no-nesting rule when placed in the lead card.

### Icon Control
44px square, hairline border, 3px radius, ink glyph, raised-paper fill on hover.

## Do's and Don'ts

### Do:
- **Do** group related facts in the one `Card` (`components/ui/Card.tsx`) and everything else in hairline rules and the left-margin title column.
- **Do** lead a card group with one featured card and let the rest be default cards of natural height; use `items-start` where card lengths differ.
- **Do** give an interactive card exactly one link, the title, stretched with `::after`; keep other links in `CardFooter`.
- **Do** keep teal to the primary action, focus, active nav, link-hover underline, the featured card's top border, and the diagram gateway.
- **Do** route every outbound link through `ExternalLink`; keep internal links arrow-free.
- **Do** use `rounded-ui` (3px) for every control and card, and set mono type only for data.
- **Do** use `border-field` (rule-strong) for form and diagram strokes and for the interactive card's hover border; leave the hairline as the default.
- **Do** set section rhythm with the density prop and reserve `emphasis` for the closing section.
- **Do** keep 44px minimum hit targets and honor `prefers-reduced-motion`.
- **Do** derive hero facts from `data/` so the first screen stays true.

### Don't:
- **Don't** use shadows, gradients, glow, glass, or backdrop blur on any surface; a card is a flat tint, a border and a radius.
- **Don't** nest a Card inside a Card, or lay out identical cards with no hierarchy (one featured card leads; the rest are quieter).
- **Don't** put icons in rounded tiles, or fill a card with pill badges, status dots or eyebrow chips.
- **Don't** transform, lift or shadow a card on hover; only border and surface color change.
- **Don't** rely on the card edge or tint to mark a control: the hairline (1.37:1 light, 1.51:1 dark) is decorative; controls carry the field stroke.
- **Don't** introduce a second accent, a second radius, or a second card style.
- **Don't** set Geist Mono on headings or prose.
- **Don't** repeat the level word on every skill name or put an arrow on a link that stays on the site.
