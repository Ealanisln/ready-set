// TEMPORARY TEST FILE - MOCK SANITY CLIENT
// Original file backed up in test-backup-1747680515

import { createClient } from 'next-sanity'
import ImageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId, useCdn } from '../env'
import type { PostDocument, SeoType } from "../schemaTypes/seo";
import type { SimpleBlogCard, FullPost } from "@/types/simple-blog-card";

// Add missing properties to the PostDocument interface to match our usage
interface ExtendedPostDocument extends PostDocument {
  categories?: Array<{ title: string; _id: string }>;
}

// Define a Guide interface that matches the app's expectations
interface Guide {
  _id: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  coverImage: any;
  _updatedAt: string;
  seo?: SeoType;
}

// Create the Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
})

// Valid Sanity image reference format for fallbacks
const FALLBACK_IMAGE_REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";

// Create mock response objects
const createMockPostResponse = (slug?: string): ExtendedPostDocument => ({
  _type: "post",
  _id: "mock-post-id",
  _updatedAt: new Date().toISOString(),
  title: "Mock Post Title",
  slug: { 
    current: slug || "mock-post-slug"
  },
  smallDescription: "This is a mock post description for testing purposes.",
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-ref-123",
      _type: "reference",
    }
  },
  body: [
    {
      _type: "block",
      style: "normal",
      _key: "mock-block-1",
      markDefs: [],
      children: [
        { 
          _type: "span", 
          text: "This is mock content.",
          marks: [],
          _key: "mock-span-1"
        }
      ]
    }
  ],
  seo: {
    _type: "seo",
    metaTitle: "Mock SEO Title",
    metaDescription: "Mock SEO Description",
    seoKeywords: ["mock", "test", "seo"],
    openGraph: {
      _type: "openGraph",
      title: "Mock Open Graph Title",
      description: "Mock Open Graph Description",
      image: {
        _type: "customImage",
        asset: {
          _id: "image-id-456",
          metadata: {
            _type: "sanityImageMetadata",
            dimensions: {
              _type: "sanityImageDimensions",
              width: 1200,
              height: 630
            }
          }
        }
      },
      siteName: "Mock Site Name",
      url: "https://example.com/mock"
    },
    twitter: {
      _type: "twitter",
      handle: "@mockhandle",
      site: "@mocksite",
      cardType: "summary_large_image",
      creator: "@mockcreator"
    }
  },
  categories: [
    { title: "Business", _id: "cat-business" },
    { title: "Technology", _id: "cat-tech" }
  ]
});

// Convert to SimpleBlogCard format for lists
const createSimpleBlogCard = (post: ExtendedPostDocument): SimpleBlogCard => ({
  _id: post._id,
  _updatedAt: post._updatedAt,
  title: post.title,
  slug: {
    current: post.slug.current,
    _type: "slug",
    _createdAt: new Date().toISOString(),
    smallDescription: post.smallDescription
  },
  mainImage: post.mainImage ? {
    alt: post.title,
    asset: post.mainImage.asset,
    _type: post.mainImage._type
  } : undefined,
  categories: post.categories
});

// Convert to FullPost format for single post view
const createFullPost = (post: ExtendedPostDocument): FullPost => ({
  seo: post.seo || null,
  currentSlug: post.slug.current,
  _updaAt: post._updatedAt,
  title: post.title,
  body: post.body || [],
  mainImage: post.mainImage || {
    _type: "image",
    asset: {
      _ref: "default-image",
      _type: "reference"
    }
  }
});

