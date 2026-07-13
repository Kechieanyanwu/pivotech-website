import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsRibbon from "@/components/StatsRibbon";
import Ecosystem from "@/components/Ecosystem";
import BuildSessions from "@/components/BuildSessions";
import EventAndWriting from "@/components/EventAndWriting";
import Merch from "@/components/Merch";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsRibbon />
        <FadeIn>
          <Ecosystem />
        </FadeIn>
        <FadeIn>
          <BuildSessions />
        </FadeIn>
        {/* TODO: Add CWT Sessions component */}
        <FadeIn>
          <EventAndWriting />
        </FadeIn>
      </main>
      {/* <Merch /> */}
      <Footer />
    </>
  );
}
