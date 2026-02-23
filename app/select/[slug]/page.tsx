'use client';

import React, { useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import {
  useGetArticlesBySlugQuery,
  useGetArticlesQuery,
} from '@/lib/redux/api/openapi.generated';
import { Article, SelectArticle, ApiResponse } from '@/lib/types/api';
import { RelatedCarousel } from '@/components/editorial/related-carousel';
import { ArticleVideo } from '@/components/editorial/article-video';
import { cn } from '@/lib/utils';

interface SelectArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function SelectArticlePage({
  params,
}: SelectArticlePageProps) {
  const { slug } = React.use(params);
  const articleRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const { data, isLoading, error } = useGetArticlesBySlugQuery({
    slug,
  });

  const response = data as ApiResponse<SelectArticle> | undefined;
  const article = response?.data;

  // Related Select+ articles for the carousel
  const { data: relatedData } = useGetArticlesQuery(
    { category: 'Select+', status: 'PUBLISHED', limit: 6 },
    { skip: !article },
  );
  const relatedResponse = relatedData as
    | ApiResponse<Article[]>
    | undefined;
  const relatedArticles = (relatedResponse?.data || [])
    .filter((a) => a.id !== article?.id)
    .slice(0, 5);

  useEffect(() => {
    if (data) window.scrollTo(0, 0);
  }, [data]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const creativeName =
    article.subtitle?.split('|')[0]?.trim() || article.title;
  const creativeRole = article.subtitle?.split('|')[1]?.trim();

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-x-hidden">
      {/* ── Full-bleed hero — no overlay, no text ── */}
      <div className="w-full mt-20">
        <Image
          src={
            article.heroMediaUrl || '/images/placeholder-article.jpg'
          }
          alt={article.title}
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
          sizes="100vw"
        />
      </div>

      {/* ── Back button sits just below the hero ── */}
      <div
        ref={articleRef}
        className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="py-8 border-b border-white/10 max-w-3xl mx-auto">
          <Link
            href="/select"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase text-xs tracking-widest font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Select+
          </Link>
        </div>

        {/* ── Article header ── */}
        <div className="pt-12 pb-8 flex flex-col gap-3 max-w-3xl mx-auto">
          <span className="text-[#1ecbe1] text-[10px] uppercase font-bold tracking-widest">
            Select+
            {article.tags?.find((t) => t.startsWith('EP:')) && (
              <>
                {' '}
                &nbsp;·&nbsp;{' '}
                {article.tags
                  .find((t) => t.startsWith('EP:'))
                  ?.replace('EP:', 'EP.')}
              </>
            )}
          </span>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95]">
            {creativeName}
          </h1>

          {creativeRole && (
            <p className="text-white/50 text-sm uppercase tracking-[0.2em] font-light">
              {creativeRole}
            </p>
          )}
        </div>

        {/* ── Body content ── */}
        <div className="w-full max-w-3xl mx-auto pb-24">
          <article
            className="article-content prose prose-invert prose-lg md:prose-xl max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content),
            }}
          />

          {/* Article Video */}
          {article.videos && article.videos.length > 0 && (
            <ArticleVideo videos={article.videos} />
          )}

          {/* Tags footer */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full hover:bg-white/5 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Select+ carousel */}
        {relatedArticles.length > 0 && (
          <RelatedCarousel articles={relatedArticles} />
        )}
      </div>

      {/* Back to top */}
      <button
        onClick={() =>
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        className={cn(
          'fixed bottom-8 right-8 z-40 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300',
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'translate-y-20 opacity-0',
        )}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
