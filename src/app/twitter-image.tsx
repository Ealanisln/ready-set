import { ImageResponse } from 'next/og'

export const alt = 'Ready Set Virtual Assistant Services'
export const size = { width: 1200, height: 628 }
export const contentType = 'image/png'

// Constantes reutilizables
const BRAND_COLOR = '#5850EC'
const TEXT_COLOR = '#1a1a1a'
const SECONDARY_COLOR = '#4a5568'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        {/* Logo */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/logo-white.png`}
          alt=""
          style={{
            width: '200px',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
          }}
        />

        {/* Contenido principal */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '800px',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: BRAND_COLOR,
              margin: '0 0 1rem',
              lineHeight: 1.1,
              letterSpacing: '-0.05em',
            }}
          >
            Virtual Assistant Services
          </h1>

          <p
            style={{
              fontSize: '32px',
              color: SECONDARY_COLOR,
              margin: '0 0 2rem',
              lineHeight: 1.4,
            }}
          >
            Expert Support When You Need It Most
          </p>

          {/* Nuevo CTA destacado */}
          <div
            style={{
              background: BRAND_COLOR,
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '50px',
              fontSize: '36px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              margin: '2rem 0',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span>📅</span>
            Book your free consultation today
            <span style={{ marginLeft: '12px' }}>→</span>
          </div>
        </div>

        {/* Footer de Twitter */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              background: BRAND_COLOR,
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            @ReadySetLLC
          </div>
          
          <div
            style={{
              height: '32px',
              width: '2px',
              background: '#cbd5e1',
            }}
          />
          
          <div
            style={{
              color: BRAND_COLOR,
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            readysetllc.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await fetchFont('https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap'),
          style: 'normal',
        },
      ],
    }
  )
}

// Helper para fuentes
async function fetchFont(url: string) {
  const response = await fetch(url)
  return await response.arrayBuffer()
}