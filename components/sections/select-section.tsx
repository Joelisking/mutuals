'use client';

import { selectProfiles } from '@/lib/data/select-data';
import { SelectCarousel } from '@/components/select/select-carousel';
import Link from 'next/link';

export default function SelectSection() {
  return (
    <section className="bg-[#050507] py-16  px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
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

        {/* Carousel - 4+ cards visible on desktop with episode numbering */}
        <SelectCarousel
          profiles={selectProfiles.slice(0, 8)}
          showEpisodeNumbers={true}
        />
      </div>
    </section>
  );
}
