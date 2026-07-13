import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:       '#16203a',
        'dark-navy':'#141b30',
        blue:       '#2d4bd4',
        'light-blue':'#7fa0e8',
        gold:       '#e2ae63',
        beige:      '#f4eee1',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans:  ['var(--font-hanken-grotesk)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        section:     '120px',
        'section-m': '60px',
      },
    },
  },
  plugins: [],
}

export default config
