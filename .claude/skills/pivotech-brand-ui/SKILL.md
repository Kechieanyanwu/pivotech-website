---
name: pivotech-brand-ui
description: Apply Pivotech's existing brand and product design patterns to website work.
---

# Pivotech brand and UI

Use this skill when creating or editing member-facing or admin website UI.

## Existing site language

- Use the existing palette and typography defined in `app/globals.css`; the member admin uses warm beige `#f4eee1`, deep navy `#16203a`, blue `#2d4bd4`, light blue `#7fa0e8`, and restrained gold `#e2ae63`.
- Use the site's Newsreader display face and Hanken Grotesk body face. Keep display copy editorial and concise.
- Prefer quiet borders, generous whitespace, clear labels, and useful empty/loading/error states over dense dashboard chrome.
- The member area is an internal tool: make privacy status and the sign-out action visible without presenting it as public marketing content.

## Accessibility and responsive behavior

- Use semantic headings, labels, buttons, table/list structure, keyboard-focusable controls, and visible status feedback.
- Include accessible names for filters, toggles, diagrams, and icon controls.
- Make the directory, profile, and intersection view usable on narrow screens; no essential data should require hover.
- Keep color contrast readable and do not use color as the only signal for status.

## Implementation

- Reuse the current Next.js App Router conventions and existing site styles.
- Avoid new dependencies for small admin interactions.
- Do not alter the public site's branding or layout as a side effect of admin work.
