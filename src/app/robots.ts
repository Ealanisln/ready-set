import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/client/deliveries/',
        '/driver/deliveries/',
        '/reset-password/',
        '/studio/',
      ],
    },
    sitemap: 'https://readysetllc.com/sitemap.xml',
  }
}