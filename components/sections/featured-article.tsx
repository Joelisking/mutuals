'use client';

import Link from 'next/link';
import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import type { ApiResponse, Article } from '@/lib/types/api';

export default function FeaturedArticle() {
  const { data: response, isLoading } = useGetArticlesQuery({
    featured: true,
    status: 'PUBLISHED',
    excludeCategory: 'Select+',
    limit: 1,
  });

  const articles = (response as ApiResponse<Article[]> | undefined)?.data;
  const article = articles?.[0];

  if (isLoading) {
    return (
      <section className="bg-[#050507] py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="relative rounded-none md:rounded overflow-hidden border border-white/8 h-[600px] md:h-[700px] lg:h-[800px] bg-white/5 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!article) {
    return null;
  }

  const formattedDate = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const authorName = article.author
    ? `${article.author.firstName} ${article.author.lastName}`
    : 'Mutuals+ Editorial';

  return (
    <section className="bg-[#050507] py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-2xl mx-auto">
        <Link href={`/editorial/${article.slug}`}>
          <div className="relative rounded-none md:rounded overflow-hidden border border-white/8 group transition-all h-[600px] md:h-[700px] lg:h-[800px]">
            {/* Background image layer */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: article.heroMediaUrl
                  ? `url(${article.heroMediaUrl})`
                  : `url(/assets/featured-afrobeats.png)`,
              }}
            />

            {/* Dark overlay - positioned above the background */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/30" />

            {/* Noise texture overlay for depth */}
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
              }}
            />

            {/* Featured Badge */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-sm">
                <span className="text-xs md:text-xs text-white uppercase tracking-[0.15em] font-medium">
                  Featured
                </span>
              </div>
            </div>

            {/* Content - Positioned at bottom */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16 z-10">
              <div className="max-w-4xl space-y-6">
                {/* Category */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs md:text-xs text-white/60 uppercase tracking-[0.12em] font-medium">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-[-0.03em] font-medium drop-shadow-2xl">
                  {article.title}
                </h2>

                {/* Description */}
                {(article.excerpt || article.description) && (
                  <p className="text-base md:text-lg lg:text-lg text-white/85 leading-relaxed max-w-3xl font-light drop-shadow-lg">
                    {article.excerpt || article.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-white/50 font-light">
                    <span>By {authorName}</span>
                    {formattedDate && (
                      <>
                        <span>•</span>
                        <span>{formattedDate}</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <span className="group/btn inline-flex items-center gap-3 text-white group-hover:text-[#1ecbe1] transition-colors">
                    <span className="text-sm uppercase tracking-[0.12em] font-medium">
                      Read Article
                    </span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        d="M4.16667 10H15.8333"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10 4.16667L15.8333 10L10 15.8333"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
