const stats = [
  { number: "47", label: "builders in the community" },
  { number: "3", label: "products shipped" },
  { number: "5", label: "sessions run" },
];

function StatItems() {
  return (
    <>
      {stats.map((s) => (
        <div key={s.label} className="shrink-0">
          <b className="font-bold">{s.number}</b>{" "}
          <span className="text-beige/60">{s.label}</span>
        </div>
      ))}
    </>
  );
}

function EventItem() {
  return (
    <div className="shrink-0 font-semibold">
      Next Event: <span className="text-beige/55 font-normal"></span>
      Conversations with Technologists · 17 September · London
    </div>
  );
}

function MobileStatGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="stats-ribbon__group" aria-hidden={ariaHidden || undefined}>
      <StatItems />
      <EventItem />
    </div>
  );
}

export default function StatsRibbon() {
  return (
    <div className="bg-dark-navy text-beige font-sans text-[15px]">
      <div
        className="overflow-hidden py-5 md:hidden"
        aria-label="47 builders in the community, 3 products shipped, 5 sessions run, Next Event: Conversations with Technologists, 17 September, London"
      >
        <div className="stats-ribbon__track">
          <MobileStatGroup />
          <MobileStatGroup ariaHidden />
        </div>
      </div>

      <div className="hidden items-center gap-10 px-12 py-5 md:flex">
        <StatItems />
        <div className="ml-auto">
          <EventItem />
        </div>
      </div>
    </div>
  );
}
