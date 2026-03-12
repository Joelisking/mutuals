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

export interface ArticleVideoItem {
  url: string;
  title?: string;
  description?: string;
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
  thumbnailUrl?: string;
  videos?: ArticleVideoItem[];
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

// Select+ specific article with extra creative fields
export interface SelectArticle extends Article {
  bio?: string;
  creativeName?: string;
  creativeRole?: string;
  location?: string;
  episodeNumber?: number;
  video?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
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

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  tags?: string[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  featured?: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
}

// Order Types
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productName: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  stripePaymentId?: string;
  customerName?: string;
  customerEmail: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  discountId?: string;
  notes?: string;
  items?: OrderItem[];
  discount?: { id: string; code: string; type: string; value: number };
  createdAt: string;
  updatedAt: string;
}

// Discount Types
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Discount {
  id: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  isSitewide: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateDiscountResponse {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  discountAmount: number;
  description?: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR';
  isActive: boolean;
  createdAt: string;
}

// Playlist Types
export type PlaylistPlatform = 'SPOTIFY' | 'APPLE_MUSIC' | 'SOUNDCLOUD' | 'YOUTUBE';

export interface Playlist {
  id: string;
  title: string;
  curatorName: string;
  description?: string;
  embedUrl: string;
  externalLink?: string;
  platform: PlaylistPlatform;
  seriesName?: string;
  moodDescription?: string;
  coverArtUrl?: string;
  featured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Helper type for API response extraction
export type ExtractData<T> = T extends ApiResponse<infer D> ? D : T;
