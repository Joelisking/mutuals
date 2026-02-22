'use client';

import Image from 'next/image';
import { Article } from '@/lib/types/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={
            article.heroMediaUrl || '/images/placeholder-article.jpg'
          }
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Back Button */}
      <div className="absolute top-30 left-0 right-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors uppercase text-xs tracking-widest font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Editorial
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 md:px-8 pb-16 md:pb-24 flex flex-col items-center justify-center h-full text-center">
        <div className="max-w-4xl flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-[#1ecbe1] text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1">
              {article.category}
            </span>
            {article.readTime && (
              <span className="text-white/60 text-xs uppercase tracking-widest">
                {article.readTime} Read
              </span>
            )}
            <span className="text-white/60 text-xs uppercase tracking-widest">
              {formatDate(article.publishDate || article.createdAt)}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] md:leading-[0.9] tracking-tight mb-6">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-2xl border-l-0 border-t-2 border-[#1ecbe1] pt-6 mt-6">
              {article.subtitle}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-white/70 text-xs uppercase tracking-widest mb-1 font-medium">
                Written By
              </span>
              <span className="text-white font-medium">
                {article.author?.firstName} {article.author?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
