import { MetadataRoute } from 'next'

/**
 * Generate a dynamic sitemap for the application
 * Using 'use cache' to ensure this can be statically generated
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  
  // Use BASE_URL env var if defined, otherwise fallback to the Coolify deploy URL
  const baseUrl = process.env.BASE_URL || 
    process.env.NEXT_PUBLIC_BASE_URL || 
    'http://jsk8c8cwg4w84co88ckgkg48.91.99.110.92.sslip.io';
  
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
