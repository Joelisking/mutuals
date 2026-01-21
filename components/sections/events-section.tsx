'use client';

import Link from 'next/link';
import { Icon } from '../ui/icon';
import EventCard from './event-card';
import { useGetEventsQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { Event, ApiResponse } from '@/lib/types/api';
import { events as staticEvents } from '@/lib/data/events-data';

export default function EventsSection() {
  const { data, isLoading } = useGetEventsQuery({
    limit: 8,
    status: 'UPCOMING',
  });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Event[]> | undefined;
  const apiEvents: Event[] = response?.data || [];

  // Map static data to Event format for fallback
  const fallbackEvents: Event[] = staticEvents.map((item, index) => ({
    id: `static-${index}`,
    title: item.title,
    description: '',
    flyerUrl: item.image,
    eventDate: item.date,
    venue: item.location,
    location: item.location,
    ticketStatus: item.status,
    type: item.type,
    status: 'UPCOMING' as const,
    creatorId: '',
    createdAt: item.date,
    updatedAt: item.date,
  }));

  // Use API data if available, otherwise fall back to static data
  const events = apiEvents.length > 0 ? apiEvents : fallbackEvents;

  return (
    <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.02em] font-medium">
                Events
              </h2>
              <p className="text-base md:text-base text-white/50 font-light max-w-2xl">
                Experience culture in real time. Join us at our
                upcoming events.
              </p>
            </div>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              View All
              <Icon name="ArrowRight" className="size-4.5" />
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        )}

        {/* Events - Horizontal scroll on mobile, grid on desktop */}
        {!isLoading && events.length > 0 && (
          <>
            {/* Mobile: Horizontal Scrollable with peek */}
            <div className="block sm:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 pb-4">
                  {events.map((event) => (
                    <div key={event.id} className="shrink-0 w-[85%]">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
