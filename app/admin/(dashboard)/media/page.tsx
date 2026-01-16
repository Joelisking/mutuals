'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  useGetMediaQuery,
  usePostMediaUploadMutation,
  useDeleteMediaByIdMutation,
} from '@/lib/redux/api/openapi.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Search,
  Grid,
  List,
} from 'lucide-react';
import { toast } from 'sonner';
import { MediaFile, ApiResponse, PaginationMeta } from '@/lib/types/api';
import { format } from 'date-fns';

type ViewMode = 'grid' | 'list';
type FileTypeFilter = 'ALL' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

interface MediaApiResponse {
  data: MediaFile[];
  meta?: PaginationMeta;
}

export default function MediaPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 24 });
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useGetMediaQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
  });

  const [uploadMedia] = usePostMediaUploadMutation();
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaByIdMutation();

  // Parse response
  const response = data as ApiResponse<MediaFile[]> | MediaApiResponse | undefined;
  const mediaFiles: MediaFile[] = (response as ApiResponse<MediaFile[]>)?.data || [];
  const total = (response as MediaApiResponse)?.meta?.total || mediaFiles.length;

  // Filter by search term
  const filteredMedia = mediaFiles.filter((file) =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      // Determine file type
      let fileType = 'DOCUMENT';
      if (file.type.startsWith('image/')) fileType = 'IMAGE';
      else if (file.type.startsWith('video/')) fileType = 'VIDEO';
      else if (file.type.startsWith('audio/')) fileType = 'AUDIO';

      formData.append('fileType', fileType);
      formData.append('folder', 'uploads');

      try {
        await uploadMedia({ body: formData as unknown as { file: Blob } }).unwrap();
        toast.success(`Uploaded: ${file.name}`);
      } catch {
        toast.error(`Failed to upload: ${file.name}`);
      }
    }

    setIsUploading(false);
    refetch();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadMedia, refetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMedia({ id: deleteTarget.id }).unwrap();
      toast.success('File deleted successfully');
      setDeleteTarget(null);
      setSelectedMedia(null);
      refetch();
    } catch {
      toast.error('Failed to delete file');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'IMAGE':
        return <ImageIcon className="h-8 w-8 text-blue-400" />;
      case 'VIDEO':
        return <Video className="h-8 w-8 text-purple-400" />;
      case 'AUDIO':
        return <Music className="h-8 w-8 text-green-400" />;
      default:
        return <FileText className="h-8 w-8 text-zinc-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            {total} files in library
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-black"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(val) => setTypeFilter(val as FileTypeFilter)}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="IMAGE">Images</SelectItem>
            <SelectItem value="VIDEO">Videos</SelectItem>
            <SelectItem value="AUDIO">Audio</SelectItem>
            <SelectItem value="DOCUMENT">Documents</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border border-zinc-800 rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ImageIcon className="h-16 w-16 text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-400 mb-2">No media files</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Upload files to get started with your media library
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((file) => (
            <Card
              key={file.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors"
              onClick={() => setSelectedMedia(file)}
            >
              {file.fileType === 'IMAGE' ? (
                <Image
                  src={file.filePath}
                  alt={file.originalName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {getFileIcon(file.fileType)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-xs text-white text-center px-2 line-clamp-2">
                  {file.originalName}
                </p>
              </div>
              <Badge
                className="absolute top-2 right-2 text-[10px]"
                variant="secondary"
              >
                {file.fileType}
              </Badge>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((file) => (
            <Card
              key={file.id}
              className="flex items-center gap-4 p-4 cursor-pointer bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors"
              onClick={() => setSelectedMedia(file)}
            >
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-zinc-800 flex items-center justify-center">
                {file.fileType === 'IMAGE' ? (
                  <Image
                    src={file.filePath}
                    alt={file.originalName}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getFileIcon(file.fileType)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.originalName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.fileSize)} • {format(new Date(file.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge variant="outline">{file.fileType}</Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > pagination.pageSize && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((p) => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) }))
            }
            disabled={pagination.pageIndex === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {Math.ceil(total / pagination.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((p) => ({
                ...p,
                pageIndex: Math.min(
                  Math.ceil(total / pagination.pageSize) - 1,
                  p.pageIndex + 1
                ),
              }))
            }
            disabled={pagination.pageIndex >= Math.ceil(total / pagination.pageSize) - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Media Detail Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{selectedMedia?.originalName}</DialogTitle>
            <DialogDescription>
              Uploaded {selectedMedia && format(new Date(selectedMedia.createdAt), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          {selectedMedia && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center">
                {selectedMedia.fileType === 'IMAGE' ? (
                  <Image
                    src={selectedMedia.filePath}
                    alt={selectedMedia.originalName}
                    fill
                    className="object-contain"
                  />
                ) : selectedMedia.fileType === 'VIDEO' ? (
                  <video
                    src={selectedMedia.filePath}
                    controls
                    className="max-h-full max-w-full"
                  />
                ) : selectedMedia.fileType === 'AUDIO' ? (
                  <div className="flex flex-col items-center gap-4">
                    <Music className="h-16 w-16 text-green-400" />
                    <audio src={selectedMedia.filePath} controls />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    {getFileIcon(selectedMedia.fileType)}
                    <p className="text-sm text-muted-foreground">Preview not available</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p className="font-medium">{formatFileSize(selectedMedia.fileSize)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedMedia.mimeType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">URL</p>
                  <div className="flex gap-2">
                    <Input
                      value={selectedMedia.filePath}
                      readOnly
                      className="bg-zinc-900 border-zinc-800 text-xs font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyUrl(selectedMedia.filePath)}
                    >
                      {copiedUrl === selectedMedia.filePath ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setDeleteTarget(selectedMedia)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.originalName}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
