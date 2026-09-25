import { CONVERSATIONS_LINK, LINKEDIN, SUBSTACK } from "@/app/config";

export const defaultPillars = [
  {
    verb: "Connect",
    body: "Salon sessions where technologists and builders share what they're learning, building, and envisioning.",
  },
  {
    verb: "Build",
    body: "Structured sessions and space to move you from idea to shipped product.",
  },
  {
    verb: "Accelerate",
    body: "Individual and small-group advisory for founders and builders navigating product strategy, go-to-market, team formation, and execution.",
  },
  {
    verb: "Be Inspired",
    body: "The written, spoken, and visual record of what and how technologists are building and thinking.",
  },
];
export const defaultSettings = {
  linkedin: LINKEDIN,
  substack: SUBSTACK,
  calendar: CONVERSATIONS_LINK,
  stats: [
    { number: "47", label: "builders in the community" },
    { number: "3", label: "products shipped" },
    { number: "6", label: "sessions run" },
  ],
};
export type SiteSettings = typeof defaultSettings;
export type CommunityProject = {
  id: string;
  name: string;
  description: string;
  status: "development" | "launched";
  stealth: boolean;
  href?: string | null;
  image?: { url: string; alt: string } | null;
};
export const defaultProjects: CommunityProject[] = [
  {
    id: "project-tennis",
    name: "In stealth",
    description: "Making tennis playing more social and fun.",
    status: "development",
    stealth: true,
  },
  {
    id: "project-loyalty",
    name: "In stealth",
    description: "Building a more thoughtful way to reward customer loyalty.",
    status: "development",
    stealth: true,
  },
  {
    id: "project-plans",
    name: "In stealth",
    description:
      "Making it easier to turn “we should hang out” into actual plans.",
    status: "development",
    stealth: true,
  },
];
