export interface Media {
  id: string;
  alt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface HowToStep {
  id?: string;
  title: string; // In Payload we called it 'title', map this to 'name' in schema
  text: string;
  url?: string;
}

export interface HowToData {
  title: string;
  description?: string;
  estimatedTime?: string;
  steps: HowToStep[];
}

export interface VideoData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  _status?: 'published' | 'draft';
  publishedDate?: string;
  author?: string | User;
  coverImage?: string | Media;
  content?: Record<string, unknown>; // RichText structure
  category?: string | Category;
  tags?: (string | Tag)[];
  isPillar?: boolean;
  parentPost?: string | Post;
  createdAt: string;
  updatedAt: string;
  faqs?: FAQItem[];
  enableHowTo?: boolean;
  howToData?: HowToData;
  enableVideo?: boolean;
  videoData?: VideoData;
  customSchema?: Record<string, unknown>; // Catch-all type
}
