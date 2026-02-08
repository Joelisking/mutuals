'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { Article, ApiResponse } from '@/lib/types/api';
import { selectProfiles } from '@/lib/data/select-data';
import {
  mapSelectProfileToArticle,
  getEpisodeNumber,
  parseCreativeInfo,
  getLocation,
} from '@/lib/utils/select-helpers';
import { Loader2 } from 'lucide-react';

function SelectHeroCard({
  article,
  imagePosition,
}: {
  article: Article;
  imagePosition: 'left' | 'right';
}) {
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
      <div className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] rounded-[4px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side */}
          <div
            className={`relative aspect-4/5 lg:aspect-auto lg:min-h-[480px] overflow-hidden ${
              imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
            }`}>
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f]/80 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Content Side */}
          <div
            className={`flex flex-col justify-center p-8 md:p-10 lg:p-12 xl:p-16 ${
              imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
            }`}>
            {/* Episode + Badge */}
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

            {/* Name */}
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
      </div>
    </Link>
  );
}

export default function Select2Page() {
  const { data, isLoading } = useGetArticlesQuery({
    category: 'Select+',
    status: 'PUBLISHED',
    limit: 20,
  });

  const response = data as ApiResponse<Article[]> | undefined;
  const apiArticles: Article[] = response?.data || [];
  const fallbackArticles: Article[] = selectProfiles.map(
    mapSelectProfileToArticle
  );
  const articles =
    apiArticles.length > 0 ? apiArticles : fallbackArticles;

  return (
    <div className="relative min-h-screen bg-[#050507] pt-32 md:pt-36 overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gradient wash */}
        <div className="absolute top-0 left-0 w-full h-[90vh] bg-gradient-to-b from-[#1ecbe1]/[0.06] via-[#e91e8c]/[0.03] to-transparent" />
        <div className="absolute bottom-0 right-0 w-[60vw] h-[40vh] bg-gradient-to-tl from-[#1ecbe1]/[0.04] via-transparent to-transparent blur-[60px]" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-[56px] md:text-[72px] lg:text-[96px] text-white tracking-[-0.03em] font-medium">
              SELECT
            </h1>
            <span className="text-[32px] md:text-[48px] lg:text-[64px] text-[#1ecbe1] tracking-[-0.03em] font-medium">
              +
            </span>
          </div>
          <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)] max-w-[600px] font-light leading-relaxed">
            Spotlighting exceptional individuals and brands shaping
            culture across the diaspora. From emerging artists to
            groundbreaking collectives, these are the voices defining
            tomorrow.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}

        {/* Hero Cards */}
        {!isLoading && articles.length > 0 && (
          <div className="flex flex-col gap-10 md:gap-12">
            {articles.map((article, index) => (
              <SelectHeroCard
                key={article.id}
                article={article}
                imagePosition={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[18px] text-[rgba(255,255,255,0.5)] font-light">
              No profiles found. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
