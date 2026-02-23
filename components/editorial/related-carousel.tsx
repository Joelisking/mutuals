'use client';

import { RelatedArticle } from '@/lib/types/api';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedCarouselProps {
  articles: RelatedArticle[];
}

export function RelatedCarousel({ articles }: RelatedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (articles.length === 0) return null;

  return (
    <div className="w-full py-16 border-t border-white/5 bg-[#050507]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-medium text-white">
            Related Stories
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 border border-white/10 hover:bg-white/5 rounded-full text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 border border-white/10 hover:bg-white/5 rounded-full text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {articles.map((article) => (
            <Link
              key={article.id}
              href={
                article.category === 'Select+'
                  ? `/select/${article.slug}`
                  : `/editorial/${article.slug}`
              }
              className="min-w-[300px] md:min-w-[350px] group snap-start">
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-900 mb-4">
                <Image
                  src={
                    article.heroMediaUrl || '/images/placeholder.jpg'
                  }
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] text-[#1ecbe1] uppercase tracking-widest font-bold">
                  {article.category}
                </span>
                <h3 className="text-lg font-medium text-white group-hover:text-[#1ecbe1] transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
