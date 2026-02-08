'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types/api';
import {
  getEpisodeNumber,
  parseCreativeInfo,
  getLocation,
} from '@/lib/utils/select-helpers';

interface SelectHeroModuleProps {
  article: Article;
  imagePosition: 'left' | 'right';
  index?: number;
}

export function SelectHeroModule({
  article,
  imagePosition,
}: SelectHeroModuleProps) {
  const episodeNumber = getEpisodeNumber(article.tags);
  const creativeInfo = parseCreativeInfo(article.subtitle);
  const location = getLocation(article.tags);

  const displayName = creativeInfo?.name || article.title;
  const displayRole = creativeInfo?.role || article.subtitle || '';
  const displayBio = article.description || '';
  const imageUrl =
    article.heroMediaUrl || '/assets/editorial-visual-culture.png';

  return (
    <Link href={`/editorial/${article.slug}`} className="group block">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
        {/* Image Side */}
        <div
          className={`relative overflow-hidden aspect-4/5 lg:aspect-auto ${
            imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
          }`}>
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050507]/80 via-transparent to-transparent lg:bg-none" />
          {imagePosition === 'left' && (
            <div className="absolute inset-0 hidden lg:block bg-linear-to-l from-[#050507]/60 via-transparent to-transparent" />
          )}
          {imagePosition === 'right' && (
            <div className="absolute inset-0 hidden lg:block bg-linear-to-r from-[#050507]/60 via-transparent to-transparent" />
          )}
        </div>

        {/* Content Side */}
        <div
          className={`flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 xl:px-20 ${
            imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
          }`}>
          {/* Episode Label */}
          <div className="flex items-center gap-4 mb-6">
            {episodeNumber !== null && (
              <span className="text-[11px] text-white/50 uppercase tracking-[0.15em] font-medium">
                EP. {episodeNumber.toString().padStart(3, '0')}
              </span>
            )}
            <span className="text-[11px] text-[#1ecbe1] uppercase tracking-[0.12em] font-semibold bg-[#1ecbe1]/10 px-3 py-1 rounded-sm">
              Select+
            </span>
          </div>

          {/* Creative Name */}
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] text-white tracking-[-0.03em] font-medium leading-[1.05] mb-3 group-hover:text-[#1ecbe1] transition-colors duration-300">
            {displayName}
          </h2>

          {/* Role */}
          {displayRole && (
            <p className="text-[14px] md:text-[16px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium mb-6">
              {displayRole}
            </p>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-3.5 h-3.5 text-white/40"
                fill="none"
                viewBox="0 0 14 14">
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="7" cy="7" r="2" fill="currentColor" />
              </svg>
              <span className="text-[12px] text-white/50 font-light tracking-wide">
                {location}
              </span>
            </div>
          )}

          {/* Bio */}
          {displayBio && (
            <p className="text-[15px] md:text-[16px] text-white/60 font-light leading-relaxed mb-8 max-w-[480px] line-clamp-3">
              {displayBio}
            </p>
          )}

          {/* CTA */}
          <div>
            <span className="inline-flex items-center gap-3 text-[13px] text-white uppercase tracking-[0.12em] font-medium group-hover:gap-4 transition-all duration-300">
              Read Feature
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16">
                <path
                  d="M3.33333 8H12.6667"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 3.33333L12.6667 8L8 12.6667"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
