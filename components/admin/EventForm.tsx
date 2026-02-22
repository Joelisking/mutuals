/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePostMediaUploadMutation } from "@/lib/redux/api/openapi.generated";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"), // DateTime string
  venue: z.string().min(1, "Venue is required"),
  location: z.string().min(1, "Location is required"),
  flyerUrl: z.string().optional(),
  ticketLink: z.string().optional().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: "Must be a valid URL (e.g. https://...)" }
  ),
  ticketPlatform: z.string().optional(),
  ticketStatus: z.string().optional(), // On Sale, Sold Out
  type: z.string().optional(),
  status: z.enum(["UPCOMING", "PAST"]),
  featured: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  initialData?: any;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isLoading: boolean;
}

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const [uploadMedia, { isLoading: isUploading }] = usePostMediaUploadMutation();
  const [uploadedFlyerUrl, setUploadedFlyerUrl] = useState<string>(initialData?.flyerUrl || "");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      eventDate: initialData?.eventDate ? initialData.eventDate : "",
      venue: initialData?.venue || "",
      location: initialData?.location || "",
      flyerUrl: initialData?.flyerUrl || "",
      ticketLink: initialData?.ticketLink || "",
      ticketPlatform: initialData?.ticketPlatform || "",
      ticketStatus: initialData?.ticketStatus || "On Sale",
      type: initialData?.type || "Concert",
      status: initialData?.status || "UPCOMING",
      featured: initialData?.featured || false,
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'events');
      formData.append('type', 'IMAGE');

      const result = await uploadMedia({ body: formData as any }).unwrap();

      const mediaUrl =
        (result as any)?.data?.filePath ||
        (result as any)?.data?.url ||
        (result as any)?.url;
      if (mediaUrl) {
        setUploadedFlyerUrl(mediaUrl);
        form.setValue('flyerUrl', mediaUrl);
        toast.success('Flyer uploaded successfully');
      } else {
        toast.error('Upload succeeded but no URL returned');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.data?.message || 'Failed to upload flyer');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleRemoveFlyer = () => {
    setUploadedFlyerUrl("");
    form.setValue('flyerUrl', "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                    <Input placeholder="Event Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Concert">Concert</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Exhibition">Exhibition</SelectItem>
                        <SelectItem value="Listening Party">Listening Party</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Event details..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Date & Time</FormLabel>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "flex-1 pl-3 text-left font-normal border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white",
                                    !field.value && "text-muted-foreground"
                                )}>
                                {field.value && !isNaN(new Date(field.value).getTime()) ? (
                                    format(new Date(field.value), "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        // Preserve existing time if any, or default to 00:00
                                        const current = field.value && !isNaN(new Date(field.value).getTime()) ? new Date(field.value) : new Date();
                                        const hours = current.getHours();
                                        const minutes = current.getMinutes();
                                        date.setHours(hours);
                                        date.setMinutes(minutes);
                                        field.onChange(date.toISOString());
                                    }
                                }}
                                disabled={(date) =>
                                    date < new Date("1900-01-01")
                                }
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Select
                        value={field.value && !isNaN(new Date(field.value).getTime()) ? format(new Date(field.value), "HH:mm") : undefined}
                        onValueChange={(time) => {
                            if (time) {
                                const [hours, minutes] = time.split(':').map(Number);
                                const date = field.value && !isNaN(new Date(field.value).getTime()) ? new Date(field.value) : new Date();
                                date.setHours(hours);
                                date.setMinutes(minutes);
                                field.onChange(date.toISOString());
                            }
                        }}
                    >
                        <FormControl>
                            <SelectTrigger className="w-[150px] bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue placeholder="Time" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                            {Array.from({ length: 48 }).map((_, i) => {
                                const date = new Date();
                                date.setHours(Math.floor(i / 2));
                                date.setMinutes((i % 2) * 30);
                                const timeString = format(date, "HH:mm");
                                return (
                                    <SelectItem key={timeString} value={timeString}>
                                        {format(date, "p")}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <FormMessage />
                </FormItem>
            )}
            />

        <div className="grid gap-4 md:grid-cols-2">
            <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. The O2 Arena" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Address / Display Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. London, UK" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="flyerUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Event Flyer</FormLabel>
                <FormControl>
                    <div className="space-y-4">
                        {uploadedFlyerUrl ? (
                            <div className="relative">
                                <img
                                    src={uploadedFlyerUrl}
                                    alt="Flyer preview"
                                    className="w-full max-w-md h-64 object-cover rounded-lg border border-zinc-800"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveFlyer}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors">
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
                                Uploading flyer...
                            </div>
                        )}
                    </div>
                </FormControl>
                <FormDescription>Upload the event flyer image.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid gap-4 md:grid-cols-3">
             <FormField
                control={form.control}
                name="ticketLink"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ticket Link</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="ticketPlatform"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Eventbrite" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="ticketStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ticket Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="On Sale">On Sale</SelectItem>
                            <SelectItem value="Sold Out">Sold Out</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
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
                <FormLabel>Event Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="PAST">Past</SelectItem>
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
                    <FormLabel>
                      Featured Event
                    </FormLabel>
                    <FormDescription>
                      Display this event in the featured section.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
