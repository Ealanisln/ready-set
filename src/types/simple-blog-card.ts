import { SeoType } from "@/sanity/schemaTypes/seo";

interface MainImage {
  alt: string;
  asset: any; // You might want to create a separate interface for the 'image' type
  _type: string;
}

export interface SimpleBlogCard {
  _id: string;
  _updatedAt: string;
  title: string;
  slug?: {
    current: string;
    smallDescription?: string | null;
    _type: string;
    _createdAt: string;
  };
  mainImage?: MainImage;
}

export interface FullPost {
  seo: SeoType | null;
  currentSlug: string;
  _updaAt: string;
  title: string;
  body: Block[];
  mainImage: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
      smallDescription?: string | null;
    };
  };
}

interface Block {
  markDefs: any[];
  children: Child[];
  _type: "block";
  style: "normal";
  _key: string;
}

interface Child {
  _type: "span";
  text: string;
  marks: any[];
  _key: string;
}
