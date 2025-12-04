'use client';

import Image from 'next/image';
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
        <div className="mb-3">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-1">
                Playlists
              </h2>
              <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
                Curated sounds from the culture. Stream now on Apple
                Music.
              </p>
            </div>
          </div>
        </div>

        {/* Stream on All Platforms CTA */}
        <div className="mt-8 bg-linear-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-[4px] px-8 md:px-12 py-10 md:py-14">
          <div className="text-center mb-8">
            <h3 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-2">
              Stream on All Platforms
            </h3>
            <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.6)] font-light">
              Full playlist collection available now
            </p>
          </div>

          {/* Platform Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <a
              href="#"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Listen on Spotify"
            >
              <Image
                src="/spotify.png"
                alt="Spotify"
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto"
              />
            </a>
            <a
              href="#"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Listen on Apple Music"
            >
              <Image
                src="/apple.png"
                alt="Apple Music"
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto"
              />
            </a>
            <a
              href="#"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Listen on YouTube Music"
            >
              <Image
                src="/yt-music.png"
                alt="YouTube Music"
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto"
              />
            </a>
            <a
              href="#"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Listen on SoundCloud"
            >
              <Image
                src="/soundcloud.png"
                alt="SoundCloud"
                width={120}
                height={48}
                className="h-10 md:h-12 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Playlists Carousel - Horizontal scrollable layout */}
        <PlaylistCarousel playlists={playlists} />
      </div>
    </section>
  );
}
