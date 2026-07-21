import { essays, NEXT_EVENT } from "@/app/config";

export default function EventAndWriting() {
  return (
    <section
      id="event"
      className="border-t border-navy/12 grid grid-cols-1 md:grid-cols-2"
    >
      {/* Next Event */}
      <div className="px-8 md:px-12 py-12 md:border-r border-navy/12">
        <span className="font-sans text-[15px] font-semibold tracking-[0.14em] uppercase text-blue">
          Next event
        </span>
        <h2 className="font-serif font-normal text-navy text-[32px] mt-3.5 mb-3">
          Conversations with Technologists — 17 September 2026
        </h2>
        <p className="font-sans text-[15px] text-navy/65 mb-[18px]">
          Our cozy, semi-formal salon where curious technologists share what
          they&apos;re learning and building. Come join us.
        </p>
        <a
          href={NEXT_EVENT}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-semibold text-navy flex items-center gap-2 hover:text-blue transition-colors"
        >
          Join us <span>→</span>
        </a>
      </div>

      {/* Latest Writing */}
      <div className="px-8 md:px-12 py-12">
        <span className="font-sans text-[15px] font-semibold tracking-[0.14em] uppercase text-blue">
          Latest writing
        </span>
        <div className="mt-4 flex flex-col gap-3.5">
          {essays.map((e, i) => (
            <a
              key={i}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-[20px] text-navy hover:text-blue transition-colors pb-3.5 border-b border-navy/12 last:border-b-0"
            >
              {e.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
