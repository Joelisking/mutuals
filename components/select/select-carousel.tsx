'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types/api';
import { getEpisodeNumber, parseCreativeInfo, getLocation } from '@/lib/utils/select-helpers';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SelectCarouselProps {
  articles: Article[];
  title?: string;
  showEpisodeNumbers?: boolean;
}

export function SelectCarousel({
  articles,
  title,
  showEpisodeNumbers = false,
}: SelectCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl md:text-4xl text-white tracking-[-0.02em] font-medium mb-8">
          {title}
        </h2>
      )}

      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 1,
        }}
        className="w-full">
        <CarouselContent className="-ml-3">
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-3 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <SelectCard
                article={article}
                showEpisodeNumber={showEpisodeNumbers}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
        <CarouselNext className="hidden lg:flex -right-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
      </Carousel>
    </div>
  );
}

interface SelectCardProps {
  article: Article;
  showEpisodeNumber?: boolean;
}

function SelectCard({
  article,
  showEpisodeNumber = false,
}: SelectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const episodeNumber = getEpisodeNumber(article.tags);
  const creativeInfo = parseCreativeInfo(article.subtitle);
  const location = getLocation(article.tags);
  const categoryTag = article.tags?.find(
    (t) => !t.startsWith('EP:') && !t.includes(',')
  );

  const displayName = creativeInfo?.name || article.title;
  const displayRole = creativeInfo?.role || article.subtitle || '';
  const imageUrl = article.heroMediaUrl || '/assets/editorial-visual-culture.png';

  return (
    <Link
      href={`/editorial/${article.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden rounded-[2px] mb-4">
          {article.heroMediaType === 'VIDEO' && article.heroMediaUrl && isHovered ? (
            <video
              src={article.heroMediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              width={800}
              height={450}
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          {/* Episode Number Badge */}
          {showEpisodeNumber && episodeNumber !== null && (
            <div className="absolute top-3 left-3">
              <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                EP {episodeNumber.toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Category Badge - For non-episode based */}
          {!showEpisodeNumber && categoryTag && (
            <div className="absolute top-3 left-3">
              <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-[#1ecbe1]/20 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#1ecbe1]/30">
                {categoryTag}
              </span>
            </div>
          )}

          {/* Location Badge - Bottom left */}
          {location && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-white/60"
                  fill="none"
                  viewBox="0 0 12 12">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                </svg>
                <span className="text-xs text-white/70 font-light">
                  {location}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          {/* Name */}
          <h3 className="text-xl md:text-2xl text-white tracking-[-0.01em] font-medium mb-1 leading-tight line-clamp-1 group-hover:text-[#1ecbe1] transition-colors">
            {displayName}
          </h3>

          {/* Role */}
          {displayRole && (
            <p className="text-xs text-[#1ecbe1] uppercase tracking-[0.15em] font-semibold mb-2">
              {displayRole}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-2 flex-1">
            {article.description || ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
