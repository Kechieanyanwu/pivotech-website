import { defaultPillars } from "./community";

export const defaultHomepage = {
  heroTitle: "Ambitious technologists.",
  heroAccent: "Impactful products.",
  heroIntro:
    "Pivotech is the ecosystem where ambitious technologists turn ideas into impact through conversations, build sessions, and a community that raises your ambition.",
  heroAudience:
    "We bring together technologists, founders, designers, and operators to learn, connect, and build impactful and commercially viable products.",
  eventHeading: "A room full of possibilities.",
  eventIntro:
    "Our cozy, semi-formal salon where curious technologists share what they're learning and building. Come join us.",
  pillars: defaultPillars,
  projectHeading: "Products launched from the community",
};
export type HomepageCopy = typeof defaultHomepage;
