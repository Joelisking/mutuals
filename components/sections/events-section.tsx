import { events } from '@/lib/data/events-data';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '../ui/icon';

export default function EventsSection() {
  return (
    <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
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

        {/* Events Grid - 4 columns, 8 events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-8">
          {events.slice(0, 8).map((event, index) => (
            <Link
              key={index}
              href={`/events/${index + 1}`}
              className="group block">
              <div className="flex flex-col h-full">
                {/* Image Container - Portrait aspect ratio */}
                <div className="relative aspect-3/4 overflow-hidden rounded-[2px] mb-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width={600}
                    height={800}
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Type Badge - top left */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                      {event.type}
                    </span>
                  </div>

                  {/* Status Badge - top right, only if sold out */}
                  {event.status === 'Sold Out' && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-red-600 px-2.5 py-1 rounded-sm">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - Separated from image */}
                <div className="flex flex-col flex-1">
                  {/* Date and Location - subtle */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/50 uppercase tracking-[0.15em] font-medium">
                      {event.date}
                    </span>
                    <span className="text-white/30 text-xs">
                      •
                    </span>
                    <span className="text-xs text-white/40 font-light">
                      {event.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg text-white tracking-[-0.01em] font-medium mb-1 leading-tight line-clamp-2 group-hover:text-[#1ecbe1] transition-colors">
                    {event.title}
                  </h3>

                  {/* Button */}
                  <div className="pt-1 border-t border-white/6 mt-auto">
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
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
