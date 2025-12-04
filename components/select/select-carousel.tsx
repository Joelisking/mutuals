'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SelectProfile } from '@/lib/data/select-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SelectCarouselProps {
  profiles: SelectProfile[];
  title?: string;
  showEpisodeNumbers?: boolean; // For SELECT+ episode-based presentation
}

export function SelectCarousel({
  profiles,
  title,
  showEpisodeNumbers = false,
}: SelectCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-8">
          {title}
        </h2>
      )}

      <Carousel
        opts={{
          align: 'start',
          slidesToScroll: 1,
        }}
        className="w-full">
        <CarouselContent className="-ml-3">
          {profiles.map((profile) => (
            <CarouselItem
              key={profile.id}
              className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <SelectCard
                profile={profile}
                showEpisodeNumber={showEpisodeNumbers}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
        <CarouselNext className="hidden lg:flex -right-12 w-10 h-10 rounded-none border-0 bg-transparent hover:bg-transparent text-white hover:text-[#1ecbe1] transition-colors" />
      </Carousel>
    </div>
  );
}

interface SelectCardProps {
  profile: SelectProfile;
  showEpisodeNumber?: boolean;
}

function SelectCard({
  profile,
  showEpisodeNumber = false,
}: SelectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/select/${profile.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex flex-col h-full">
        {/* Image/Video Container - Reduced visual weight */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] mb-4">
          {profile.video && isHovered ? (
            <video
              src={profile.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={profile.image}
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              width={800}
              height={450}
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] via-transparent to-transparent" />

          {/* Episode Number Badge - SELECT+ branding */}
          {showEpisodeNumber && profile.episodeNumber && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(0,0,0,0.6)] backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                EP {profile.episodeNumber.toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Category Badge - For non-episode based */}
          {!showEpisodeNumber && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(30,203,225,0.2)] backdrop-blur-sm px-2.5 py-1 rounded-[2px] border border-[rgba(30,203,225,0.3)]">
                {profile.category}
              </span>
            </div>
          )}

          {/* Location Badge - Bottom left */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3 h-3 text-[rgba(255,255,255,0.6)]"
                fill="none"
                viewBox="0 0 12 12">
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="6" cy="6" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-[10px] text-[rgba(255,255,255,0.7)] font-light">
                {profile.location}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Typography-led structure */}
        <div className="flex flex-col flex-1">
          {/* Name - Bold and prominent */}
          <h3 className="text-[20px] md:text-[22px] text-white tracking-[-0.01em] font-medium mb-1 leading-tight line-clamp-1 group-hover:text-[#1ecbe1] transition-colors">
            {profile.name}
          </h3>

          {/* Title - Accent color */}
          <p className="text-[12px] text-[#1ecbe1] uppercase tracking-[0.15em] font-semibold mb-2">
            {profile.title}
          </p>

          {/* Description */}
          <p className="text-[13px] text-[rgba(255,255,255,0.6)] font-light leading-relaxed line-clamp-2 flex-1">
            {profile.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
