'use client';

import Image from 'next/image';
import { playlists } from '@/lib/data/playlist-data';
import { PlaylistCarousel } from '@/components/playlists/playlist-carousel';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function PlaylistsSection() {
  return (
    <section className="bg-[#0a0a0f] py-16 md:py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute bg-[#5b4fed] blur-[200px] right-[10%] opacity-[0.08] rounded-full w-[600px] h-[600px] top-0" />
      <div className="absolute bg-[#e91e8c] blur-[180px] left-0 opacity-[0.06] rounded-full w-[500px] h-[500px] bottom-[10%]" />

      <div className="max-w-7xl mx-auto overflow-hidden relative z-10">
        {/* Playlists Header */}
        <div className="mb-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.02em] font-medium mb-1">
                Playlists
              </h2>
              <p className="text-base md:text-base text-white/50 font-light max-w-2xl">
                Discover our full collection of curated playlists.
              </p>
            </div>
          </div>
        </div>

        {/* Stream on All Platforms CTA */}
        <div className="bg-linear-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-white/8 rounded px-8 md:px-12 py-10 md:py-14">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-4xl text-white tracking-[-0.02em] font-medium mb-2">
              Stream our curator playlists
            </h3>
            {/* <p className="text-base md:text-base text-white/60 font-light">
              Full playlist collection available now
            </p> */}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="px-9 py-5 transition-all duration-200 hover:scale-105 hover:bg-white/10">
              LISTEN
            </Button>
          </div>

          {/* Platform Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12">
            <Link
              href="https://x.com/mutualsplus"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Visit us on X">
              <Image
                src="/X.svg"
                alt="X"
                width={120}
                height={48}
                className="h-9 w-auto"
              />
            </Link>
            <Link
              href="https://www.instagram.com/mutualsplus"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Visit us on Instagram">
              <Image
                src="/instagram.svg"
                alt="Instagram"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <a
              href="https://www.youtube.com/@mutualsplus?sub_confirmation=1"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Listen on YouTube">
              <Image
                src="/youtube.svg"
                alt="YouTube"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </a>
            <a
              href="https://on.soundcloud.com/LVuwO2SJ22C8G8lCTn"
              target="_blank"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Listen on SoundCloud">
              <Image
                src="/soundcloud.svg"
                alt="SoundCloud"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </a>
            <Link
              href="https://open.spotify.com/user/31tc2jki3w4bc7dzmbiwxwui6g7m?nd=1&dlsi=e718363bffd44b12"
              target="_blank"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Listen on Spotify">
              <Image
                src="/spotify.svg"
                alt="Spotify"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <Link
              href="https://music.apple.com/profile/mutualsplus"
              target="_blank"
              className="opacity-100 hover:scale-105 transition-all duration-150"
              aria-label="Listen on Apple Music">
              <Image
                src="/apple.svg"
                alt="Apple"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Playlists Carousel - Horizontal scrollable layout */}
        <PlaylistCarousel playlists={playlists} />
      </div>
    </section>
  );
}
