import { type CommunityEvent, eventDate } from "@/lib/events";

const stats = [
  { number: "47", label: "builders in the community" },
  { number: "3", label: "products shipped" },
  { number: "6", label: "sessions run" },
];

export default function StatsRibbon({ events }: { events: CommunityEvent[] }) {
  const eventLabel = events.length
    ? `Upcoming: ${events.map((event) => `${event.city} · ${eventDate(event, true)}`).join(" / ")}`
    : "Next conversations: dates to be announced";
  const label = `${stats.map((stat) => `${stat.number} ${stat.label}`).join(", ")}. ${eventLabel}`;
  const items = <>
    {stats.map((stat) => <div key={stat.label} className="shrink-0">
      <b className="font-bold">{stat.number}</b>{" "}<span className="text-beige/70">{stat.label}</span>
    </div>)}
    <div className="font-semibold">{eventLabel}</div>
  </>;
  return (
    <div className="bg-dark-navy text-beige font-sans text-[15px]">
      <div className="overflow-hidden py-5 md:hidden">
        <p className="sr-only">{label}</p>
        <div className="stats-ribbon__track" aria-hidden="true">
          <div className="stats-ribbon__group">{items}</div>
          <div className="stats-ribbon__group stats-ribbon__duplicate">{items}</div>
        </div>
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-x-10 gap-y-3 px-12 py-5 md:flex">{items}</div>
    </div>
  );
}
