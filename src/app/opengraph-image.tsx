import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'

// Metadata para la imagen OpenGraph
export const alt = 'Ready Set Virtual Assistant Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Valores reutilizables
const BRAND_COLOR = '#5850EC'
const TEXT_COLOR = '#333'
const SECONDARY_TEXT = '#666'

export default async function Image() {
  try {
    // Cargar el logo directamente del sistema de archivos
    // Usamos path.join para construir la ruta absoluta al archivo
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'logo-white.png')
    const logoData = await fs.readFile(logoPath)
    // Convertir la imagen a un formato que ImageResponse pueda utilizar
    const logoBase64 = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`

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
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Borde superior con color de marca */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '12px',
              background: BRAND_COLOR,
            }}
          />

          {/* Logo de la empresa */}
          <img
            src={logoBase64}
            alt="Ready Set Logo"
            style={{
              width: '240px',
              height: 'auto',
              marginBottom: '2rem',
              objectFit: 'contain',
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
          
          {/* Decoración de esquina */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '120px',
              height: '120px',
              background: `linear-gradient(135deg, transparent 50%, ${BRAND_COLOR} 50%)`,
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (error) {
    console.error('Error al generar la imagen OpenGraph:', error)
    
    // Imagen de respaldo en caso de error
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
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Logo texto de respaldo */}
          <div
            style={{
              background: BRAND_COLOR,
              padding: '20px 40px',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              READY SET
            </div>
          </div>
          
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: TEXT_COLOR,
              margin: '0 0 1rem',
              textAlign: 'center',
            }}
          >
            Ready Set Virtual Assistant
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: SECONDARY_TEXT,
              margin: 0,
              textAlign: 'center',
            }}
          >
            Expert Virtual Assistants, Ready When You Are
          </p>
        </div>
      ),
      {
        ...size,
      }
    )
  }
}