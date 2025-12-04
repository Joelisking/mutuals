import { events } from '@/lib/data/events-data';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsSection() {
  return (
    <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-1">
                Events
              </h2>
              <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
                Experience culture in real time. Join us at our upcoming events.
              </p>
            </div>
            <Link
              href="/events"
              className="hidden md:inline-flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16">
                <path
                  d="M3.33333 8H12.6667"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 3.33333L12.6667 8L8 12.6667"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
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
                  <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.4)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Type Badge - top left */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(0,0,0,0.6)] backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                      {event.type}
                    </span>
                  </div>

                  {/* Status Badge - top right, only if sold out */}
                  {event.status === "Sold Out" && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-red-600 px-2.5 py-1 rounded-[2px]">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - Separated from image */}
                <div className="flex flex-col flex-1">
                  {/* Date and Location - subtle */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.15em] font-medium">
                      {event.date}
                    </span>
                    <span className="text-[rgba(255,255,255,0.3)] text-[10px]">•</span>
                    <span className="text-[10px] text-[rgba(255,255,255,0.4)] font-light">
                      {event.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] md:text-[20px] text-white tracking-[-0.01em] font-medium mb-3 leading-tight line-clamp-2 group-hover:text-[#1ecbe1] transition-colors">
                    {event.title}
                  </h3>

                  {/* Button */}
                  <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] mt-auto">
                    <button
                      className={`${event.status === "Sold Out" ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] opacity-50 cursor-not-allowed text-white" : "bg-white hover:bg-[rgba(255,255,255,0.9)] text-[#050507]"} transition-all rounded-sm px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] font-medium w-full`}
                      disabled={event.status === "Sold Out"}
                    >
                      {event.status === "Sold Out" ? "Sold Out" : "Get Tickets"}
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
