# Content sources

## Events

Luma is the source of event titles, dates, end times, registration links, and cancellations. The public calendar subscription is configured in `app/config.ts`. No API key or paid Luma API is required.

The server parses ICS with ical.js and caches **validated** results in the Next.js Data Cache for 12 hours (the feed's advertised interval). Failed background refreshes preserve the previous cache value. A cold-cache failure uses the two verified launch events; these expire like normal events. A successful empty feed is authoritative and never replaced with seed data. The fallback is a snapshot and cannot know about subsequent cancellations while Luma is unreachable.

The homepage uses five-minute, request-driven revalidation to age out events independently of feed refresh. The first visit after the interval may receive the previous page while regeneration runs; subsequent requests receive the refreshed page. This is not a background scheduler and an already-open browser tab does not update itself.

Luma's current feed exports UTC dates without city labels or original timezone names. `eventLocations` in `lib/events.ts` annotates stable feed UIDs with the city and IANA timezone. Add an annotation for a new event; unannotated events still appear, labelled "Location on Luma", with explicitly labelled UTC times. Sanity will eventually manage these annotations, without duplicating Luma's date fields. Never infer a venue from coordinates: Luma may deliberately obscure it.

Timed events remain listed until DTEND; without DTEND they remain through the local calendar day. All-day events show "Time to be announced" and respect exclusive DTEND semantics. TENTATIVE events are displayed (Luma currently marks all entries this way); CANCELLED entries are excluded. Recurring and floating-time feed formats require explicit support and currently fail validation to retain cached data rather than display misleading times.

## Verification

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Verify the homepage at desktop/mobile widths and that each city links to the corresponding registration page. Date behavior is tested with fixed clocks, independent of the real date.

## Writing

Substack remains the publisher. The site reads `https://pivotech.substack.com/feed` on the server, normalizes titles/HTTPS article URLs/publication dates, deduplicates canonical URLs and shows the latest three non-future entries. This includes article/podcast posts exposed by the publication's RSS, not Substack Notes, private feeds or scraped paywalled bodies.

Validated entries use Next's persistent cache with hourly request-driven refresh. A failed refresh retains the last good result. With no successful cache, the page shows a publication link rather than the old hardcoded essays. A valid empty feed shows the same neutral fallback. The five-minute page cache can add another refresh interval before updated feed data is visible; this is not an exact hourly background schedule.
