/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { PlaylistForm } from '@/components/admin/PlaylistForm';
import { usePostPlaylistsMutation } from '@/lib/redux/api/openapi.generated';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreatePlaylistPage() {
  const router = useRouter();
  const [createPlaylist, { isLoading }] = usePostPlaylistsMutation();

  const onSubmit = async (values: any) => {
    try {
      await createPlaylist({ body: values }).unwrap();
      toast.success('Playlist created successfully');
      router.push('/admin/playlists');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to create playlist');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Playlist</h3>
        <p className="text-sm text-muted-foreground">Add a new playlist to the site.</p>
      </div>
      <PlaylistForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
