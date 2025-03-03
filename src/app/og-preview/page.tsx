import Image from 'next/image'
import Link from 'next/link'

export default function OGPreview() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Open Graph Images Preview</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>OpenGraph Image</h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '630px', border: '1px solid #ccc' }}>
          <Image 
            src="/opengraph-image" 
            alt="OpenGraph preview" 
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <p style={{ marginTop: '10px' }}>
          <Link href="/opengraph-image" target="_blank" style={{ color: '#5850EC', textDecoration: 'underline' }}>
            Ver imagen completa
          </Link>
        </p>
      </div>
      
      <div>
        <h2>Twitter Image</h2>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '628px', border: '1px solid #ccc' }}>
          <Image 
            src="/twitter-image" 
            alt="Twitter preview" 
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <p style={{ marginTop: '10px' }}>
          <Link href="/twitter-image" target="_blank" style={{ color: '#5850EC', textDecoration: 'underline' }}>
            Ver imagen completa
          </Link>
        </p>
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Información adicional</h2>
        <p>Estas son las imágenes que se mostrarán cuando los enlaces a tu sitio sean compartidos en redes sociales.</p>
        <ul style={{ marginTop: '10px' }}>
          <li>Tamaño OpenGraph: 1200 x 630 píxeles</li>
          <li>Tamaño Twitter: 1200 x 628 píxeles</li>
          <li>Las imágenes incluyen el logo de Ready Set LLC y el tagline de la empresa</li>
        </ul>
      </div>
    </div>
  )
}