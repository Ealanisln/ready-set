import { MetadataRoute } from 'next'

/**
 * Type definition for a sitemap entry
 */
interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate a dynamic sitemap for the application
 * Using 'use cache' to ensure this can be statically generated
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  
  try {
    // Use BASE_URL env var if defined, otherwise fallback to the Coolify deploy URL
    const baseUrl = process.env.BASE_URL || 
      process.env.NEXT_PUBLIC_BASE_URL || 
      'http://jsk8c8cwg4w84co88ckgkg48.91.99.110.92.sslip.io';
    
    // Define static sitemap entries
    const staticEntries: SitemapEntry[] = [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/apply`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
    
    // You can add dynamic entries here if needed
    // const dynamicEntries = await fetchDynamicEntries();
    // return [...staticEntries, ...dynamicEntries];
    
    return staticEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a minimal valid sitemap if there's an error
    return [
      {
        url: 'http://jsk8c8cwg4w84co88ckgkg48.91.99.110.92.sslip.io',
        lastModified: new Date().toISOString(),
      }
    ];
  }
}
