import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TALK_FORM } from "@/app/config";

export const metadata: Metadata = {
  title: "Submit a talk — Pivotech",
  description: "Share what you’re building, learning, or curious about at Conversations with Technologists. Propose a talk for a future Pivotech salon.",
  alternates: { canonical: "/submit" },
};

// Both /submit and /submit?type=talk show the single active form. A selector is
// deliberately deferred until there is a second approved form (issue #7).
export default function SubmitPage() {
  return <>
    <Nav />
    <main id="top" className="px-5 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/#event" className="inline-flex min-h-11 items-center text-sm font-semibold text-blue hover:underline">← Upcoming conversations</Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-blue">Conversations with Technologists</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-navy md:text-6xl">What would you share with the room?</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/75">Propose a talk about something you’re building, learning, or curious about. Our salons bring technologists together for 15-minute presentations, questions, and conversation.</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-navy/75">A product, a research question, a side project, or a lesson from your work: tell us what you’d like to share and why it matters to you.</p>
        <div className="mt-8 rounded-xl border border-navy/15 p-5 md:p-6">
          <h2 className="font-serif text-2xl text-navy">Submit a talk</h2>
          <p className="mt-2 leading-relaxed text-navy/70">Use the form below to send your proposal to Pivotech. The team will review it and follow up about next steps.</p>
          <p className="mt-3 text-sm leading-relaxed text-navy/60">This form is hosted by Google Forms. Your answers are sent to the Pivotech form owner.</p>
          <a href={TALK_FORM.href} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-blue hover:underline">
            Open form directly <span aria-hidden="true">↗</span>
          </a>
        </div>
        <iframe
          src={TALK_FORM.embedUrl}
          title="Pivotech talk submission form"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="mt-8 h-[2200px] w-full rounded-xl border-0 bg-white sm:h-[1850px]"
        />
        <p className="mt-5 text-sm leading-relaxed text-navy/65">If the form doesn’t load or you prefer a separate window, <a href={TALK_FORM.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue underline">open the talk submission form directly</a>.</p>
      </div>
    </main>
    <Footer />
  </>;
}
