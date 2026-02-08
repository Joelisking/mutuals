'use client';

import { notFound } from 'next/navigation';
import {
  useGetArticlesBySlugQuery,
  useGetArticlesQuery,
} from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Article, ApiResponse } from '@/lib/types/api';
import { ArticleHero } from '@/components/editorial/article-hero';
import { ArticleNavigation } from '@/components/editorial/article-navigation';
import { RelatedCarousel } from '@/components/editorial/related-carousel';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = React.use(params);
  const articleRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useGetArticlesBySlugQuery({
    slug,
  });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Article> | undefined;
  const article: Article | undefined = response?.data;

  // Fetch Category-based related articles
  const { data: categoryData } = useGetArticlesQuery(
    {
      category: article?.category || '',
      limit: 6,
    },
    {
      skip: !article?.category,
    }
  );

  // Fallback: fetch recent articles if no same-category results
  const categoryResponse = categoryData as ApiResponse<Article[]> | undefined;
  const categoryArticles = (categoryResponse?.data || []).filter(
    (a) => a.id !== article?.id
  );
  const { data: fallbackData } = useGetArticlesQuery(
    {
      limit: 6,
    },
    {
      skip: categoryArticles.length > 0 || !article,
    }
  );

  useEffect(() => {
    if (data) {
      window.scrollTo(0, 0);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !article) {
    notFound();
  }

  // Use category matches, or fall back to recent articles
  const fallbackResponse = fallbackData as ApiResponse<Article[]> | undefined;
  const fallbackArticles = (fallbackResponse?.data || []).filter(
    (a) => a.id !== article.id
  );
  const relatedArticles = (
    categoryArticles.length > 0 ? categoryArticles : fallbackArticles
  ).slice(0, 5);

  const prevArticle = relatedArticles.length > 1 ? relatedArticles[0] : undefined;
  const nextArticle = relatedArticles.length > 0 ? relatedArticles[relatedArticles.length - 1] : undefined;

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
      <ArticleNavigation
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        boundaryRef={articleRef}
      />

      <div ref={articleRef}>
        <ArticleHero article={article} />

        {/* Main Content Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
            {/* Article Text */}
            <div className="w-full max-w-3xl mx-auto pb-16 md:pb-24 pt-12 md:pt-16">
              <article
                className="article-content prose prose-invert prose-lg md:prose-xl max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content),
                }}
              />

              {/* Social Share / Tags Footer */}
              <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full hover:bg-white/5 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://mutualsplus.com/editorial/${article.slug}`
                      );
                    }}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#1ecbe1] hover:text-white transition-colors">
                    Share Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Carousel for Related Articles */}
      <RelatedCarousel articles={relatedArticles} />
    </div>
  );
}
