'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { ApiResponse, SelectArticle } from '@/lib/types/api';
import { selectProfiles } from '@/lib/data/select-data';
import { mapSelectProfileToArticle } from '@/lib/utils/select-helpers';
import { SelectPreview } from '@/components/select/select-preview';
import { Loader2 } from 'lucide-react';

export default function SelectPage() {
  const { data, isLoading } = useGetArticlesQuery({
    category: 'Select+',
    status: 'PUBLISHED',
    limit: 20,
  });

  const response = data as ApiResponse<SelectArticle[]> | undefined;
  const apiArticles: SelectArticle[] = response?.data || [];
  const fallbackArticles: SelectArticle[] = selectProfiles.map(
    mapSelectProfileToArticle,
  );
  const articles =
    apiArticles.length > 0 ? apiArticles : fallbackArticles;

  // Single cursor state lifted to the section wrapper
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="relative bg-[#050507] mt-20">
      {/* Header */}
      {/* <section className="relative h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[40%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-[#1ecbe1]/[0.04] blur-[120px]" />
          <div className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[#e91e8c]/[0.04] blur-[120px]" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl md:text-8xl lg:text-9xl text-white tracking-[-0.04em] font-medium">
              SELECT
            </h1>
            <span className="text-5xl md:text-8xl lg:text-9xl text-[#1ecbe1] tracking-[-0.04em] font-medium">
              +
            </span>
          </div>
          <p className="text-[15px] md:text-[17px] text-white/50 max-w-[520px] font-light leading-relaxed">
            Spotlighting exceptional individuals and brands shaping
            culture across the diaspora.
          </p>
          <div className="mt-10 flex items-center gap-3 text-white/30 text-xs uppercase tracking-[0.2em]">
            <span>Scroll to explore</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 16 16">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section> */}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      )}

      {/* Sticky stacking sections */}
      {!isLoading && articles.length > 0 && (
        <section
          className="relative cursor-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}>
          {/* Single shared cursor */}
          <div
            ref={cursorRef}
            className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
            style={{ opacity: cursorVisible ? 1 : 0 }}>
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm scale-100 transition-transform duration-200 cursor-none">
              <span className="text-[11px] text-black font-semibold uppercase tracking-[0.15em] cursor-none">
                View
              </span>
            </div>
          </div>

          {articles.map((article) => (
            <SelectPreview key={article.id} article={article} />
          ))}
        </section>
      )}

      {/* Empty State */}
      {!isLoading && articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[18px] text-white/50 font-light">
            No SELECT+ features yet. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
