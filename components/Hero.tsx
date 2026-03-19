'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy min-h-screen flex items-center justify-center px-6 py-section-m md:py-section">
      {/* Aurora background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1 variants={item} className="font-serif text-cream text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            For technologists who build with intention.
          </motion.h1>

          <motion.p variants={item} className="font-sans text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Pivotech is an ecosystem for multidisciplinary builders — engineers, designers, operators, marketers — who believe technology should improve lives.
          </motion.p>

          <motion.div variants={item}>
            <a
              href="https://lu.ma/q7w5p948"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-steel text-white font-sans text-sm uppercase tracking-widest px-8 py-4 hover:bg-steel/90 transition-colors"
            >
              Attend a session →
            </a>
          </motion.div>
        </motion.div>

        <span className="blue-dot mt-16 md:mt-24" />
      </div>
    </section>
  )
}
