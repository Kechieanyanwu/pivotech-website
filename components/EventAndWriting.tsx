import { SUBSTACK, CONVERSATIONS_LINK } from "@/app/config";
import { type CommunityEvent, eventDate, eventTime } from "@/lib/events";
import type { Post } from "@/lib/posts";
import Link from "next/link";
import { defaultHomepage, type HomepageCopy } from "@/content/homepage";

export default function EventAndWriting({ events, posts, content = defaultHomepage }: { events: CommunityEvent[]; posts: Post[]; content?: HomepageCopy }) {
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

        <p className="font-sans text-[15px] text-navy/65 mb-[18px]">
          {content.eventIntro}
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
        <p className="mt-4 font-sans text-[15px] text-navy/70">Something to share with the room?{" "}
          <Link href="/submit?type=talk" className="inline-flex min-h-11 items-center font-semibold text-blue hover:underline">Submit a talk →</Link>
        </p>
      </div>

      {/* Latest Writing */}
      <div className="px-8 md:px-12 py-12">
        <span className="font-sans text-[15px] font-semibold tracking-[0.14em] uppercase text-blue">
          Latest writing
        </span>
        <div className="mt-4 flex flex-col gap-3.5">
          {posts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-[20px] text-navy hover:text-blue transition-colors pb-3.5 border-b border-navy/12 last:border-b-0"
            >
              {post.title}
              <time dateTime={post.publishedAt} className="mt-2 block font-sans text-sm text-navy/60">
                {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(post.publishedAt))}
              </time>
            </a>
          ))}
        </div>
        {posts.length === 0 && <p className="mt-4 font-sans text-navy/65">Explore our latest stories and conversations on Substack.</p>}
        <a href={SUBSTACK} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-sans text-sm font-semibold text-blue hover:underline">
          Read all posts <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
