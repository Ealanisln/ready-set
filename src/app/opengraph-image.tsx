import { ImageResponse } from 'next/og'

export const alt = 'Ready Set Virtual Assistant Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Valores reutilizables
const BRAND_COLOR = '#5850EC'
const TEXT_COLOR = '#333'
const SECONDARY_TEXT = '#666'

export default async function Image() {
  // Cargar la fuente Inter directamente
  const interFont = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fff',
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
        {/* Logo - Usando ruta pública */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/logo-white.png`}
          alt=""
          style={{
            width: '240px', // Tamaño aumentado para mejor visibilidad
            marginBottom: '2rem',
          }}
        />

        {/* Texto principal */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: TEXT_COLOR,
            margin: '0 0 1rem',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: '900px',
          }}
        >
          Ready Set Virtual Assistant
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: '36px',
            color: SECONDARY_TEXT,
            margin: 0,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Expert Virtual Assistants, Ready When You Are
        </p>

        {/* Dominio */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            background: BRAND_COLOR,
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '24px',
            fontWeight: 600,
          }}
        >
          readysetllc.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interFont,
          style: 'normal',
          weight: 700
        },
      ],
    }
  )
}