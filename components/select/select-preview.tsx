'use client';

import Link from 'next/link';
import { SelectArticle } from '@/lib/types/api';

interface SelectPreviewProps {
  article: SelectArticle;
}

export function SelectPreview({ article }: SelectPreviewProps) {
  const displayName = article.creativeName || article.title;
  const displayRole = article.creativeRole || '';
  const location = article.location;
  const episodeNumber = article.episodeNumber;
  const imageUrl =
    article.heroMediaUrl || '/assets/editorial-visual-culture.png';

  const tagParts = [
    episodeNumber != null
      ? `EP. ${episodeNumber.toString().padStart(3, '0')}`
      : null,
    displayRole,
    location,
  ].filter(Boolean);

  return (
    <Link href={`/editorial/${article.slug}`} className="cursor-none">
      <div
        className="sticky top-0 h-screen flex flex-col justify-between items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative text-white px-4 mt-[20vh]">
          {tagParts.length > 0 && (
            <p className="text-center text-xs md:text-sm uppercase tracking-[0.2em] text-white/70 font-light mb-4">
              {tagParts.join('  /  ')}
            </p>
          )}
          <h2 className="uppercase text-4xl text-center sm:text-6xl lg:text-8xl font-medium">
            {displayName}
          </h2>
        </div>

        {article.bio && (
          <div className="absolute bottom-25 right-10">
            <p className="max-w-sm text-xs md:text-sm uppercase tracking-wide text-white/70 font-medium">
              {article.bio}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
