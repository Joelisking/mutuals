'use client';

import EventCard from '@/components/sections/event-card';
import Link from 'next/link';
import { useGetEventsQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { Event, ApiResponse } from '@/lib/types/api';

export default function EventsPage() {
  const { data, isLoading, error } = useGetEventsQuery({
    limit: 20,
    status: 'UPCOMING',
  });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Event[]> | undefined;
  const events: Event[] = response?.data || [];

  return (
    <div className="min-h-screen bg-[#050507] pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white tracking-[-0.03em] font-medium mb-6">
            Events
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl font-light leading-relaxed">
            Experience culture in real time. Join us at our upcoming
            events celebrating creativity, music, and community across
            the diaspora.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-lg text-red-400 font-light">
              Failed to load events. Please try again later.
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Empty State (if no events) */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-white/50 font-light">
              No events scheduled at the moment. Check back soon!
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-20 pt-16 border-t border-white/8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white uppercase tracking-[0.12em] font-medium transition-colors group">
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 16 16">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
