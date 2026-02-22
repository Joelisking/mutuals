'use client';

import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { Article, ApiResponse } from '@/lib/types/api';
import { selectProfiles } from '@/lib/data/select-data';
import { mapSelectProfileToArticle } from '@/lib/utils/select-helpers';
import { SelectCarousel } from '@/components/select/select-carousel';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SelectSection() {
  const { data, isLoading } = useGetArticlesQuery({
    category: 'Select+',
    status: 'PUBLISHED',
    limit: 8,
  });

  const response = data as ApiResponse<Article[]> | undefined;
  const apiArticles: Article[] = response?.data || [];

  const fallbackArticles: Article[] = selectProfiles
    .slice(0, 8)
    .map(mapSelectProfileToArticle);

  const articles = apiArticles.length > 0 ? apiArticles : fallbackArticles;

  return (
    <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.02em] font-medium mb-1">
                SELECT+
              </h2>

              <p className="text-base md:text-base text-white/50 font-light max-w-2xl">
                Spotlighting exceptional individuals shaping culture
                across the diaspora
              </p>
            </div>
            <Link
              href="/select"
              className="hidden md:inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              View All
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
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        )}

        {/* Carousel - 4+ cards visible on desktop with episode numbering */}
        {!isLoading && articles.length > 0 && (
          <SelectCarousel
            articles={articles}
            showEpisodeNumbers={true}
          />
        )}
      </div>
    </section>
  );
}
