import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Event } from '@/lib/types/api';

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const isSoldOut = event.ticketStatus?.toLowerCase() === 'sold out';

  // Format the date
  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), 'MMM d, yyyy').toUpperCase()
    : '';

  // Display location (city or location field)
  const displayLocation = event.city || event.location;

  // Image URL with fallback
  const imageUrl = event.flyerUrl || '/assets/editorial-visual-culture.png';

  return (
    <div className="">
      <div className="flex flex-col h-full">
        {/* Image Container - Portrait aspect ratio */}
        <Link
          href={`/events/${event.id}`}
          className="relative aspect-3/4 overflow-hidden rounded-[2px] mb-4 hover:scale-[1.02] transition-all duration-300">
          <Image
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            width={600}
            height={800}
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Type Badge - top left */}
          {event.type && (
            <div className="absolute top-3 left-3">
              <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                {event.type}
              </span>
            </div>
          )}

          {/* Status Badge - bottom right, only if sold out */}
          {isSoldOut && (
            <div className="absolute bottom-3 right-3">
              <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-red-600 px-2.5 py-1 rounded-sm">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Content - Separated from image */}
        <div className="flex flex-col flex-1">
          {/* Date and Location - subtle */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/50 uppercase tracking-[0.15em] font-medium">
              {formattedDate}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs text-white/40 font-light">
              {displayLocation}
            </span>
          </div>

          {/* Title */}
          <div className="mb-1">
            <Link
              href={`/events/${event.id}`}
              className="inline-flex">
              <h3 className="text-base md:text-lg text-white tracking-[-0.01em] font-medium leading-tight line-clamp-2 hover:text-[#1ecbe1] transition-colors">
                {event.title}
              </h3>
            </Link>
          </div>

          <div className="mt-2">
            <Link
              href={`/events/${event.id}`}
              className="inline-flex">
              <div className="rounded-full border text-white border-white/50 px-3 py-1 text-sm hover:scale-105 transition-all duration-200">
                View Event
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
