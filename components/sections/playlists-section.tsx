'use client';

import { playlists } from '@/lib/data/playlist-data';
import { PlaylistCarousel } from '@/components/playlists/playlist-carousel';

export default function PlaylistsSection() {
  return (
    <section className="bg-[#0a0a0f] py-16 md:py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute bg-[#5b4fed] blur-[200px] right-[10%] opacity-[0.08] rounded-full w-[600px] h-[600px] top-0" />
      <div className="absolute bg-[#e91e8c] blur-[180px] left-0 opacity-[0.06] rounded-full w-[500px] h-[500px] bottom-[10%]" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Playlists Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-3">
                Playlists
              </h2>
              <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
                Curated sounds from the culture. Stream now on Apple
                Music.
              </p>
            </div>
          </div>
        </div>

        {/* Stream on Apple Music CTA */}
        <div className="mt-16 md:mt-20 bg-gradient-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-[4px] px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-2">
              Stream on Apple Music
            </h3>
            <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.6)] font-light">
              Full playlist collection available now
            </p>
          </div>
          <button className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-8 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium whitespace-nowrap">
            Listen Now
          </button>
        </div>

        {/* Playlists Carousel - Horizontal scrollable layout */}
        <PlaylistCarousel playlists={playlists} />
      </div>
    </section>
  );
}
