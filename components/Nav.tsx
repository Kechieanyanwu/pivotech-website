const PivotechIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-label="Pivotech" role="img">
    <rect width="40" height="40" fill="#0D1B5E" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#F5F0E8"
      fontFamily="Georgia, serif"
      fontSize="18"
      fontWeight="700"
    >
      P.
    </text>
  </svg>
)

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-navy px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo — links to top of page */}
        <a href="#top" aria-label="Back to top">
          <PivotechIcon />
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
