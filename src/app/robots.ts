import { MetadataRoute } from 'next'

/**
 * Generate robots.txt content
 * Using 'use cache' to ensure this can be statically generated
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  'use cache'
  
  try {
    // Use BASE_URL env var if defined, otherwise fallback to the Coolify deploy URL
    const baseUrl = process.env.BASE_URL || 
      process.env.NEXT_PUBLIC_BASE_URL || 
      'http://jsk8c8cwg4w84co88ckgkg48.91.99.110.92.sslip.io';
    
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/client/deliveries/',
            '/driver/deliveries/',
            '/reset-password/',
            '/studio/',
          ],
        }
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Return a minimal valid robots config if there's an error
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
        }
      ],
      // No sitemap reference in fallback to avoid linking to potentially invalid URLs
    };
  }
}