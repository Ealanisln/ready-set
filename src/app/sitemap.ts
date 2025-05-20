// src/app/sitemap.ts (TEMPORARY MINIMAL DEBUGGING VERSION)
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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  console.log('--- MINIMAL SITEMAP.TS CALLED (Coolify Build) ---');
  // 'use cache'; // Temporarily commented out
  
  return [
    { url: 'https://example.com/', lastModified: new Date().toISOString() }
  ];
}