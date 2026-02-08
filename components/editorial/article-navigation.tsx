'use client';

import { useState, useEffect, type RefObject } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { RelatedArticle } from '@/lib/types/api';
import { cn } from '@/lib/utils';

interface ArticleNavigationProps {
  prevArticle?: RelatedArticle;
  nextArticle?: RelatedArticle;
  boundaryRef?: RefObject<HTMLDivElement | null>;
}

export function ArticleNavigation({
  prevArticle,
  nextArticle,
  boundaryRef,
}: ArticleNavigationProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [inArticle, setInArticle] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = boundaryRef?.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      // Hide nav when the bottom of the article area scrolls above viewport center
      setInArticle(rect.bottom > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [boundaryRef]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNav = inArticle;

  return (
    <>
      {/* Previous Article (Left) */}
      {prevArticle && (
        <div
          className={cn(
            'fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex items-center group transition-opacity duration-300',
            showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}>
          <Link
            href={`/editorial/${prevArticle.slug}`}
            className="flex items-center">
            <div className="bg-black/80 hover:bg-black text-white p-4 rounded-r-lg border-y border-r border-white/10 transition-all flex items-center justify-center backdrop-blur-sm z-50">
              <ArrowLeft className="w-5 h-5" />
            </div>

            <div className="bg-black border border-white/10 p-3 rounded-r shadow-2xl -ml-2 pl-4 max-w-[200px] transition-transform duration-300 translate-x-0">
              <div className="text-[10px] text-[#1ecbe1] uppercase tracking-widest font-bold mb-2">
                Previous
              </div>
              <div className="flex gap-3">
                {prevArticle.heroMediaUrl && (
                  <div className="relative w-12 h-12 shrink-0 bg-zinc-900">
                    <Image
                      src={prevArticle.heroMediaUrl}
                      alt={prevArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-xs font-medium text-white line-clamp-2 leading-tight">
                  {prevArticle.title}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Next Article (Right) */}
      {nextArticle && (
        <div
          className={cn(
            'fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex items-center group transition-opacity duration-300',
            showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}>
          <Link
            href={`/editorial/${nextArticle.slug}`}
            className="flex flex-row-reverse items-center">
            <div className="bg-black/80 hover:bg-black text-white p-4 rounded-l-lg border-y border-l border-white/10 transition-all flex items-center justify-center backdrop-blur-sm z-50">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="bg-black border border-white/10 p-3 rounded-l shadow-2xl -mr-2 pr-4 max-w-[200px] transition-transform duration-300 translate-x-0">
              <div className="text-[10px] text-[#1ecbe1] uppercase tracking-widest font-bold mb-2 text-right">
                Next
              </div>
              <div className="flex flex-row-reverse gap-3">
                {nextArticle.heroMediaUrl && (
                  <div className="relative w-12 h-12 shrink-0 bg-zinc-900">
                    <Image
                      src={nextArticle.heroMediaUrl}
                      alt={nextArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-xs font-medium text-white line-clamp-2 leading-tight text-right">
                  {nextArticle.title}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 z-40 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300',
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'translate-y-20 opacity-0'
        )}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
