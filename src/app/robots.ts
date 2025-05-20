import { NextResponse } from 'next/server';

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /client/deliveries/
Disallow: /driver/deliveries/
Disallow: /reset-password/
Disallow: /studio/

Sitemap: https://readysetllc.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}