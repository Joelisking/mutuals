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

      {/* Mobile: Single Column Stack */}
      <div className="block md:hidden mt-8 space-y-6">
        {playlists.map((playlist, index) => (
          <div key={index} className="w-full">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal Scrollable Carousel - Maintains wide cards for 2-column Apple Music layout */}
      <div className="hidden md:block mt-12 ">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-4 md:px-8 lg:px-16 pb-4 lg:-ml-16">
            {playlists.map((playlist, index) => (
              <div key={index} className="shrink-0 w-[500px]">
                <PlaylistCard playlist={playlist} />
              </div>
            ))}
          </div>
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
