# Pivotech website

Next.js App Router, TypeScript, Tailwind CSS and Framer Motion, with optional Sanity editing.

## Development

```sh
npm install
npm run dev -- --port 3001
```

Open http://localhost:3001. Use Node.js 22.12 or later for the Sanity tooling.

## Checks

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Content

- Upcoming conversations use the public Luma iCalendar feed with local/CMS city annotations.
- Latest writing comes from the Pivotech Substack RSS feed.
- `/submit` embeds the existing Google Forms speaker-submission form.
- Without Sanity configuration, the website uses the approved local content in `content/`.

See [content sources and caching](docs/content-sources.md) and [Sanity setup, activation and rollback](docs/sanity-setup.md). No CMS account or dataset is provisioned by installing this repository. The photo gallery and multi-form selector remain backlog work.

Read the bundled Next.js documentation specified in AGENTS.md before changing framework code. Next.js and React were updated with the Sanity foundation; see the setup guide for remaining upstream CLI dependency advisories and activation checks.
