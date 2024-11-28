import type { MetadataRoute } from 'next'
import { fetchBlogPosts, fetchPromoPosts } from './actions/get-blog-posts'

// Constants for base URL and common settings
const SITE_URL = 'https://readysetllc.com'

// Helper function to generate full URL
const getFullUrl = (path: string = '') => {
  return `${SITE_URL}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Core pages with their specific settings
  const staticPages = [
    {
      url: getFullUrl(),
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    // Main service pages
    {
      url: getFullUrl('/logistics'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: getFullUrl('/on-demand'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    // Sales and booking pages
    {
      url: getFullUrl('/sales'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Contact and request pages
    {
      url: getFullUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: getFullUrl('/catering-request'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // User account pages
    {
      url: getFullUrl('/signin'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: getFullUrl('/signup'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Information pages
    {
      url: getFullUrl('/features'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: getFullUrl('/helpdesk'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: getFullUrl('/join-the-team'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    // User features
    {
      url: getFullUrl('/newsletter'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: getFullUrl('/va'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // Dynamic routes that don't need to be in sitemap
  // - /client/deliveries/[order_number]
  // - /driver/deliveries/[order_number]
  // - /order-status/[order_number]
  // - /reset-password/[token]
  // - /studio/[[...tool]]

  // Dynamic blog and promo pages
  // You'll need to fetch these from your CMS or database
  const blogPosts = await fetchBlogPosts() // Implement this function
  const promoPosts = await fetchPromoPosts() // Implement this function

  const dynamicPages = [
    ...(blogPosts?.map(post => ({
      url: getFullUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    })) ?? []),
    ...(promoPosts?.map(promo => ({
      url: getFullUrl(`/promos/${promo.slug}`),
      lastModified: new Date(promo.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.8
    })) ?? [])
  ]

  return [
    ...staticPages,
    ...dynamicPages
  ]
}