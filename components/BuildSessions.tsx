/* Hatched placeholder image used for each session card */
function HatchedPlaceholder({ blurred }: { blurred?: boolean }) {
  return (
    <div
      className="h-24 rounded-[7px] mb-4"
      style={{
        background:
          "repeating-linear-gradient(135deg,rgba(22,32,58,.06),rgba(22,32,58,.06) 8px,rgba(22,32,58,.11) 8px,rgba(22,32,58,.11) 16px)",
        filter: blurred ? "blur(1px)" : "blur(0.4px)",
      }}
    />
  );
}

const sessions = [
  // {
  //   name: 'Social sports app',
  //   description: 'Bringing people together around the games they love. Coming soon.',
  //   blurred: false,
  //   opacity: 0.72,
  // },
  {
    name: "In stealth",
    description: "To be launched at Demo Day.",
    blurred: true,
    opacity: 0.55,
  },
  {
    name: "In stealth",
    description: "To be launched at Demo Day.",
    blurred: true,
    opacity: 0.55,
  },
  {
    name: "In stealth",
    description: "To be launched at Demo Day.",
    blurred: true,
    opacity: 0.55,
  },
];

export default function BuildSessions() {
  return (
    <section
      id="build-sessions"
      className="bg-beige px-6 md:px-12 pt-4 pb-16 md:pb-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2
          className="font-serif font-normal text-navy text-center mb-1"
          style={{
            fontSize: "clamp(52px, 7vw, 82px)",
            lineHeight: 0.98,
            letterSpacing: "-0.01em",
          }}
        >
          What will you{" "}
          <em className="italic" style={{ color: "#e2ae63" }}>
            build?
          </em>
        </h2>

        <div className="mt-10 mb-7">
          <h3 className="font-sans text-[13px] font-semibold tracking-[0.14em] uppercase text-navy/45">
            Products launched from the community
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="border border-dashed rounded-[10px] p-6"
              style={{
                borderColor: "rgba(22,32,58,0.3)",
                opacity: s.opacity,
              }}
            >
              <HatchedPlaceholder blurred={s.blurred} />
              <span
                className="inline-block font-sans text-[11px] font-semibold tracking-[0.1em] uppercase rounded-[20px] px-[9px] py-1 mb-3"
                style={{
                  background: "rgba(22,32,58,0.1)",
                  color: "rgba(22,32,58,0.65)",
                }}
              >
                In development
              </span>
              <h4
                className="font-serif font-normal text-navy text-[21px] mb-1.5"
                style={s.blurred ? { filter: "blur(3px)" } : undefined}
              >
                {s.name}
              </h4>
              <p className="font-sans text-[14px] text-navy/60">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
