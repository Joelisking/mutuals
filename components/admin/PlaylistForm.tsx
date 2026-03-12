/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  curatorName: z.string().min(1, 'Curator name is required'),
  description: z.string().optional(),
  embedUrl: z.string().min(1, 'Embed URL is required').url('Must be a valid URL'),
  order: z.coerce.number().int().min(0).optional(),
});

type PlaylistFormValues = z.infer<typeof formSchema>;

interface PlaylistFormProps {
  initialData?: any;
  onSubmit: (values: PlaylistFormValues) => Promise<void>;
  isLoading: boolean;
}

export function PlaylistForm({ initialData, onSubmit, isLoading }: PlaylistFormProps) {
  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      curatorName: initialData?.curatorName || '',
      description: initialData?.description || '',
      embedUrl: initialData?.embedUrl || '',
      order: initialData?.order ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ALTE+" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="curatorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curator Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mutuals+" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this playlist..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="embedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embed URL</FormLabel>
              <FormControl>
                <Input placeholder="https://open.spotify.com/embed/playlist/..." {...field} />
              </FormControl>
              <FormDescription>
                The embed URL from Spotify, Apple Music, SoundCloud, or YouTube.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" min={0} className="w-32" {...field} />
              </FormControl>
              <FormDescription>Lower numbers appear first on the playlists page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Playlist' : 'Create Playlist'}
        </Button>
      </form>
    </Form>
  );
}
