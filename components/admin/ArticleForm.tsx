/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, X, Video, Plus } from 'lucide-react';
import { useState } from 'react';
import { ArticleVideoItem } from '@/lib/types/api';
import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
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
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
// Actually, let's use the generated type for strictness, but extend/pick as needed.
// For now, defining local schema matches backend expectations.

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  heroMediaUrl: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean().default(false),
  // Videos are managed separately outside the form schema
});

export type ArticleFormValues = z.infer<typeof formSchema> & {
  videos?: ArticleVideoItem[];
  readTime?: string;
};

interface ArticleFormProps {
  initialData?: any; // strict typing with generated types can be tricky if they are deep, using any for prototype speed but should refine.
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  isLoading: boolean;
}

/** Strip HTML tags and calculate read time in minutes. */
function calculateReadTime(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

async function uploadMediaDirect(formData: FormData): Promise<string> {
  // Always upload directly to the backend to bypass Next.js/Vercel payload limits.
  // CORS is configured on the backend to allow the frontend origin.
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
  const uploadUrl = `${backendUrl}/api/v1/media/upload`;

  const token = getCookie('mutuals_auth_token');
  const headers: Record<string, string> = {};
  if (token) headers['authorization'] = `Bearer ${token}`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const json = await res.json();
  const url = json?.data?.filePath ?? json?.data?.url ?? json?.url;
  if (!url) throw new Error('No URL returned from upload');
  return url;
}

export function ArticleForm({
  initialData,
  onSubmit,
  isLoading,
}: ArticleFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    initialData?.heroMediaUrl || '',
  );

  // Multi-video state
  interface VideoItem {
    id: string;
    file: File | null;
    previewUrl: string;
    uploadedUrl: string;
    title: string;
    description: string;
  }
  const [videoItems, setVideoItems] = useState<VideoItem[]>(
    (initialData?.videos || []).map((v: ArticleVideoItem) => ({
      id: crypto.randomUUID(),
      file: null,
      previewUrl: v.url,
      uploadedUrl: v.url,
      title: v.title || '',
      description: v.description || '',
    })),
  );
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description:
        initialData?.description || initialData?.subtitle || '',
      content: initialData?.content || '',
      category: initialData?.category || '',
      heroMediaUrl: initialData?.heroMediaUrl || '',
      status: initialData?.status || 'DRAFT',
      featured: initialData?.featured || false,
    },
  });

  const categories = [
    'Art',
    'Fashion',
    'Music',
    'Photography',
    'Literature',
    'Film',
  ];

  // New state to hold the selected file before upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      toast.error(
        `File is too large (${sizeMB}MB). Maximum size is 10MB.`,
      );
      return;
    }

    // Set selected file and create local preview URL
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);

    // Note: We don't set form value for `heroMediaUrl` yet because we haven't uploaded it.
    // However, we might want to let the form know *something* is there if `heroMediaUrl` is required.
    // Since it's optional in schema, we're good.
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl('');
    setSelectedFile(null);
    form.setValue('heroMediaUrl', '');
  };

  // ── Video array handlers ───────────────────────────────────────
  const addVideoItem = () => {
    setVideoItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        file: null,
        previewUrl: '',
        uploadedUrl: '',
        title: '',
        description: '',
      },
    ]);
  };

  const removeVideoItem = (id: string) => {
    setVideoItems((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVideoFileSelect = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error(
        `File is too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Max 500MB.`,
      );
      return;
    }
    setVideoItems((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, file, previewUrl: URL.createObjectURL(file) }
          : v,
      ),
    );
  };

  const updateVideoField = (
    id: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setVideoItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const removeVideoFile = (id: string) => {
    setVideoItems((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, file: null, previewUrl: '', uploadedUrl: '' }
          : v,
      ),
    );
  };

  const handleFormSubmit = async (values: ArticleFormValues) => {
    try {
      let finalHeroUrl = values.heroMediaUrl;

      // Upload hero image if a new file was selected
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', 'articles');
        formData.append('fileType', 'IMAGE');
        try {
          finalHeroUrl = await uploadMediaDirect(formData);
        } catch {
          toast.error('Image upload failed');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Upload all pending video files
      setIsUploadingVideos(true);
      const uploadedVideos: ArticleVideoItem[] = [];
      for (const item of videoItems) {
        if (!item.file && !item.uploadedUrl) continue;
        let url = item.uploadedUrl;
        if (item.file) {
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('folder', 'articles/videos');
          formData.append('fileType', 'VIDEO');
          try {
            url = await uploadMediaDirect(formData);
          } catch {
            toast.error('Video upload failed');
            setIsUploadingVideos(false);
            return;
          }
        }
        uploadedVideos.push({
          url,
          ...(item.title ? { title: item.title } : {}),
          ...(item.description ? { description: item.description } : {}),
        });
      }
      setIsUploadingVideos(false);

      // Proceed with form submission
      await onSubmit({
        ...values,
        heroMediaUrl: finalHeroUrl,
        readTime: calculateReadTime(values.content),
        videos:
          uploadedVideos.length > 0 ? uploadedVideos : undefined,
      });
      console.log('Article submission complete.');
    } catch (error: any) {
      setIsUploadingVideos(false);
      console.error('Submission error:', error);
      toast.error(error?.data?.message || 'Failed to submit article');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Article Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Subtitle</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the article..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroMediaUrl"
          render={() => (
            <FormItem>
              <FormLabel>Hero Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {uploadedImageUrl ? (
                    <div className="relative">
                      <img
                        src={uploadedImageUrl}
                        alt="Hero preview"
                        className="w-full h-48 object-cover rounded-lg border border-zinc-800"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-zinc-400" />
                          <p className="mb-2 text-sm text-zinc-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-zinc-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  )}
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload the main hero image for this article.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video Section */}
        <div className="space-y-4 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Videos (optional)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Upload videos to display at the end of the article.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVideoItem}
              className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add Video
            </Button>
          </div>

          {videoItems.length === 0 && (
            <button
              type="button"
              onClick={addVideoItem}
              className="w-full flex flex-col items-center justify-center gap-2 h-28 border-2 border-zinc-800 border-dashed rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400">
              <Video className="w-7 h-7" />
              <span className="text-sm">Click to add a video</span>
            </button>
          )}

          <div className="space-y-6">
            {videoItems.map((item, index) => (
              <div
                key={item.id}
                className="border border-zinc-700 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Video {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-zinc-500 hover:text-red-400"
                    onClick={() => removeVideoItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {item.previewUrl ? (
                  <div className="relative rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                    <video
                      src={item.previewUrl}
                      controls
                      className="w-full max-h-52 object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => removeVideoFile(item.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    {item.file && (
                      <p className="text-xs text-zinc-400 px-3 py-1.5 truncate">
                        {item.file.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors">
                    <div className="flex flex-col items-center gap-1.5">
                      <Video className="w-7 h-7 text-zinc-400" />
                      <p className="text-sm text-zinc-400">
                        <span className="font-semibold">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-zinc-500">
                        MP4, MOV, WebM up to 500MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) =>
                        handleVideoFileSelect(item.id, e)
                      }
                      disabled={isLoading || isUploadingVideos}
                    />
                  </label>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-200">
                      Title{' '}
                      <span className="text-zinc-500 font-normal">
                        (optional)
                      </span>
                    </label>
                    <Input
                      placeholder="Video title..."
                      value={item.title}
                      onChange={(e) =>
                        updateVideoField(
                          item.id,
                          'title',
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-200">
                      Description{' '}
                      <span className="text-zinc-500 font-normal">
                        (optional)
                      </span>
                    </label>
                    <Textarea
                      placeholder="Video description..."
                      className="resize-none"
                      rows={2}
                      value={item.description}
                      onChange={(e) =>
                        updateVideoField(
                          item.id,
                          'description',
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isUploadingVideos && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading
              videos...
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">
                      Published
                    </SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Article</FormLabel>
                  <FormDescription>
                    Display this article in the featured section.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || isUploading || isUploadingVideos}>
          {(isLoading || isUploading || isUploadingVideos) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? 'Update Article' : 'Create Article'}
        </Button>
      </form>
    </Form>
  );
}
