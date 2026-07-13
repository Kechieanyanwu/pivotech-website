const pillars = [
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

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="bg-beige px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-[20px] font-semibold tracking-[0.16em] uppercase text-navy/50 mb-9">
          The ecosystem
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 border border-navy/12 rounded-xl overflow-hidden"
          style={{ gap: "1px", background: "rgba(22,32,58,0.12)" }}
        >
          {pillars.map((p) => (
            <div key={p.verb} className="bg-beige p-8">
              <div
                className="font-serif text-[44px] leading-none mb-2.5"
                style={{ color: "var(--color-navy)" }}
              >
                {p.verb}
              </div>
              <p className="font-sans text-[15px] text-navy/65 max-w-[340px]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
