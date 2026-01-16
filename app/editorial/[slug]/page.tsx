'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetArticlesBySlugQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { Article, ApiResponse } from '@/lib/types/api';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = React.use(params);
  const { data, isLoading, error } = useGetArticlesBySlugQuery({ slug });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Article> | undefined;
  const article: Article | undefined = response?.data;

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

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
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

  // Get related articles
  const relatedArticles = article.relatedArticles?.map((r) => r.relatedArticle) || [];

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Category and Tags */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium">
                {article.category}
              </span>
              {article.tags?.[0] && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-[11px] text-white/50 uppercase tracking-[0.12em] font-medium">
                    {article.tags[0]}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-tight mb-6">
              {article.title}
            </h1>

            {/* Subtitle/Excerpt */}
            {(article.subtitle || article.excerpt) && (
              <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-8 max-w-3xl">
                {article.subtitle || article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 font-light">
              <span className="text-white/70">{authorName}</span>
              <span className="text-white/30">•</span>
              <span>{formatDate(article.publishDate)}</span>
              {article.readTime && (
                <>
                  <span className="text-white/30">•</span>
                  <span>{article.readTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/editorial"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white uppercase tracking-[0.12em] font-medium transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Editorial
          </Link>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-white/80 font-light leading-relaxed space-y-6"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Author Bio */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-medium">
              {authorName.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium">{authorName}</p>
              <p className="text-sm text-white/50">Contributor at Mutuals+</p>
            </div>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-white/50 uppercase tracking-[0.12em] mb-4">
            Share this article
          </p>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://mutualsplus.com/editorial/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://mutualsplus.com/editorial/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://mutualsplus.com/editorial/${article.slug}`);
              }}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-[#0a0a0f] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl md:text-3xl font-medium mb-12">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.slice(0, 3).map((related) => (
                <Link
                  key={related.id}
                  href={`/editorial/${related.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] mb-4">
                    <Image
                      src={related.heroMediaUrl || '/assets/editorial-visual-culture.png'}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.12em] mb-2">
                    {related.category}
                  </p>
                  <h3 className="text-lg font-medium group-hover:text-[#1ecbe1] transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
