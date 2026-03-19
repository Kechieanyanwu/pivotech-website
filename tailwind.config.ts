import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  '#0D1B5E',
        steel: '#3A7AC8',
        cream: '#F5F0E8',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
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
