'use client'

import { motion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  className?: string
}

export default function FadeIn({ children, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' as const }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
