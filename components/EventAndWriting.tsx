import { essays, CONVERSATIONS_LINK } from "@/app/config";
import { type CommunityEvent, eventDate, eventTime } from "@/lib/events";

export default function EventAndWriting({ events }: { events: CommunityEvent[] }) {
  return (
    <section
      id="event"
      className="scroll-mt-28 border-t border-navy/12 grid grid-cols-1 md:grid-cols-2"
    >
      {/* Next Event */}
      <div className="px-8 md:px-12 py-12 md:border-r border-navy/12">
        <span className="font-sans text-[15px] font-semibold tracking-[0.14em] uppercase text-blue">
          Upcoming conversations
        </span>
        <h2 className="font-serif font-normal text-navy text-[32px] mt-3.5 mb-3">
          A room full of possibilities.
        </h2>
        <p className="font-sans text-[15px] text-navy/65 mb-[18px]">
          Our cozy, semi-formal salon where curious technologists share what
          they&apos;re learning and building. Come join us.
        </p>
        <div className="mt-6 grid gap-4">
          {events.map((event) => (
            <article key={event.id} className="rounded-xl border border-navy/15 p-5">
              <p className="font-sans text-sm font-semibold uppercase tracking-wider text-blue">{event.city}</p>
              <h3 className="mt-2 font-serif text-2xl text-navy">{event.title}</h3>
              <p className="mt-2 font-sans text-[15px] text-navy/70">
                <time dateTime={event.start}>{eventDate(event)}</time>
                <span className="block mt-1">{eventTime(event)}</span>
              </p>
              <a href={event.href ?? CONVERSATIONS_LINK} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 font-sans font-semibold text-navy hover:text-blue">
                {event.href ? `Register for ${event.city === "Location on Luma" ? "this event" : event.city}` : "View event calendar"} <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
          {events.length === 0 && <p className="font-serif text-2xl text-navy">Next dates to be announced.</p>}
        </div>
        <a href={CONVERSATIONS_LINK} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-sans text-sm font-semibold text-blue hover:underline">
          View event calendar <span aria-hidden="true">→</span>
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
