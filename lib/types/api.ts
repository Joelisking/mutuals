// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Article Types
export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content: string;
  excerpt?: string;
  heroMediaUrl?: string;
  heroMediaType?: 'IMAGE' | 'VIDEO';
  category: string;
  tags?: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishDate?: string;
  readTime?: string;
  viewCount?: number;
  featured?: boolean;
  authorId: string;
  author?: Author;
  createdAt: string;
  updatedAt: string;
  relatedArticles?: Array<{
    relatedArticle: RelatedArticle;
  }>;
}

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  heroMediaUrl?: string;
  category: string;
  publishDate?: string;
}

// Event Types
export interface EventCreator {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface EventMedia {
  id: string;
  eventId: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  caption?: string;
  order: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  flyerUrl?: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  location: string;
  city?: string;
  country?: string;
  ticketLink?: string;
  ticketPlatform?: string;
  ticketStatus?: string;
  type?: string;
  status: 'UPCOMING' | 'PAST';
  featured?: boolean;
  creatorId: string;
  creator?: EventCreator;
  media?: EventMedia[];
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'json' | 'boolean' | 'number';
  description?: string;
  parsedValue?: string | string[] | object;
  updatedAt: string;
}

// Media Types
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  altText?: string;
  uploadedBy?: string;
  createdAt: string;
}

// Helper type for API response extraction
export type ExtractData<T> = T extends ApiResponse<infer D> ? D : T;
