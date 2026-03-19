import Image from 'next/image'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-navy px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo — links to top of page */}
        <a href="#top" aria-label="Back to top">
          <Image src="/pivotech-icon.png" alt="Pivotech" width={40} height={40} />
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-4 md:gap-8">
          <a
            href="https://pivotech.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-cream/80 text-sm uppercase tracking-widest hover:text-cream transition-colors"
          >
            Substack
          </a>
          <a
            href="#engage"
            className="font-sans text-cream text-sm uppercase tracking-widest border border-cream/60 px-4 py-2 hover:border-cream transition-colors"
          >
            Partner with us
          </a>
        </div>
      </div>
    </nav>
  )
}
