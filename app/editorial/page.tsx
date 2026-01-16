'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Article, ApiResponse } from '@/lib/types/api';

const categories = ['All', 'Art', 'Fashion', 'Music', 'Photography', 'Literature', 'Film'];

export default function EditorialPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading, error } = useGetArticlesQuery({
    limit: 50,
    status: 'PUBLISHED',
    category: selectedCategory === 'All' ? undefined : selectedCategory,
  });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Article[]> | undefined;
  const articles: Article[] = response?.data || [];

  // Get featured article for "All" view
  const featuredArticle = selectedCategory === 'All'
    ? articles.find((a) => a.featured)
    : null;

  // Get non-featured articles (or all if not on "All" view)
  const displayArticles = selectedCategory === 'All'
    ? articles.filter((a) => !a.featured)
    : articles;

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
  const getAuthorName = (author?: { firstName: string; lastName: string }) => {
    if (!author) return 'Mutuals+';
    return `${author.firstName} ${author.lastName}`;
  };

  // Get image URL with fallback
  const getImageUrl = (article: Article) => {
    return article.heroMediaUrl || '/assets/editorial-visual-culture.png';
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-32 md:pt-36">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[56px] md:text-[72px] lg:text-[96px] text-white tracking-[-0.03em] font-medium mb-6">
            Editorial
          </h1>
          <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)] max-w-[600px] font-light leading-relaxed">
            In-depth features, interviews, and stories celebrating culture, creativity, and innovation across the African diaspora.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-sm text-[13px] uppercase tracking-[0.12em] font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-[#050507]'
                    : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-lg text-red-400 font-light">
              Failed to load articles. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-20">
                <Link
                  href={`/editorial/${featuredArticle.slug}`}
                  className="group block"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] rounded-[4px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all">
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <Image
                        src={getImageUrl(featuredArticle)}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        width={800}
                        height={600}
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-[#1ecbe1] px-4 py-2 rounded-sm text-[11px] text-[#050507] uppercase tracking-[0.12em] font-bold">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[11px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium">
                          {featuredArticle.tags?.[0] || 'Editorial'}
                        </span>
                        <span className="text-[rgba(255,255,255,0.3)]">•</span>
                        <span className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                          {featuredArticle.category}
                        </span>
                      </div>

                      <h2 className="text-[32px] md:text-[40px] text-white tracking-[-0.02em] font-medium mb-4 leading-tight">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-[16px] text-[rgba(255,255,255,0.7)] mb-6 font-light leading-relaxed">
                        {featuredArticle.excerpt || featuredArticle.subtitle || featuredArticle.description}
                      </p>

                      <div className="flex items-center gap-4 text-[13px] text-[rgba(255,255,255,0.5)] font-light">
                        <span>{getAuthorName(featuredArticle.author)}</span>
                        <span>•</span>
                        <span>{formatDate(featuredArticle.publishDate)}</span>
                        {featuredArticle.readTime && (
                          <>
                            <span>•</span>
                            <span>{featuredArticle.readTime}</span>
                          </>
                        )}
                      </div>

                      <div className="mt-8">
                        <span className="inline-flex items-center gap-2 text-[13px] text-white uppercase tracking-[0.12em] font-medium group-hover:gap-3 transition-all">
                          Read Article
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Articles Grid */}
            {displayArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {displayArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/editorial/${article.slug}`}
                    className="group block"
                  >
                    <div className="flex flex-col h-full">
                      {/* Image Container */}
                      <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] mb-4">
                        <Image
                          src={getImageUrl(article)}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          width={800}
                          height={450}
                        />

                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Tag badge */}
                        {article.tags?.[0] && (
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(0,0,0,0.6)] backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                              {article.tags[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1">
                        {/* Category and Date */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.15em] font-medium">
                            {article.category}
                          </span>
                          <span className="text-[rgba(255,255,255,0.3)] text-[10px]">•</span>
                          <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-light">
                            {formatDate(article.publishDate)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[18px] md:text-[20px] text-white tracking-[-0.01em] font-medium mb-2 leading-tight line-clamp-2 group-hover:text-[#1ecbe1] transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-[13px] text-[rgba(255,255,255,0.6)] font-light leading-relaxed line-clamp-2 mb-3 flex-1">
                          {article.excerpt || article.subtitle || article.description}
                        </p>

                        {/* Author and Read Time */}
                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
                          <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-light">
                            {getAuthorName(article.author)}
                          </span>
                          {article.readTime && (
                            <span className="text-[11px] text-[rgba(255,255,255,0.4)] font-light">
                              {article.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty State */}
            {articles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[18px] text-[rgba(255,255,255,0.5)] font-light">
                  No articles found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
