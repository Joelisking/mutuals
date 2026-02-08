/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { usePostMediaUploadMutation } from "@/lib/redux/api/openapi.generated";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  creativeName: z.string().min(1, "Creative name is required").max(255),
  creativeRole: z.string().min(1, "Creative role is required").max(255),
  episodeNumber: z.string().optional(),
  location: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().min(1, "Short bio is required"),
  content: z.string().min(1, "Feature article content is required"),
  heroMediaUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
});

type SelectFeatureFormValues = z.infer<typeof formSchema>;

interface SelectFeatureFormProps {
  initialData?: any;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
}

export function SelectFeatureForm({ initialData, onSubmit, isLoading }: SelectFeatureFormProps) {
  const [uploadMedia, { isLoading: isUploading }] = usePostMediaUploadMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(initialData?.heroMediaUrl || "");

  // Parse existing article data back into form fields
  const parsedSubtitle = initialData?.subtitle?.includes("|")
    ? initialData.subtitle.split("|").map((s: string) => s.trim())
    : [initialData?.title || "", ""];

  const existingEp = initialData?.tags?.find((t: string) => t.startsWith("EP:"));
  const existingGenre = initialData?.tags?.find(
    (t: string) => !t.startsWith("EP:") && !t.includes(",") && t !== "Select+"
  );
  const existingLocation = initialData?.tags?.find((t: string) => t.includes(","));

  const form = useForm<SelectFeatureFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      creativeName: initialData ? parsedSubtitle[0] || initialData.title : "",
      creativeRole: initialData ? parsedSubtitle[1] || "" : "",
      episodeNumber: existingEp ? existingEp.replace("EP:", "") : "",
      location: existingLocation || "",
      genre: existingGenre || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      heroMediaUrl: initialData?.heroMediaUrl || "",
      status: initialData?.status || "DRAFT",
      featured: initialData?.featured || false,
      readTime: initialData?.readTime || "",
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      const result = await uploadMedia({
        body: { file, folder: "select", type: "IMAGE" },
      }).unwrap();

      const mediaUrl = (result as any)?.data?.url || (result as any)?.url;
      if (mediaUrl) {
        setUploadedImageUrl(mediaUrl);
        form.setValue("heroMediaUrl", mediaUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload succeeded but no URL returned");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl("");
    form.setValue("heroMediaUrl", "");
  };

  const handleFormSubmit = async (values: SelectFeatureFormValues) => {
    const epTag = values.episodeNumber
      ? `EP:${values.episodeNumber.padStart(3, "0")}`
      : undefined;

    const tags = [epTag, values.genre, values.location].filter(Boolean) as string[];

    const payload = {
      title: values.creativeName,
      subtitle: `${values.creativeName} | ${values.creativeRole}`,
      description: values.description,
      content: values.content,
      category: "Select+",
      heroMediaUrl: values.heroMediaUrl,
      heroMediaType: "IMAGE",
      status: values.status,
      featured: values.featured,
      readTime: values.readTime,
      tags,
    };

    await onSubmit(payload);
  };

  const genres = ["Music", "Fashion", "Art", "Photography", "Business", "Film", "Literature"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Creative Identity */}
        <div>
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Creative Identity
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="creativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. DJ Kemi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creativeRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creative Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sound Architect" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Details
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="episodeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 001" {...field} />
                  </FormControl>
                  <FormDescription>For SELECT+ EP. numbering</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre / Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lagos, Nigeria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bio */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="2-3 line bio shown on the Select+ landing page..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Displayed on the Select+ landing page hero module.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Feature */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feature Article</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write the full feature article..."
                />
              </FormControl>
              <FormDescription>The full editorial feature linked from the Select+ page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Media & Read Time */}
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
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-zinc-400" />
                            <p className="mb-2 text-sm text-zinc-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
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
                <FormDescription>Portrait or square images work best for split-screen layout.</FormDescription>
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

        {/* Status & Featured */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-[200px]">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
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
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Highlight this creative on the Select+ page.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Feature" : "Create Feature"}
        </Button>
      </form>
    </Form>
  );
}
