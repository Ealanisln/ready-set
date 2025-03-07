import { ImageResponse } from 'next/og'

export const alt = 'Ready Set Virtual Assistant Services'
export const size = { width: 1200, height: 628 }
export const contentType = 'image/png'

// Constantes reutilizables
const BRAND_COLOR = '#5850EC'
const TEXT_COLOR = '#1a1a1a'
const SECONDARY_COLOR = '#4a5568'

export default async function Image() {
  try {
    // URL base para recursos estáticos
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://readysetllc.com'
    
    // Cargar fuentes directamente como archivos binarios con mejor manejo de errores
    const [interRegular, interBold] = await Promise.all([
      fetch(
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiA.woff2'
      ).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch Inter Regular: ${res.status}`)
        return res.arrayBuffer()
      }),
      fetch(
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2'
      ).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch Inter Bold: ${res.status}`)
        return res.arrayBuffer()
      })
    ])

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
          {/* Elementos decorativos - círculos con el color de marca */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `${BRAND_COLOR}15`,
            zIndex: 0,
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `${BRAND_COLOR}10`,
            zIndex: 0,
          }} />

          {/* Logo */}
          <img
            src={`${baseUrl}/images/logo/logo-white.png`}
            alt=""
            style={{
              width: '200px',
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Contenido principal */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: '2rem',
              position: 'relative',
              zIndex: 1,
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

            {/* CTA destacado */}
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

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '12px 20px',
              borderRadius: '50px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Twitter icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
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
            data: interRegular,
            style: 'normal',
            weight: 400
          },
          {
            name: 'Inter',
            data: interBold,
            style: 'normal',
            weight: 700
          },
        ],
      }
    )
  } catch (error) {
    console.error('Error generating Twitter image:', error)
    
    // Imagen de respaldo en caso de error
    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: BRAND_COLOR,
              margin: '0 0 20px',
              textAlign: 'center',
            }}
          >
            Ready Set LLC
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: SECONDARY_COLOR,
              margin: '0 0 30px',
              textAlign: 'center',
            }}
          >
            Virtual Assistant Services
          </p>
          <div
            style={{
              color: BRAND_COLOR,
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            @ReadySetLLC • readysetllc.com
          </div>
        </div>
      ),
      { ...size }
    )
  }
}