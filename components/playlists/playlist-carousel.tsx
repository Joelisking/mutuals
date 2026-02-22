'use client';

import { Playlist } from '@/lib/data/playlist-data';

interface PlaylistCarouselProps {
  playlists: Playlist[];
  title?: string;
}

export function PlaylistCarousel({
  playlists,
  title,
}: PlaylistCarouselProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl md:text-4xl text-white tracking-[-0.02em] font-medium mb-3">
          {title}
        </h2>
      )}

      {/* Mobile: Horizontal Scrollable with peek */}
      <div className="block md:hidden mt-8">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-4">
            {playlists.map((playlist, index) => (
              <div key={index} className="shrink-0 w-[85%]">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Full-width equal columns */}
      <div className="hidden md:block mt-12">
        <div className="flex gap-6">
          {playlists.map((playlist, index) => (
            <div key={index} className="flex-1 min-w-0">
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
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
      <iframe
        src={playlist.embedUrl}
        title={playlist.name}
        width="100%"
        height="500"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{ borderRadius: '12px', display: 'block' }}
      />
    </div>
  );
}
