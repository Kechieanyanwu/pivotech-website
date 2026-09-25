import Image from "next/image";
import { defaultProjects, type CommunityProject } from "@/content/community";

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

export default function BuildSessions({
  projects = defaultProjects,
  heading = "Products launched from the community",
}: {
  projects?: CommunityProject[];
  heading?: string;
}) {
  if (projects.length === 0) return null;
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
            {heading}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {projects.map((s) => (
            <div
              key={s.id}
              className="border border-dashed rounded-[10px] p-6"
              style={{
                borderColor: "rgba(22,32,58,0.3)",
                opacity: s.stealth ? 0.55 : 1,
              }}
            >
              {s.image && !s.stealth ? (
                <Image
                  src={s.image.url}
                  alt={s.image.alt}
                  width={800}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <HatchedPlaceholder blurred={s.stealth} />
              )}
              <span
                className="inline-block font-sans text-[11px] font-semibold tracking-[0.1em] uppercase rounded-[20px] px-[9px] py-1 mb-3"
                style={{
                  background: "rgba(22,32,58,0.1)",
                  color: "rgba(22,32,58,0.65)",
                }}
              >
                {s.status === "launched" ? "Launched" : "In development"}
              </span>
              <h4
                className="font-serif font-normal text-navy text-[21px] mb-1.5"
                style={s.stealth ? { filter: "blur(3px)" } : undefined}
              >
                {s.stealth ? "In stealth" : s.name}
              </h4>
              <p className="font-sans text-[14px] text-navy/60">
                {s.description}
              </p>
              {s.href && !s.stealth && (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center font-sans text-sm font-semibold text-blue hover:underline"
                >
                  Explore project →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
