/* SVG track pattern used as background decoration */
function TrackPattern() {
  return (
    <svg
      viewBox="0 0 420 260"
      width="420"
      height="260"
      aria-hidden="true"
      preserveAspectRatio="xMaxYMid slice"
      className="absolute top-0 right-0 bottom-0 w-[420px] opacity-75 pointer-events-none"
    >
      <g stroke="#4d6da8" fill="none" strokeWidth="2">
        <path d="M420,0 Q380,20 360,60 L360,260" />
        <path d="M420,30 Q370,50 345,95 L345,260" />
        <path d="M420,60 Q360,80 330,130 L330,260" />
        <path d="M420,90 Q350,110 315,165 L315,260" />
        <path d="M420,120 Q340,140 300,200 L300,260" />
        <path d="M420,150 Q330,170 285,235 L285,260" />
        <path d="M420,180 Q320,200 270,260" />
        <path d="M420,210 Q310,230 260,260" />
        <path d="M420,240 Q390,250 370,260" />
      </g>
    </svg>
  )
}

export default function Merch() {
  return (
    <div className="bg-dark-navy text-beige relative overflow-hidden flex items-center justify-between gap-10 px-12 py-14">
      <TrackPattern />

      {/* Text content */}
      <div className="relative">
        <span className="font-sans text-[12px] font-semibold tracking-[0.14em] uppercase text-light-blue">
          Thoughtful artefacts
        </span>
        <h2 className="font-serif font-light text-[38px] text-beige mt-3 mb-2">
          Little book,{' '}
          <em className="italic" style={{ color: '#e2ae63' }}>big ideas.</em>
        </h2>
        <p className="font-sans text-[16px] text-beige/70 max-w-[380px]">
          The Demo Day notebook — a pocket for the ideas worth chasing.
        </p>
      </div>

      {/* CTA */}
      <a
        href="#"
        className="relative flex-none font-sans font-bold text-[16px] text-dark-navy bg-gold px-7 py-[15px] rounded-[9px] hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Buy · £18
      </a>
    </div>
  )
}
