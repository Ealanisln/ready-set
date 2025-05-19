import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId, useCdn } from '../env'

// Create a polyfill for arrayBuffer if needed
if (typeof Response !== 'undefined') {
  // Check if arrayBuffer exists on Response prototype
  if (!Response.prototype.arrayBuffer) {
    // Add arrayBuffer method to Response prototype
    Object.defineProperty(Response.prototype, 'arrayBuffer', {
      value: async function() {
        console.warn('Using polyfill for Response.arrayBuffer()');
        const text = await this.text();
        const encoder = new TextEncoder();
        return encoder.encode(text).buffer;
      }
    });
  }
}

// Enhanced custom fetch implementation used internally by Sanity
// This is not directly passed to Sanity client config anymore
export async function customFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    // Use .text() to ensure compatibility
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      console.error('Error parsing JSON response from Sanity:', e);
      return { error: 'Failed to parse response' };
    }
  } catch (error) {
    console.error('Fetch error in Sanity client:', error);
    return { error: 'Failed to fetch' };
  }
}

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false, // Disable CDN to ensure fresh content
  // Disable stega encoding to avoid arrayBuffer issues during build
  stega: false
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}