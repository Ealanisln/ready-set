// TEMPORARY TEST FILE - MOCK SANITY CLIENT
// Original file backed up in test-backup-1747680515

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

// Create a mock guide
const createMockGuideResponse = (slug?: string): Guide => ({
  _id: "mock-guide-id",
  title: "Mock Guide Title",
  subtitle: "Mock Guide Subtitle",
  slug: { current: slug || "mock-guide-slug" },
  _updatedAt: new Date().toISOString(),
  coverImage: {
    _type: "image",
    asset: {
      _ref: "image-ref-789",
      _type: "reference",
    }
  },
  seo: {
    _type: "seo",
    metaTitle: "Mock Guide SEO Title",
    metaDescription: "Mock Guide SEO Description",
    seoKeywords: ["guide", "mock", "test"],
    openGraph: {
      _type: "openGraph",
      title: "Mock Guide Open Graph Title",
      description: "Mock Guide Open Graph Description",
      image: {
        _type: "customImage",
        asset: {
          _id: "image-id-101112",
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
      url: "https://example.com/mock-guide"
    },
    twitter: {
      _type: "twitter",
      handle: "@mockguidehandle",
      site: "@mockguidesite",
      cardType: "summary_large_image",
      creator: "@mockguidecreator"
    }
  }
});

// Create specialized getter functions to help TypeScript with type narrowing
export async function getPostBySlug(slug: string): Promise<PostDocument> {
  console.log('Mock getPostBySlug called with slug:', slug);
  return createMockPostResponse(slug);
}

export async function getFullPostBySlug(slug: string): Promise<FullPost> {
  console.log('Mock getFullPostBySlug called with slug:', slug);
  return createFullPost(createMockPostResponse(slug));
}

export async function getGuideBySlug(slug: string): Promise<Guide> {
  console.log('Mock getGuideBySlug called with slug:', slug);
  return createMockGuideResponse(slug);
}

export async function getPosts(): Promise<SimpleBlogCard[]> {
  console.log('Mock getPosts called');
  const posts = [
    createMockPostResponse("mock-post-1"),
    createMockPostResponse("mock-post-2"),
    createMockPostResponse("mock-post-3"),
    createMockPostResponse("mock-post-4"),
    createMockPostResponse("mock-post-5"),
    createMockPostResponse("mock-post-6"),
  ];
  
  return posts.map(createSimpleBlogCard);
}

export async function getGuides(): Promise<Guide[]> {
  console.log('Mock getGuides called');
  return [
    createMockGuideResponse("mock-guide-1"),
    createMockGuideResponse("mock-guide-2"),
    createMockGuideResponse("mock-guide-3")
  ];
}

// Main client with fetch method
export const client = {
  fetch: async (query: string, params?: any) => {
    console.log('Mock Sanity client called with query:', query, 'params:', params);
    
    // Use type casting to help TypeScript narrow the return type
    
    // Single post by slug for blog/[slug]
    if (query.includes("post") && query.includes("slug.current") && params?.slug && query.includes("blog/[slug]")) {
      return getPostBySlug(params.slug);
    }
    
    // Single post by slug for promos/[slug]
    if (query.includes("post") && query.includes("slug.current") && params?.slug && query.includes("promos")) {
      return getFullPostBySlug(params.slug);
    }
    
    // Single guide by slug
    if (query.includes("guide") && query.includes("slug.current") && params?.slug) {
      return getGuideBySlug(params.slug);
    }
    
    // For lists of posts (blog page, homepage)
    if (query.includes("post") && !params?.slug) {
      return getPosts();
    }
    
    // For lists of guides
    if (query.includes("guide") && !params?.slug) {
      return getGuides();
    }
    
    // Default fallback - empty array for list queries
    if (!params?.slug) {
      return [] as any[];
    }
    
    // Default fallback for single item queries
    if (query.includes("post")) {
      return getPostBySlug(params?.slug || "default");
    }
    
    return getGuideBySlug(params?.slug || "default");
  }
};

// Preserve any other exports from the original file
export async function customFetch(url: string, options: RequestInit = {}) {
  // Mock implementation
  console.log('Mock customFetch called with URL:', url);
  return new Response(JSON.stringify({ mock: true }));
}

// Create a urlFor function that returns an object with a url method
export function urlFor(source: any) {
  // Mock implementation
  console.log('Mock urlFor called with source:', source);
  
  // Return an object with a url() method that returns a string
  return {
    url: () => "https://mock-image-url.com/image.jpg"
  };
}
