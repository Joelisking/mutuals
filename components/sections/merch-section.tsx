import { merchItems } from '@/lib/data/merch-data';
import Image from 'next/image';

export default function MerchSection() {
  return (
    <section className="bg-[#0a0a0f] py-16 md:py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute bg-[#1ecbe1] blur-[200px] left-0 opacity-[0.06] rounded-full w-[500px] h-[500px] top-[20%]" />
      <div className="absolute bg-[#ff6b35] blur-[220px] right-[10%] opacity-[0.06] rounded-full w-[600px] h-[600px] top-[30%]" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-3">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-1">
            Shop
          </h2>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
            Limited-run merchandise. Wear the culture.
          </p>
        </div>

        {/* Merch Grid - Matching carousel card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {merchItems.map((item, index) => (
            <button key={index} className="group block text-left">
              <div className="flex flex-col h-full">
                {/* Image Container - Reduced visual weight */}
                <div className="relative aspect-square overflow-hidden rounded-[2px] mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.4)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Tag badge - minimal styling */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] text-white uppercase tracking-[0.15em] font-semibold bg-[rgba(0,0,0,0.6)] backdrop-blur-sm px-2.5 py-1 rounded-[2px]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Add to Cart button - appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white hover:bg-[rgba(255,255,255,0.95)] transition-colors rounded-sm px-5 py-2.5 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 16 16">
                        <circle
                          cx="6"
                          cy="13"
                          r="1"
                          stroke="#050507"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="13"
                          cy="13"
                          r="1"
                          stroke="#050507"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M1 1h2l2.68 7.39a1 1 0 00.95.68h6.74a1 1 0 00.95-.68L16 4H4"
                          stroke="#050507"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[12px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content - Typography-led structure */}
                <div className="flex flex-col flex-1">
                  {/* Product Name */}
                  <h4 className="text-[18px] md:text-[20px] text-white tracking-[-0.01em] font-medium mb-2 leading-tight group-hover:text-[#1ecbe1] transition-colors">
                    {item.name}
                  </h4>

                  {/* Price */}
                  <p className="text-[15px] text-[rgba(255,255,255,0.7)] font-light">
                    {item.price}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* New Drop CTA */}
        <div className="bg-gradient-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-none md:rounded-[4px] px-8 md:px-12 py-12 md:py-16 text-center">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-2 inline-flex items-center gap-2 mb-6">
            <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">
              Exclusive Access
            </span>
          </div>
          <h3 className="text-[28px] md:text-[32px] lg:text-[36px] text-white tracking-[-0.02em] font-medium mb-4">
            New Drop Every Month
          </h3>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.7)] max-w-[550px] mx-auto mb-8 font-light">
            Subscribe to get early access to limited-run merchandise
            and exclusive collaborations
          </p>
          <button className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-10 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
