/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { usePostMediaUploadMutation } from '@/lib/redux/api/openapi.generated';
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
  readTime: z.string().optional(),
  // Add other fields as needed
});

export type ArticleFormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  initialData?: any; // strict typing with generated types can be tricky if they are deep, using any for prototype speed but should refine.
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ArticleForm({
  initialData,
  onSubmit,
  isLoading,
}: ArticleFormProps) {
  const [uploadMedia, { isLoading: isUploading }] =
    usePostMediaUploadMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    initialData?.heroMediaUrl || ''
  );

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
      readTime: initialData?.readTime || '',
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
    event: React.ChangeEvent<HTMLInputElement>
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
      toast.error(`File is too large (${sizeMB}MB). Maximum size is 10MB.`);
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

  const handleFormSubmit = async (values: ArticleFormValues) => {
    try {
      console.log('Starting form submission...');
      let finalHeroUrl = values.heroMediaUrl;

      // If there is a new file selected, upload it first
      if (selectedFile) {
        console.log('Uploading file...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', 'articles');
        formData.append('type', 'IMAGE');

        const result = await uploadMedia({
          body: formData as any,
        }).unwrap();

        console.log('Upload result:', result);

        const mediaUrl =
          (result as any)?.data?.filePath ||
          (result as any)?.data?.url ||
          (result as any)?.url;

        if (!mediaUrl) {
          console.error('No media URL returned');
          toast.error('Image upload failed: No URL returned');
          return; // Stop submission
        }

        finalHeroUrl = mediaUrl;
        console.log('File uploaded, URL:', finalHeroUrl);
      }

      // Proceed with form submission using the potentially new URL
      console.log('Submitting article data...', {
        ...values,
        heroMediaUrl: finalHeroUrl,
      });
      await onSubmit({
        ...values,
        heroMediaUrl: finalHeroUrl,
      });
      console.log('Article submission complete.');
    } catch (error: any) {
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

        <div className="grid gap-4 md:grid-cols-2">
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

          <FormField
            control={form.control}
            name="readTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Read Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5 min read" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

        <Button type="submit" disabled={isLoading || isUploading}>
          {(isLoading || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? 'Update Article' : 'Create Article'}
        </Button>
      </form>
    </Form>
  );
}
