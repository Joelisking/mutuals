import { Event } from '@/lib/data/events-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface EventCardProps {
  event: Event;
  index: number;
}

function EventCard({ event, index }: EventCardProps) {
  return (
    <div className="">
      <div className="flex flex-col h-full">
        {/* Image Container - Portrait aspect ratio */}
        <Link
          href={`/events/${index + 1}`}
          className="relative aspect-3/4 overflow-hidden rounded-[2px] mb-4 hover:scale-[1.02] transition-all duration-300">
          <Image
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            width={600}
            height={800}
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Type Badge - top left */}
          <div className="absolute top-3 left-3">
            <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              {event.type}
            </span>
          </div>

          {/* Status Badge - top right, only if sold out */}
          {event.status === 'Sold Out' && (
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
              {event.date}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-xs text-white/40 font-light">
              {event.location}
            </span>
          </div>

          {/* Title */}
          <div className="mb-1">
            <Link
              href={`/events/${index + 1}`}
              className="inline-flex">
              <h3 className="text-base md:text-lg text-white tracking-[-0.01em] font-medium leading-tight line-clamp-2 hover:text-[#1ecbe1] transition-colors">
                {event.title}
              </h3>
            </Link>
          </div>

          {/* Button */}
          {/* <div className="pt-1 border-t border-white/6 mt-auto">
            <button
              className={`${
                event.status === 'Sold Out'
                  ? 'bg-white/5 border border-white/15 opacity-50 cursor-not-allowed text-white'
                  : 'bg-white hover:bg-white/90 text-[#050507]'
              } transition-all px-4 py-2.5 text-xs uppercase tracking-[0.12em] font-medium `}
              disabled={event.status === 'Sold Out'}>
              {event.status === 'Sold Out'
                ? 'Sold Out'
                : 'Get Tickets'}
            </button>
          </div> */}

          <div className="mt-2">
            <Link
              href={`/events/${index + 1}`}
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
