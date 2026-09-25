import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRibbon from "@/components/StatsRibbon";
import Ecosystem from "@/components/Ecosystem";
import BuildSessions from "@/components/BuildSessions";
import EventAndWriting from "@/components/EventAndWriting";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { getUpcomingEvents } from "@/lib/get-events";
import { getLatestPosts } from "@/lib/get-posts";
import { getSiteContent } from "@/lib/sanity/content";

// Re-check event expiry independently of the feed's 12-hour refresh interval.
export const revalidate = 300;

export default async function Home() {
  const [content, posts] = await Promise.all([
    getSiteContent(),
    getLatestPosts(),
  ]);
  const locations = Object.fromEntries(
    content.annotations.map(({ eventUid, ...location }) => [
      eventUid,
      location,
    ]),
  );
  const events = await getUpcomingEvents(locations);
  return (
    <>
      <Nav />
      {content.preview && (
        <aside className="bg-navy px-6 py-3 text-center text-sm text-beige">
          {content.available
            ? "Draft preview · Refresh to see your latest edits."
            : "Draft content could not be loaded. Showing local fallback content."}{" "}
          <a href="/api/draft-mode/disable" className="font-semibold underline">
            Exit preview
          </a>
        </aside>
      )}
      <main>
        <Hero content={content.homepage} />
        <StatsRibbon events={events} stats={content.settings.stats} />
        <FadeIn>
          <Ecosystem pillars={content.homepage.pillars} />
        </FadeIn>
        <FadeIn>
          <BuildSessions
            projects={content.projects}
            heading={content.homepage.projectHeading}
          />
        </FadeIn>
        {/* TODO: Add CWT Sessions component */}
        <FadeIn>
          <EventAndWriting
            events={events}
            posts={posts}
            content={content.homepage}
            settings={content.settings}
          />
        </FadeIn>
      </main>
      {/* <Merch /> */}
      <Footer />
    </>
  );
}
