import { SelectProfile } from '@/lib/data/select-data';
import { Article, SelectArticle } from '@/lib/types/api';

export function getEpisodeNumber(tags?: string[]): number | null {
  if (!tags) return null;
  const epTag = tags.find((t) => t.startsWith('EP:'));
  if (!epTag) return null;
  const num = parseInt(epTag.replace('EP:', ''), 10);
  return isNaN(num) ? null : num;
}

export function parseCreativeInfo(
  subtitle?: string
): { name: string; role: string } | null {
  if (!subtitle || !subtitle.includes('|')) return null;
  const [name, role] = subtitle.split('|').map((s) => s.trim());
  return { name, role };
}

export function getLocation(tags?: string[]): string | null {
  if (!tags) return null;
  return tags.find((t) => t.includes(',')) || null;
}

export function mapSelectProfileToArticle(
  profile: SelectProfile
): SelectArticle {
  const epTag = profile.episodeNumber
    ? `EP:${profile.episodeNumber.toString().padStart(3, '0')}`
    : undefined;

  return {
    id: `select-${profile.id}`,
    title: profile.name,
    slug: profile.slug,
    subtitle: `${profile.name} | ${profile.title}`,
    description: profile.description,
    content: '',
    heroMediaUrl: profile.image,
    heroMediaType: profile.video ? 'VIDEO' : 'IMAGE',
    category: 'Select+',
    tags: [epTag, profile.category, profile.location].filter(
      Boolean
    ) as string[],
    status: 'PUBLISHED',
    featured: profile.featured,
    publishDate: profile.date,
    authorId: '',
    createdAt: profile.date,
    updatedAt: profile.date,
    // Select+ specific fields
    bio: profile.bio,
    creativeName: profile.name,
    creativeRole: profile.title,
    location: profile.location,
    episodeNumber: profile.episodeNumber,
    video: profile.video,
    socialLinks: profile.socialLinks,
    stats: profile.stats,
  };
}
