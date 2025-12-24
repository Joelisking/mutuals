// Use relative URL in browser to leverage Next.js rewrite proxy
// This avoids CORS issues during development
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL to leverage Next.js rewrite
    return '/api/v1';
  }
  // Server-side: use environment variable or fallback to localhost
  return process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/v1`
    : 'http://localhost:4000/api/v1';
};

export const BASE_URL = getBackendUrl();
export const MUTUALS_COOKIE_ID = 'mutuals_auth_token';

export const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  PAST: 'PAST',
} as const;

export const SUBMISSION_STATUS = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  CONTRIBUTOR: 'CONTRIBUTOR',
} as const;

export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  PLAYLISTS: '/playlists',
  EVENTS: '/events',
  MERCH: '/merch',
  DJS: '/djs',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    ARTICLES: '/admin/articles',
    PLAYLISTS: '/admin/playlists',
    EVENTS: '/admin/events',
    PRODUCTS: '/admin/products',
  },
} as const;
