const programmes = [
  {
    number: '01',
    title: 'Conversations with Technologists',
    body: "Private salons where builders share what they're learning and making.\nHosted in London. By invitation and application.",
    cta: 'Speak at CWT →',
    href: 'https://kechiea.notion.site/2c78507307af802989b7d9262acff624?pvs=105',
  },
  {
    number: '02',
    title: 'Build Sessions',
    body: 'Small, multidisciplinary teams. A weekend. Something real at the end.\nNot a hackathon. Co-creation.',
    cta: 'Join a Build Session →',
    href: 'https://lu.ma/zoakgigp',
  },
  {
    number: '03',
    title: 'Demo Days',
    body: 'What got built, gets shown. Open to builders, investors, and collaborators.\nNext: July 2026.',
    cta: 'Get notified →',
    href: 'https://kechiea.notion.site/3008507307af807abb8ed15918ff155d?pvs=105',
  },
]

export default function WhatWeDo() {
  return (
    <section className="bg-cream py-section-m md:py-section px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <p className="font-sans text-steel text-xs uppercase tracking-[0.3em] mb-16">
          What we do
        </p>

        {/* Three programmes */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {programmes.map((p) => (
            <div key={p.number}>
              {/* Blue dot marker */}
              <span className="block w-2 h-2 rounded-full bg-steel mb-6" />
              <span className="font-sans text-steel text-xs tracking-widest">{p.number}</span>
              <h3 className="font-serif text-navy text-2xl font-semibold mt-2 mb-4 leading-snug">
                {p.title}
              </h3>
              <p className="font-sans text-navy/70 text-base leading-relaxed mb-6 whitespace-pre-line">
                {p.body}
              </p>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans text-navy text-sm uppercase tracking-widest border border-navy px-4 py-2 hover:bg-navy hover:text-cream transition-colors"
              >
                {p.cta}
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
