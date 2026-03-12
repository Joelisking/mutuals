import { api } from './index';
import { ApiResponse, Playlist } from '@/lib/types/api';

export interface PlaylistBody {
  title?: string;
  curatorName?: string;
  description?: string;
  embedUrl?: string;
  externalLink?: string;
  platform?: 'SPOTIFY' | 'APPLE_MUSIC' | 'SOUNDCLOUD' | 'YOUTUBE';
  seriesName?: string;
  moodDescription?: string;
  coverArtUrl?: string;
  featured?: boolean;
  order?: number;
}

export const playlistsApi = api.injectEndpoints({
  endpoints: (build) => ({
    updatePlaylist: build.mutation<ApiResponse<Playlist>, { id: string } & PlaylistBody>({
      query: ({ id, ...body }) => ({
        url: `/playlists/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Playlist'],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdatePlaylistMutation } = playlistsApi;
