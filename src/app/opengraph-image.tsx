import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Metadatos de la imagen
export const alt = 'Ready Set Virtual Assistant Services'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Generación de la imagen
export default async function Image() {
  // Definir una estructura para el logo que usaremos en el JSX
  let logoElement;

  try {
    // Intentar cargar el logo desde el sistema de archivos local
    const logoPath = join(process.cwd(), 'public/images/logo/logo-white.png');
    const logoData = await readFile(logoPath);
    // Convertir el buffer a una URL de datos base64
    const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;
    
    logoElement = (
      <img
        src={logoSrc}
        alt="Ready Set LLC Logo"
        style={{
          width: '180px',
          height: 'auto',
          marginBottom: '30px',
        }}
      />
    );
  } catch (error) {
    console.error('Error loading logo from file system:', error);
    // Si hay un error, usamos un elemento de texto como respaldo
    logoElement = (
      <div
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#5850EC',
          marginBottom: '30px',
        }}
      >
        Ready Set
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: '#ffffff',
          color: '#333333',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {/* Usar el elemento de logo (ya sea imagen o texto de respaldo) */}
        {logoElement}
        
        <h1
          style={{
            margin: '0 0 20px',
            fontSize: '60px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
          }}
        >
          Ready Set Virtual Assistant
        </h1>
        
        <p
          style={{
            margin: '0',
            fontSize: '28px',
            color: '#666666',
          }}
        >
          Expert Virtual Assistants, Ready When You Are.
        </p>
        
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'auto',
            padding: '8px 20px',
            background: '#f8f9fa',
            color: '#5850EC',
            borderRadius: '4px',
            fontSize: '18px',
          }}
        >
          readysetllc.com
        </div>
      </div>
    ),
    {
      ...size,
      // Sin fuentes personalizadas para evitar errores
    }
  )
}