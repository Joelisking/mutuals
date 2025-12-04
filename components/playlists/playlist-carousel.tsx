'use client';

import { useState } from 'react';
import { Playlist } from '@/lib/data/playlist-data';

interface PlaylistCarouselProps {
  playlists: Playlist[];
  title?: string;
}

export function PlaylistCarousel({
  playlists,
  title,
}: PlaylistCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-3">
          {title}
        </h2>
      )}

      {/* Mobile: Single Column Grid */}
      <div className="block md:hidden mt-8 space-y-6">
        {playlists.map((playlist, index) => (
          <div key={index} className="w-full">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>

      {/* Desktop: Stacked Layout - All 3 visible with middle prominent */}
      <div className="hidden md:block relative mt-12">
        <div className="relative flex items-center justify-center gap-0">
          {playlists.map((playlist, index) => {
            const isMiddle = index === 1;
            const isHovered = hoveredIndex === index;

            // Z-index logic: middle is on top by default, but hovered items go to front
            const zIndex = isHovered ? 30 : isMiddle ? 20 : 10;

            // Scale and positioning
            const getTransform = () => {
              if (index === 0) {
                // Left playlist - extends to left edge
                return isHovered
                  ? 'translateX(-5%) scale(1.05)'
                  : 'translateX(0%)';
              } else if (index === 2) {
                // Right playlist - extends to right edge
                return isHovered
                  ? 'translateX(5%) scale(1.05)'
                  : 'translateX(0%)';
              }
              // Middle playlist
              return isHovered ? 'scale(1.05)' : 'scale(1)';
            };

            return (
              <div
                key={index}
                className="transition-all duration-500 ease-out"
                style={{
                  position: index === 1 ? 'relative' : 'absolute',
                  left:
                    index === 0
                      ? '0'
                      : index === 2
                      ? 'auto'
                      : undefined,
                  right: index === 2 ? '0' : undefined,
                  zIndex,
                  transform: getTransform(),
                  width: '40%',
                  maxWidth: '600px',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}>
                <PlaylistCard playlist={playlist} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PlaylistCardProps {
  playlist: Playlist;
}

function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="rounded-lg overflow-hidden h-full">
      {/* Apple Music Embed - Original light theme */}
      <iframe
        allow="autoplay *; encrypted-media *;"
        frameBorder="0"
        height="450"
        style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          display: 'block',
        }}
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={playlist.embedUrl}
        title={playlist.name}
      />
    </div>
  );
}
