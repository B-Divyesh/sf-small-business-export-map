# Export Map — visual thesis

## Direction: the dependable print-room

Export Map uses a **risograph tactile collage** inspired by the moment a messy
spreadsheet becomes a labelled, accountant-ready packet. Layered paper,
registration marks, map-like routes, stamps, and two-ink overprints make data
transformation visible rather than magical. The interface itself stays precise:
the texture belongs at the edges and in the explanatory hero, while files,
columns, warnings, and actions remain calm and legible.

This is deliberately a warm, single-mode desk environment rather than a generic
software dashboard. Paper is the surface, near-black ink is the structure, coral
marks attention, and cobalt traces the safe route from source to recipient.

## Tokens

### Palette

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F4EBD8` | explicit app background |
| `paper-raised` | `#FFF9ED` | working surfaces and form controls |
| `ink` | `#20231F` | primary text and borders |
| `ink-muted` | `#5C6158` | secondary copy (7:1 on paper) |
| `cobalt` | `#1747A6` | links, focus, selected route |
| `cobalt-dark` | `#10357F` | interactive hover |
| `coral` | `#C64332` | warnings and physical registration marks |
| `moss` | `#2D6B4E` | passed checks and completion |
| `ochre` | `#8B5A12` | caution state |
| `danger` | `#A52D29` | errors and destructive actions |

All body-text pairs meet WCAG AA. Statuses always include an icon and words;
colour is never the only signal. The direction is intentionally single-mode:
the fixed warm paper ground is part of the tactile metaphor and avoids falsely
turning uploaded records into luminous dashboard data.

### Typography

- Display: Georgia, Cambria, `Times New Roman`, serif. Its editorial, slightly
  irregular forms evoke printed handoff packets without adding a font payload.
- Interface/data: `Avenir Next`, Avenir, Inter, `Segoe UI`, sans-serif. Tables
  use tabular numerals. System stacks keep the offline shell fast and private.
- Scale: 14 / 16 / 20 / 28 / clamp(36, 6vw, 68) px; body line height 1.55;
  reading measure at most 68 characters.

### Space and shape

- 4 px base rhythm; primary steps are 8, 12, 16, 24, 32, 48, and 72 px.
- Corners are restrained (6–16 px) and intentionally inconsistent only on
  collage pieces. Working controls use 8 px; the hero sheet uses 2 px.
- Borders are 1.5–2 px ink lines. Layering uses offset solid shadows, like a
  stack of paper, rather than soft SaaS drop shadows.
- Touch targets are at least 44×44 px. Desktop content caps at 1180 px; mobile
  stacks the workspace into one readable route and hides decorative scraps.

## Interaction grammar

The product is one continuous route: **File → Profile → Map → Review → Handoff**.
A stitched route rail shows the current stage. Uploaded source data stays on the
left (or first on mobile); the declared recipient requirement stays on the right.
Every transformation is written as a plain-language, reversible instruction,
and the preview exposes the result before download.

Primary buttons resemble cobalt ink labels with a 3 px offset ink shadow. Press
states pull the label onto the paper. Empty states use a dashed drop zone and a
single next action. Success uses a stamped result panel. Errors state the field,
the failing example, and a next step. Focus is a 3 px coral outer ring with a
2 px paper gap.

## Motion

UI transitions last 180–240 ms and affect only opacity and transform. New review
rows settle vertically from their source position; completed stages receive one
short stamp-scale emphasis. Nothing loops. With `prefers-reduced-motion`, all
movement is removed and state changes are conveyed instantly through text,
borders, and icons.

## Asset plan and provenance

### Hero illustration: `assets/src/export-route.png`

- Use case: `illustration-story`; landing/workspace header explanation.
- Subject: an overhead tactile paper collage of a CSV grid travelling along a
  cobalt route into a neatly clipped accountant handoff packet, with delimiter,
  decimal, and calendar symbols represented abstractly.
- World/materials: torn uncoated paper, masking tape, ink registration crosses,
  coarse halftone dots, imperfect two-pass riso overprint.
- Light/lens: flatbed-scan, top-down, nearly shadowless.
- Palette words: warm oat paper, carbon ink, cobalt blue, tomato coral, moss.
- Composition: landscape, action weighted right, generous quiet paper margins;
  no interface screenshot.
- Negative list: no readable text, no logos, no watermarks, no people, no hands,
  no currency/tax claims, no gradients, no glossy 3D, no photoreal laptop.
- Generation prompt (verbatim): “Editorial risograph paper collage, top-down
  flatbed scan. A messy grid of small paper cells travels along a clear cobalt
  blue map route and becomes a neatly clipped accountant handoff packet. Include
  abstract visual tokens for commas, decimal points, and calendar squares but no
  readable words. Torn warm oat stock, tomato-coral and cobalt two-ink overprint,
  carbon linework, moss-green approval stamp, coarse halftone texture, subtle
  misregistration, generous quiet margins, landscape composition, tactile and
  trustworthy. No people, no hands, no logos, no watermark, no readable text,
  no brand marks, no glossy 3D, no gradients, no laptop screen.”
- Generator: Azure AI Foundry factory image deployment via
  `/opt/fleet/lib/gen-image.sh`; generated 2026-08-28. Original project asset;
  output reviewed for text artefacts, symbols, seams, and misleading claims.
- Delivery: source PNG and prompt sidecar in `assets/src/`; responsive WebP in
  `public/assets/`, ≤300 KB. Generated imagery is disclosed in the footer.

Icons and status marks are hand-authored from CSS/Unicode primitives so they
remain sharp, accessible, and consistent with the ink-line system.
