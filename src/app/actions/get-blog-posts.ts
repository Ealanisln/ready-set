import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01', // Use current date
  useCdn: true,
})

// Types for the returned data
interface Post {
  slug: string
  _updatedAt: string
}

interface Promo {
  slug: string
  _updatedAt: string
}

// Fetch all published blog posts
export async function fetchBlogPosts() {
  const query = `
    *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `
  try {
    const posts: Post[] = await client.fetch(query)
    return posts.map(post => ({
      slug: post.slug,
      updatedAt: post._updatedAt
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Fetch all published promos
export async function fetchPromoPosts() {
  const query = `
    *[_type == "promo" && defined(slug.current) && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `
  try {
    const promos: Promo[] = await client.fetch(query)
    return promos.map(promo => ({
      slug: promo.slug,
      updatedAt: promo._updatedAt
    }))
  } catch (error) {
    console.error('Error fetching promos:', error)
    return []
  }
}