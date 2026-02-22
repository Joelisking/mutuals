'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetEventsByIdQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Event, ApiResponse } from '@/lib/types/api';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data, isLoading, error } = useGetEventsByIdQuery({ id });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Event> | undefined;
  const event: Event | undefined = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !event) {
    notFound();
  }

  const isSoldOut = event.ticketStatus?.toLowerCase() === 'sold out';
  const ctaLabel = isSoldOut
    ? 'Sold Out'
    : event.ticketLink
      ? 'Get Tickets'
      : 'Request to Attend';

  // Format date
  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), 'MMMM d, yyyy')
    : '';

  const formattedTime = event.eventTime || '';

  // Image URL with fallback
  const imageUrl =
    event.flyerUrl || '/assets/editorial-visual-culture.png';

  // Location display
  const displayLocation = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">
      {/* Blurred hero background - top only */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover opacity-40 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050507]/60 to-[#050507]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-0 pt-8 md:pt-26 pb-32">
        {/* Top bar / back link */}
        <div className="flex items-center justify-between gap-4 mb-10 md:mb-16">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-white/70 hover:text-white uppercase tracking-[0.14em] font-medium transition-colors group">
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
            Back
          </button>
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16 justify-between">
          {/* Left column – title & details */}
          <div className="flex-1 max-w-2xl space-y-10">
            {/* Title block */}
            <div>
              {event.type && (
                <p className="text-xs md:text-sm uppercase tracking-[0.16em] text-white/60 mb-2">
                  {event.type}
                </p>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-2 text-sm md:text-base">
                <p className="text-white/90 font-light">
                  {formattedDate}{' '}
                  {formattedTime && `at ${formattedTime}`}
                </p>
                <p className="text-white/70">{displayLocation}</p>
              </div>
            </div>

            {/* About section */}
            {event.description && (
              <div className="border-t border-white/10 pt-8 mt-4 space-y-6">
                <div>
                  <h2 className="text-sm md:text-base uppercase tracking-[0.16em] text-white/60 mb-3">
                    About this event
                  </h2>
                  <div className="space-y-4 text-sm md:text-base text-white/70 font-light leading-relaxed">
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* What to expect */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <h2 className="text-sm md:text-base uppercase tracking-[0.16em] text-white/60">
                What to expect
              </h2>
              <ul className="space-y-2 text-sm md:text-base text-white/70 font-light">
                <li>• Curated music and live performances</li>
                <li>• Photo moments and activations</li>
                <li>• Meet-ups with fellow creatives</li>
                <li>
                  • Limited-capacity experience – early RSVP
                  recommended
                </li>
              </ul>
            </div>
          </div>

          {/* Right column – poster card */}
          <div className="w-full lg:max-w-sm space-y-6">
            <div className="bg-black/60 border border-white/15 rounded-2xl p-4 md:p-5 shadow-[0_22px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="relative w-full aspect-3/4 overflow-hidden rounded-2xl">
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-5 space-y-2 text-xs md:text-sm text-white/70">
                <div className="flex items-center justify-between gap-4">
                  <span className="truncate">{formattedDate}</span>
                  <span className="text-white/40">•</span>
                  <span className="truncate text-right">
                    {event.city || event.location}
                  </span>
                </div>
                {event.status && (
                  <p className="uppercase tracking-[0.16em] text-[0.65rem] md:text-[0.7rem] text-white/50">
                    Status: {event.status}
                  </p>
                )}
              </div>
            </div>

            {/* RSVP/Tickets Button */}
            {event.ticketLink ? (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full ${isSoldOut ? 'pointer-events-none' : ''}`}>
                <Button
                  variant="outline"
                  className={`w-full py-6 md:py-7 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${
                    isSoldOut
                      ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent'
                      : 'hover:scale-105 hover:bg-white/10'
                  }`}
                  disabled={isSoldOut}>
                  {ctaLabel}
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                className={`w-full py-6 md:py-7 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${
                  isSoldOut
                    ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent'
                    : 'hover:scale-105 hover:bg-white/10'
                }`}
                disabled={isSoldOut}>
                {ctaLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
