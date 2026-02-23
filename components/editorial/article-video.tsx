'use client';

import { ArticleVideoItem } from '@/lib/types/api';

interface ArticleVideosProps {
  videos: ArticleVideoItem[];
}

export function ArticleVideo({ videos }: ArticleVideosProps) {
  if (!videos.length) return null;

  return (
    <div className="mt-16 pt-12 border-t border-white/10 space-y-12">
      {videos.map((video, i) => (
        <div key={i}>
          {(video.title || video.description) && (
            <div className="mb-6">
              {video.title && (
                <h3 className="text-xl md:text-2xl font-medium text-white tracking-tight mb-2">
                  {video.title}
                </h3>
              )}
              {video.description && (
                <p className="text-sm text-white/50 font-light leading-relaxed max-w-2xl">
                  {video.description}
                </p>
              )}
            </div>
          )}
          <div className="relative w-full aspect-video bg-black rounded-[2px] overflow-hidden">
            <video
              src={video.url}
              controls
              className="w-full h-full object-contain"
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
