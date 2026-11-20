---
name: pivotech-member-data
description: Maintain Pivotech's private member directory and Google Sheets data integration.
---

# Pivotech member data

Use this skill when changing `/admin/members`, its APIs, the member spreadsheet, or interest classification.

## Source of truth

- The Google Sheet is the source of truth. The current People tab contains one row per person; event registration history remains in the original event exports and Event Registrations tab.
- Match members using the durable Person ID from People. Email is the initial identity key, not a permanent ID.
- Never rewrite raw event export tabs or silently merge ambiguous identities. Surface missing or conflicting identity data for review.
- Member Interests is an append-only history: Person ID, Tag, Category, Source, Status, Evidence, Updated At. The latest record for a person/tag controls its current state.
- Member Interactions is an append-only log for notes, introductions, and follow-ups. Keep each interaction attached to a Person ID and retain its date, summary, and follow-up state.

## Privacy and access

- Member profiles and API responses are private and require the admin session.
- Google service account credentials stay server-side and are never named `NEXT_PUBLIC_*`.
- Do not log member rows, emails, notes, credentials, or profile answers.
- Keep authentication checks in both page entry points and API handlers. Reject cross-origin writes.
- Read spreadsheet rows live; do not bake member data into the repository or client bundle.

## Interest classification

- Keep machine-generated suggestions labeled as drafts until an admin confirms them.
- Base suggestions on profile text and include a short evidence phrase when persisting them.
- Allow admins to add custom interests and dismiss suggestions. Preserve the action history rather than overwriting prior records.
- Avoid sensitive or high-impact inferred traits. Keep categories to interests, roles, strengths, and what someone is looking for.

## Changes

- Preserve existing People column meaning and Person IDs.
- When adding a new data source, prevent duplicate imports using stable source and row identifiers, and retain each original response.
- Document any required environment variables in `.env.example` without putting actual secrets there.
