import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Pivotech — For technologists who build with intention.',
  description: 'Pivotech is an ecosystem for multidisciplinary builders who believe technology should improve lives.',
  metadataBase: new URL('https://pivotech.io'),
  openGraph: {
    title: 'Pivotech',
    description: 'For technologists who build with intention.',
    url: 'https://pivotech.io',
    siteName: 'Pivotech',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Pivotech' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-white text-navy antialiased">
        {children}
      </body>
    </html>
  )
}
