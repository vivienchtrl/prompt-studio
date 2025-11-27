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
}
