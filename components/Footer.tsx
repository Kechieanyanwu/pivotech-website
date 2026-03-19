import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-navy py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Logo + location */}
          <div className="flex items-center gap-3">
            <Image src="/pivotech-icon.png" alt="Pivotech" width={32} height={32} />
            <span className="font-sans text-cream text-sm tracking-wide">Pivotech · London</span>
          </div>

          {/* Tagline */}
          <p className="font-serif text-cream/60 text-sm">
            For builders. For impact. For what comes next.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-6">
            <a
              href="https://pivotech.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-cream/70 text-sm hover:text-cream transition-colors"
            >
              Substack
            </a>
            <a
              href="https://linkedin.com/company/pivotech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-cream/70 text-sm hover:text-cream transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <p className="font-sans text-cream/40 text-xs text-center">
          © 2026 Pivotech
        </p>
      </div>
    </footer>
  )
}
