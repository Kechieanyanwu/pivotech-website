const stats = [
  { number: "47", label: "builders in the community" },
  { number: "3", label: "products shipped" },
  { number: "5", label: "sessions run" },
];

function StatGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="stats-ribbon__group" aria-hidden={ariaHidden || undefined}>
      {stats.map((s) => (
        <div key={s.label} className="shrink-0">
          <b className="font-bold">{s.number}</b>{" "}
          <span className="text-beige/60">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsRibbon() {
  return (
    <div className="bg-dark-navy text-beige font-sans text-[15px]">
      <div
        className="overflow-hidden py-5 md:hidden"
        aria-label="47 builders in the community, 3 products shipped, 5 sessions run"
      >
        <div className="stats-ribbon__track">
          <StatGroup />
          <StatGroup ariaHidden />
        </div>
      </div>

      <div className="hidden items-center gap-10 px-12 py-5 md:flex md:flex-nowrap">
        <StatGroup />
        <div className="ml-auto font-semibold">
          Next Event: Demo Day{" "}
          <span className="text-beige/55 font-normal">· 15 July · London</span>
        </div>
      </div>
    </div>
  );
}
