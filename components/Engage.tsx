const cards = [
  {
    title: 'Speak',
    body: "Share what you're building.",
    cta: 'Apply to speak',
    href: 'https://kechiea.notion.site/2c78507307af802989b7d9262acff624?pvs=105',
  },
  {
    title: 'Attend',
    body: 'Join a session. Meet the people.',
    cta: 'Request an invite',
    href: 'https://kechiea.notion.site/3008507307af807abb8ed15918ff155d?pvs=105',
  },
  {
    title: 'Partner',
    body: 'Bring your tools, space, or support.',
    cta: 'View partner deck',
    href: 'https://kechiea.notion.site/Pivotech-Partner-Deck-3228507307af806ab2c8c171bb6d496c?pvs=74',
  },
]

export default function Engage() {
  return (
    <section id="engage" className="bg-white py-section-m md:py-section px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <p className="font-sans text-steel text-xs uppercase tracking-[0.3em] mb-16">
          GET INVOLVED
        </p>

        {/* Three cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="border border-navy/10 p-8 flex flex-col justify-between gap-6"
            >
              <div>
                <h3 className="font-serif text-navy text-2xl font-semibold mb-4">
                  {card.title}
                </h3>
                <p className="font-sans text-navy/70 text-base leading-relaxed">
                  {card.body}
                </p>
              </div>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans text-cream text-xs uppercase tracking-widest bg-navy px-6 py-3 hover:bg-navy/80 transition-colors self-start"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Blue dot divider below */}
        <span className="blue-dot mt-16 md:mt-24" />
      </div>
    </section>
  )
}
