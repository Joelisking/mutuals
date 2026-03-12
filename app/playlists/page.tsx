'use client';

import { useGetPlaylistsQuery } from '@/lib/redux/api/openapi.generated';
import { playlists as staticPlaylists } from '@/lib/data/playlist-data';
import { ApiResponse, Playlist } from '@/lib/types/api';

export default function PlaylistsPage() {
  const { data, isLoading } = useGetPlaylistsQuery({ limit: 50 });
  const response = data as ApiResponse<Playlist[]> | undefined;
  const apiPlaylists = response?.data ?? [];

  // Fall back to static data if API returns nothing
  const playlists = apiPlaylists.length > 0 ? apiPlaylists : staticPlaylists.map((p, i) => ({
    id: String(i),
    title: p.name,
    curatorName: 'Mutuals+',
    description: p.description,
    embedUrl: p.embedUrl,
    platform: 'SPOTIFY' as const,
    createdAt: '',
    updatedAt: '',
  }));

  return (
    <div className="min-h-screen bg-[#050507] pt-20">
      {/* Page Header */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24 border-b border-white/8">
        <div className="max-w-screen-2xl mx-auto">
          <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium mb-3">
            Mutuals+
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white tracking-[-0.03em] font-medium">
            Playlists
          </h1>
        </div>
      </div>

      {/* Playlist Sections */}
      {isLoading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="divide-y divide-white/8">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="px-4 md:px-8 lg:px-16 py-20 md:py-28">
              <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
                  {/* Text — alternates sides on desktop */}
                  <div className={index % 2 === 1 ? 'md:order-last' : ''}>
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mb-6">
                      Listen Now
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.02em] font-medium mb-6">
                      {playlist.title}
                    </h2>
                    {playlist.description && (
                      <p className="text-base md:text-lg text-white/55 leading-relaxed font-light">
                        {playlist.description}
                      </p>
                    )}
                  </div>

                  {/* Embed */}
                  <div>
                    <iframe
                      src={playlist.embedUrl}
                      title={playlist.title}
                      width="100%"
                      height="460"
                      frameBorder={0}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      style={{ borderRadius: '12px', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
