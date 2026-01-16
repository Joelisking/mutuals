'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Article } from '@/lib/types/api';

interface EditorialCarouselProps {
  articles: Article[];
  title?: string;
}

export function EditorialCarousel({
  articles,
  title,
}: EditorialCarouselProps) {
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
              className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
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
  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  // Get author name
  const authorName = article.author
    ? `${article.author.firstName} ${article.author.lastName}`
    : 'Mutuals+';

  // Get image URL with fallback
  const imageUrl = article.heroMediaUrl || '/assets/editorial-visual-culture.png';

  // Get tag (first tag or category)
  const tag = article.tags?.[0] || article.category;

  return (
    <Link
      href={`/editorial/${article.slug}`}
      className="group block">
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden rounded-[2px] mb-4">
          <Image
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            width={800}
            height={450}
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tag badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              {tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          {/* Category and Date */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-white/50 uppercase tracking-[0.15em] font-medium">
              {article.category}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs text-white/40 font-light">
              {formatDate(article.publishDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl text-white tracking-[-0.01em] font-medium mb-2 leading-tight line-clamp-2 group-hover:text-[#1ecbe1] transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-2 mb-3 flex-1">
            {article.excerpt || article.subtitle || article.description}
          </p>

          {/* Author and Read Time */}
          <div className="flex items-center justify-between pt-3 border-t border-white/6">
            <span className="text-xs text-white/50 font-light">
              {authorName}
            </span>
            {article.readTime && (
              <span className="text-xs text-white/40 font-light">
                {article.readTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
