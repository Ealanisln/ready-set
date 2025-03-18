// app/api/placeholder/[width]/[height]/route.ts
import { NextRequest } from 'next/server';

// Para Next.js 15.2, modificado para manejar params de forma asíncrona
export async function GET(
  request: NextRequest,
  context: any
) {
  // Esperar a que params se resuelva antes de acceder a sus propiedades
  const params = await context.params;
  const { width, height } = params;
  
  // Generar un color aleatorio suave
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const backgroundColor = getRandomColor();
  const textColor = 'hsl(0, 0%, 30%)';

  // Crear un SVG simple como imagen placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${Math.max(10, Math.min(parseInt(width) / 5, parseInt(height) / 5))}px" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${width}×${height}
      </text>
    </svg>
  `;

  // Devolver el SVG con los headers apropiados
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}