'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/data/articles-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface EditorialCarouselProps {
  articles: Article[];
  title?: string;
}

export function EditorialCarousel({ articles, title }: EditorialCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-8">
          {title}
        </h2>
      )}

      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <EditorialCard article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
        <CarouselNext className="hidden lg:flex -right-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
      </Carousel>
    </div>
  );
}

interface EditorialCardProps {
  article: Article;
}

function EditorialCard({ article }: EditorialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/editorial/${article.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Image/Video Container - Reduced visual weight, no heavy borders */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] mb-4">
          {article.video && isHovered ? (
            <video
              src={article.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              width={800}
              height={450}
            />
          )}

          {/* Subtle gradient overlay instead of heavy frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tag badge - minimal styling */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(0,0,0,0.6)] backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
              {article.tag}
            </span>
          </div>
        </div>

        {/* Content - Let typography and spacing guide structure */}
        <div className="flex flex-col flex-1">
          {/* Category and Date - subtle, no heavy separators */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.15em] font-medium">
              {article.category}
            </span>
            <span className="text-[rgba(255,255,255,0.3)] text-[10px]">•</span>
            <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-light">
              {article.date}
            </span>
          </div>

          {/* Title - Typography leads */}
          <h3 className="text-[18px] md:text-[20px] text-white tracking-[-0.01em] font-medium mb-2 leading-tight line-clamp-2 group-hover:text-[#1ecbe1] transition-colors">
            {article.title}
          </h3>

          {/* Excerpt - light and readable */}
          <p className="text-[13px] text-[rgba(255,255,255,0.6)] font-light leading-relaxed line-clamp-2 mb-3 flex-1">
            {article.excerpt}
          </p>

          {/* Author and Read Time - minimal separator */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-light">
              {article.author}
            </span>
            <span className="text-[11px] text-[rgba(255,255,255,0.4)] font-light">
              {article.readTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
