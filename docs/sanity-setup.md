# Sanity setup and handover

The integration is prepared but **not activated**. No Sanity project, dataset, paid subscription, token, editor account or hosted Studio has been created. Until public project/dataset configuration exists, the website uses the approved local copy and event annotations without contacting Sanity.

## Sources of truth

- Luma: event titles, dates, end times, cancellation and registration links.
- Sanity: homepage copy and city/timezone annotations keyed by Luma feed UID. Broader homepage content is a follow-up.
- Substack: articles, exposed through RSS.
- Google Forms: talk submissions and notifications. Never store responses, private contacts or confidential project information in the public Sanity dataset.

## Owner setup

1. Create a Pivotech-owned project at https://www.sanity.io/manage and a public dataset named `production`. Record the owner and recovery/admin arrangements. Free is suitable for a pilot with Administrator/Viewer roles; reassess the plan if separate Editor permissions are required. Do not depend on temporary trial features.
2. Copy `.env.example` to `.env.local`. Set the project ID and dataset for both `NEXT_PUBLIC_SANITY_*` and `SANITY_STUDIO_*`. Those values are public identifiers, not secrets. Leave them unset to keep the local fallback.
3. Create a **Viewer** API token for previews and store it as `SANITY_API_READ_TOKEN` in local/hosting environment settings. Never give it a `NEXT_PUBLIC_` or `SANITY_STUDIO_` prefix. Do not paste tokens into tickets or commit them.
4. Set `SANITY_STUDIO_PREVIEW_URL` to the frontend origin (`http://localhost:3001` for the documented preview, then the approved deployed origin). Add the frontend and Studio origins under Sanity API CORS settings, allowing credentials only for those exact trusted origins. Do not use a wildcard.
5. Start the site with `npm run dev -- --port 3001` and the editor with `npm run studio:dev`. The singleton Homepage entry edits document `homepage`. Seed the approved copy and event annotations using the file below before editing; do not overwrite existing edited documents.
6. After sign-in and selecting the intended project, import `sanity/seed.ndjson` with `npx sanity dataset import sanity/seed.ndjson production --missing`. The stable IDs make repeated imports skip existing documents. Review the project/dataset before running a mutation. Keep production and test datasets distinct.
7. Deploy the Studio using `npm run studio:deploy` only after verifying ownership, access and the target hostname. This is a separate hosting step from the website. Configure the website environment on the chosen host and redeploy once to activate the adapter.

## Publishing and previews

Studio's Presentation tool enables draft mode through `/api/draft-mode/enable`, using next-sanity's validated preview handshake. Anonymous requests always query `perspective: published`; drafts use a server-only token, `perspective: drafts`, and no cache. Draft preview currently requires refreshing the preview after edits; click-to-edit overlays/live subscriptions are intentionally not implemented. The preview banner has an Exit preview action. Verify exiting preview works in the hosted Studio's iframe as well as a top-level tab before activation.

Create a webhook targeting `https://YOUR-WEBSITE/api/sanity/revalidate`, method POST, for create/update/delete of published content. Filter:

```groq
_type in ["homepage", "eventAnnotation"] && !(_id in path("drafts.**"))
```

Projection: `{_type}`. Keep draft events disabled. Generate a random signing secret and put the same value in the webhook secret setting and the website's server-only `SANITY_REVALIDATE_SECRET`. The handler rejects unsigned/invalid requests and unknown document types, then expires only the site-content cache. It does not accept a caller-selected URL/tag. The server queries Sanity directly (`useCdn: false`) to avoid CDN lag. Published content is also revalidated hourly as a backup; updates are request-driven, not a scheduled process.

## Before marking the CMS ticket complete

- Create the project, configure ownership/editor access, import the seed and verify a clean Studio build.
- Preview an unpublished wording change, confirm an anonymous browser cannot see it, then publish and verify the public page updates without redeployment.
- Verify unpublish/delete restores intended fallback behavior and city labels change without changing Luma's dates.
- Verify valid webhooks work; unsigned and wrong-secret requests are rejected without invalidating content.
- Verify invalid CMS values fail validation and cannot overwrite the cache with broken content; test provider outages and cold-cache fallback.
- Coordinate an editor handover and record who owns content review. Live authentication, successful webhooks and publishing cannot be verified until the real project exists.

## Backup and rollback

Before migration, export the dataset through Sanity's dataset export command and store it in a private owner-controlled location. Keep exports out of this repository. For a quick frontend rollback, unset the two `NEXT_PUBLIC_SANITY_*` settings and redeploy to restore local content. Retain the dataset and export; do not delete the project or reset edited content to roll back the frontend. Failed background refreshes retain the previous cached response; cold-cache failures use local content, which may be older than CMS edits.

Sources: https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router and https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs.

## Dependency verification

The foundation updates Next.js/eslint-config-next to 16.3.6 and React/React DOM to 19.2.8. The previously reported Next.js critical advisory is resolved. At preparation time, npm audit still reports 14 transitive findings (3 high, 11 moderate) in Sanity CLI/build dependencies (adm-zip, js-yaml, smol-toml, uuid and their dependants). Compatible fixes were applied; npm's remaining suggested fix downgrades Sanity across a major version and was not forced. Review upstream fixes before deploying the editor; these findings are not a claim that the public website exposes the affected CLI operations.
