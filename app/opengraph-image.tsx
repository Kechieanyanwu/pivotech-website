import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0D1B5E',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '0 80px',
      }}
    >
      <p style={{ color: '#F5F0E8', fontFamily: 'serif', fontSize: 72, fontWeight: 700, margin: 0, textAlign: 'center' }}>
        Pivotech
      </p>
      <p style={{ color: '#F5F0E8', fontFamily: 'sans-serif', fontSize: 28, opacity: 0.7, margin: 0, textAlign: 'center' }}>
        For technologists who build with intention.
      </p>
    </div>
  )
}
