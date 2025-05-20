import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Simple fallback sitemap for testing
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
