import { events } from '@/lib/data/events-data';
import Link from 'next/link';
import { Icon } from '../ui/icon';
import EventCard from './event-card';

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
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
