/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { PlaylistForm } from '@/components/admin/PlaylistForm';
import { useGetPlaylistsByIdQuery } from '@/lib/redux/api/openapi.generated';
import { useUpdatePlaylistMutation } from '@/lib/redux/api/playlists.api';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ApiResponse, Playlist } from '@/lib/types/api';

export default function EditPlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading: isFetching } = useGetPlaylistsByIdQuery({ id });
  const [updatePlaylist, { isLoading: isUpdating }] = useUpdatePlaylistMutation();

  const playlist = (data as ApiResponse<Playlist> | undefined)?.data;

  const onSubmit = async (values: any) => {
    try {
      await updatePlaylist({ id, ...values } as any).unwrap();
      toast.success('Playlist updated successfully');
      router.push('/admin/playlists');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to update playlist');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlist) {
    return <p className="text-muted-foreground">Playlist not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Playlist</h3>
        <p className="text-sm text-muted-foreground">Update playlist details.</p>
      </div>
      <PlaylistForm initialData={playlist} onSubmit={onSubmit} isLoading={isUpdating} />
    </div>
  );
}
