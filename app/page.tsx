import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRibbon from "@/components/StatsRibbon";
import Ecosystem from "@/components/Ecosystem";
import BuildSessions from "@/components/BuildSessions";
import EventAndWriting from "@/components/EventAndWriting";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { getUpcomingEvents } from "@/lib/get-events";

// Re-check event expiry independently of the feed's 12-hour refresh interval.
export const revalidate = 300;

export default async function Home() {
  const events = await getUpcomingEvents();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsRibbon events={events} />
        <FadeIn>
          <Ecosystem />
        </FadeIn>
        <FadeIn>
          <BuildSessions />
        </FadeIn>
        {/* TODO: Add CWT Sessions component */}
        <FadeIn>
          <EventAndWriting events={events} />
        </FadeIn>
      </main>
      {/* <Merch /> */}
      <Footer />
    </>
  );
}
