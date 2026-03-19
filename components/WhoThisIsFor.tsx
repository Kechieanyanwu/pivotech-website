'use client'

import { useState, useEffect } from 'react'

const words = ['Engineers.', 'Designers.', 'Operators.', 'Marketers.', 'Founders.', 'Builders.']

export default function WhoThisIsFor() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setVisible(true)
      }, 400)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-white py-section-m md:py-section px-6 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Blue dot divider above */}
        <span className="blue-dot mb-16 md:mb-24" />

        {/* Label */}
        <p className="font-sans text-steel text-xs uppercase tracking-[0.3em] mb-8">
          Pivotech is for
        </p>

        {/* Rotating word — fixed height prevents layout shift */}
        <div className="h-20 md:h-28 flex items-center justify-center mb-8">
          <span
            className={`font-serif text-navy text-5xl md:text-7xl font-bold transition-opacity duration-[400ms] ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {words[index]}
          </span>
        </div>

        {/* Static line */}
        <p className="font-sans text-navy/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          If you care about what you&apos;re building and why — you belong here.
        </p>

        {/* Blue dot divider below */}
        <span className="blue-dot mt-16 md:mt-24" />
      </div>
    </section>
  )
}
