'use client';

import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { Article, ApiResponse } from '@/lib/types/api';
import { selectProfiles } from '@/lib/data/select-data';
import { mapSelectProfileToArticle } from '@/lib/utils/select-helpers';
import { SelectHeroModule } from '@/components/select/select-hero-module';
import { Loader2 } from 'lucide-react';

export default function SelectPage() {
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
    <main className="relative min-h-screen bg-[#050507] pt-32 md:pt-36 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[40%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-[#1ecbe1]/[0.05] blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[#e91e8c]/[0.05] blur-[120px]" />
        <div className="absolute top-[55%] -left-[10%] w-[45vw] h-[45vw] rounded-full bg-[#ff6b35]/[0.05] blur-[100px]" />
        <div className="absolute top-[80%] right-[5%] w-[55vw] h-[55vw] rounded-full bg-[#1ecbe1]/[0.05] blur-[140px]" />
      </div>

      {/* Header */}
      <div className="relative mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-screen-2xl">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h1 className="text-4xl md:text-7xl lg:text-8xl text-white tracking-[-0.03em] font-medium">
              SELECT
            </h1>
            <span className="text-4xl md:text-7xl lg:text-8xl text-[#1ecbe1] tracking-[-0.03em] font-medium">
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

        {/* Hero Modules */}
        {!isLoading && articles.length > 0 && (
          <div className="flex flex-col gap-20 md:gap-24 lg:gap-28 mt-16">
            {articles.map((article, index) => (
              <SelectHeroModule
                key={article.id}
                article={article}
                imagePosition={index % 2 === 0 ? 'left' : 'right'}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[18px] text-[rgba(255,255,255,0.5)] font-light">
              No SELECT+ features yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