// Helper function to get a post by slug
export async function getPostBySlug(slug: string): Promise<PostDocument> {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]`,
      { slug }
    );
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    // Return a minimal fallback post
    return {
      _type: "post",
      _id: `fallback-${slug}`,
      _updatedAt: new Date().toISOString(),
      title: "Fallback Post",
      slug: { current: slug },
      mainImage: { 
        _type: "image",
        asset: {
          _ref: FALLBACK_IMAGE_REF,
          _type: "reference"
        }
      }
    };
  }
}

// Helper function to get a full post by slug
export async function getFullPostBySlug(slug: string): Promise<FullPost> {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        "currentSlug": slug.current,
        "_updaAt": _updatedAt,
        body,
        mainImage,
        seo
      }`,
      { slug }
    );
    return post;
  } catch (error) {
    console.error(`Error fetching full post with slug ${slug}:`, error);
    // Return a minimal fallback post
    return {
      title: "Fallback Post",
      currentSlug: slug,
      _updaAt: new Date().toISOString(),
      body: [],
      mainImage: { 
        _type: "image",
        asset: {
          _ref: FALLBACK_IMAGE_REF,
          _type: "reference"
        }
      },
      seo: null
    };
  }
}

// Create a fallback guide for error cases
const createFallbackGuide = (slug: string): Guide => ({
  _id: `fallback-${slug}`,
  title: "Fallback Guide",
  subtitle: "This is a fallback guide when Sanity data cannot be retrieved",
  slug: { current: slug },
  _updatedAt: new Date().toISOString(),
  coverImage: {
    _type: "image",
    asset: {
      _ref: FALLBACK_IMAGE_REF,
      _type: "reference",
    }
  }
});

// Helper function to get a guide by slug
export async function getGuideBySlug(slug: string): Promise<Guide> {
  try {
    const guide = await client.fetch(
      `*[_type == "guide" && slug.current == $slug][0]{
        _id,
        title,
        subtitle,
        slug,
        coverImage,
        _updatedAt,
        seo
      }`,
      { slug }
    );
    
    if (!guide) {
      console.warn(`No guide found with slug ${slug}, using fallback`);
      return createFallbackGuide(slug);
    }
    
    return guide;
  } catch (error) {
    console.error(`Error fetching guide with slug ${slug}:`, error);
    return createFallbackGuide(slug);
  }
}

// Helper function to get posts
export async function getPosts(): Promise<SimpleBlogCard[]> {
  try {
    return await client.fetch(
      `*[_type == "post" && defined(slug.current)]{
        _id,
        _updatedAt,
        title,
        slug,
        mainImage,
        categories[]->{
          title,
          _id
        }
      }`
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    // Return empty array as fallback
    return [];
  }
}

// Helper function to get guides
export async function getGuides(): Promise<Guide[]> {
  try {
    const guides = await client.fetch(
      `*[_type == "guide" && defined(slug.current)]{
        _id,
        title,
        subtitle,
        slug,
        coverImage,
        _updatedAt,
        seo
      }`
    );
    
    if (!guides || !guides.length) {
      console.warn("No guides found, using fallback guides");
      return [
        createFallbackGuide("what-is-email-marketing"),
        createFallbackGuide("your-guide-to-delegation"),
        createFallbackGuide("building-a-reliable-delivery-network")
      ];
    }
    
    return guides;
  } catch (error) {
    console.error("Error fetching guides:", error);
    // Return fallback guides
    return [
      createFallbackGuide("what-is-email-marketing"),
      createFallbackGuide("your-guide-to-delegation"),
      createFallbackGuide("building-a-reliable-delivery-network")
    ];
  }
}

// Setup image URL builder
const builder = ImageUrlBuilder(client);

// Create a urlFor function that returns an object with a url method
export function urlFor(source: any) {
  if (!source) {
    console.warn("Invalid source passed to urlFor");
    return {
      url: () => "https://via.placeholder.com/600x400?text=Image+Not+Available"
    };
  }
  
  try {
    return builder.image(source);
  } catch (error) {
    console.error("Error in urlFor:", error);
    return {
      url: () => "https://via.placeholder.com/600x400?text=Image+Not+Available"
    };
  }
}

// Custom fetch helper
export async function customFetch(url: string, options: RequestInit = {}) {
  return fetch(url, options);
}
