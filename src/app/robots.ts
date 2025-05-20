// src/app/robots.ts (TEMPORARY MINIMAL DEBUGGING VERSION)
import { MetadataRoute } from 'next'

/**
 * Generate robots.txt content
 */
export default function robots(): MetadataRoute.Robots {
  console.log('--- MINIMAL ROBOTS.TS CALLED (Coolify Build) ---');
  // 'use cache'; // Temporarily commented out
  
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://example.com/sitemap.xml',
  };
}