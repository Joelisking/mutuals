"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSubmissionsArtistByIdQuery, usePatchSubmissionsArtistByIdStatusMutation } from "@/lib/redux/api/openapi.generated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, User, Calendar, FileText, Link as LinkIcon, Instagram, ExternalLink, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ArtistSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, error } = useGetSubmissionsArtistByIdQuery({ id });
  const [updateStatus, { isLoading: isUpdating }] = usePatchSubmissionsArtistByIdStatusMutation();

  const submission = (data as any)?.data;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({
        id,
        body: { status: newStatus as "NEW" | "REVIEWED" | "ARCHIVED" }
      }).unwrap();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Submission not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "NEW") return "secondary";
    if (status === "REVIEWED") return "default";
    return "outline";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Artist Submission</h1>
            <p className="text-sm text-muted-foreground">
              Submitted {format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select
            value={submission.status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Pitch Message */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pitch Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {submission.pitchMessage}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {submission.bio && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base">Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {submission.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Links */}
          {submission.portfolioLinks && Object.keys(submission.portfolioLinks).length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <LinkIcon className="h-4 w-4" />
                  Portfolio & Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(submission.portfolioLinks).map(([key, value]) => (
                    <a
                      key={key}
                      href={value as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="capitalize">{key}</span>: {value as string}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {submission.attachments && submission.attachments.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {submission.attachments.map((attachment: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md bg-zinc-950 border border-zinc-800"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-zinc-300">{attachment}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{submission.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {submission.email}
                  </a>
                </div>
              </div>

              {submission.socialMedia?.instagram && (
                <div className="flex items-start gap-3">
                  <Instagram className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">Instagram</p>
                    <a
                      href={`https://instagram.com/${submission.socialMedia.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {submission.socialMedia.instagram}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">
                    {format(new Date(submission.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(submission.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline" className="capitalize">
                  {submission.role}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(submission.status)}>
                  {submission.status}
                </Badge>
              </div>

              {submission.reviewedBy && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reviewed By</span>
                  <span className="text-sm font-medium">
                    {submission.reviewer?.firstName} {submission.reviewer?.lastName}
                  </span>
                </div>
              )}

              {submission.reviewedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reviewed</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(submission.reviewedAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ID</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {submission.id.slice(0, 8)}...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
