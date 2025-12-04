import { events } from '@/lib/data/events-data';
import Image from 'next/image';

export default function EventsSection() {
  return (
    <section className="bg-[#050507] py-16 md:py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-3">
            Events
          </h2>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
            Experience culture in real time. Join us at our upcoming events.
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="bg-[#0a0a0f] rounded-none md:rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-[45%] h-[300px] lg:h-auto overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent to-[#0a0a0f]/80" />
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                    <div className={`${event.status === "Sold Out" ? "bg-red-600" : "bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)]"} rounded-sm px-3 py-1.5`}>
                      <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">{event.status}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-1.5">
                      <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">{event.type}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-[55%] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-[28px] md:text-[32px] lg:text-[36px] text-white tracking-[-0.02em] font-medium mb-8">
                    {event.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-white rounded-sm p-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <rect x="3" y="4" width="14" height="14" rx="2" stroke="#050507" strokeWidth="1.5" />
                          <path d="M3 8h14M7 2v4M13 2v4" stroke="#050507" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] mb-1 font-medium">Date</p>
                        <p className="text-[15px] text-white font-light">{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white rounded-sm p-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d="M10 9a2 2 0 100-4 2 2 0 000 4zM10 9c-3.314 0-6 2.462-6 5.5v.5h12v-.5c0-3.038-2.686-5.5-6-5.5z" stroke="#050507" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] mb-1 font-medium">Location</p>
                        <p className="text-[15px] text-white font-light">{event.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className={`${event.status === "Sold Out" ? "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] opacity-50 cursor-not-allowed text-white" : "bg-white hover:bg-[rgba(255,255,255,0.9)] text-[#050507]"} transition-all rounded-sm px-6 py-3.5 text-[13px] uppercase tracking-[0.12em] font-medium flex items-center justify-center gap-2`}
                      disabled={event.status === "Sold Out"}
                    >
                      {event.status === "Sold Out" ? "Sold Out" : "Get Tickets"}
                    </button>
                    <button className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.08)] transition-colors rounded-sm px-6 py-3.5 text-[13px] text-white uppercase tracking-[0.12em] font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
