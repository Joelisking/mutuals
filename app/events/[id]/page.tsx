import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { events } from '@/lib/data/events-data';
import { Button } from '@/components/ui/button';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return events.map((_, index) => ({
    id: (index + 1).toString(),
  }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const eventIndex = parseInt(id, 10) - 1;

  if (
    isNaN(eventIndex) ||
    eventIndex < 0 ||
    eventIndex >= events.length
  ) {
    notFound();
  }

  const event = events[eventIndex];

  if (!event) {
    notFound();
  }

  const isSoldOut = event.status === 'Sold Out';
  const ctaLabel = isSoldOut ? 'Sold Out' : 'Request to Attend';

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">
      {/* Blurred hero background - top only */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover opacity-40 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050507]/60 to-[#050507]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-0 pt-8 md:pt-26 pb-32">
        {/* Top bar / back link */}
        <div className="flex items-center justify-between gap-4 mb-10 md:mb-16">
          <Link
            href="/#events"
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
            Back to Events
          </Link>
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16 justify-between">
          {/* Left column – title & details */}
          <div className="flex-1 max-w-2xl space-y-10">
            {/* Title block */}
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.16em] text-white/60 mb-2">
                {event.type}
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-2 text-sm md:text-base">
                <p className="text-white/70">
                  Get on the list to see location
                </p>
                <p className="text-white/90 font-light">
                  {event.date}
                </p>
              </div>
            </div>

            {/* About section */}
            <div className="border-t border-white/10 pt-8 mt-4 space-y-6">
              <div>
                <h2 className="text-sm md:text-base uppercase tracking-[0.16em] text-white/60 mb-3">
                  About this event
                </h2>
                <p className="text-sm md:text-base font-semibold leading-relaxed text-white">
                  WEAR YOUR CRAZIEST HOLIDAY COSTUME – $1,000 CASH
                  PRIZE FOR BEST COSTUME
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-base text-white/70 font-light leading-relaxed">
                <p>
                  Experience an unforgettable night of culture, music,
                  and community at {event.title}. This{' '}
                  {event.type.toLowerCase()} brings together students,
                  creators, and culture enthusiasts for an immersive
                  celebration of creativity.
                </p>
                <p>
                  Join us in {event.location} as we showcase the best
                  of contemporary campus culture, featuring music,
                  interactive moments, and exclusive experiences that
                  capture the energy of Purdue Fort Wayne.
                </p>
                <p>
                  Whether you&apos;re a long-time supporter or
                  discovering Campus Connect for the first time, this
                  event promises to deliver moments you&apos;ll
                  remember long after the night ends.
                </p>
              </div>
            </div>

            {/* What to expect – optional section below the fold */}
            <div className="border-t border-white/10 pt-8 space-y-4">
              <h2 className="text-sm md:text-base uppercase tracking-[0.16em] text-white/60">
                What to expect
              </h2>
              <ul className="space-y-2 text-sm md:text-base text-white/70 font-light">
                <li>• Curated music and live performances</li>
                <li>
                  • Holiday-themed photo moments and activations
                </li>
                <li>• Meet-ups with fellow students and creatives</li>
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
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="mt-5 space-y-2 text-xs md:text-sm text-white/70">
                <div className="flex items-center justify-between gap-4">
                  <span className="truncate">{event.date}</span>
                  <span className="text-white/40">•</span>
                  <span className="truncate text-right">
                    {event.location}
                  </span>
                </div>
                {event.status && (
                  <p className="uppercase tracking-[0.16em] text-[0.65rem] md:text-[0.7rem] text-white/50">
                    Status: {event.status}
                  </p>
                )}
              </div>
            </div>

            {/* RSVP Button */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
