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
        <div className="mb-12 md:mb-16">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] text-white tracking-[-0.02em] font-medium mb-3">
            Merch
          </h2>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.5)] font-light max-w-[600px]">
            Limited-run merchandise. Wear the culture.
          </p>
        </div>

        {/* Merch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {merchItems.map((item, index) => (
            <div key={index} className="bg-[#050507] rounded-none md:rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all group">
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-40" />
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white hover:bg-[rgba(255,255,255,0.95)] transition-colors rounded-sm px-5 py-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <circle cx="6" cy="13" r="1" stroke="#050507" strokeWidth="1.5" />
                      <circle cx="13" cy="13" r="1" stroke="#050507" strokeWidth="1.5" />
                      <path d="M1 1h2l2.68 7.39a1 1 0 00.95.68h6.74a1 1 0 00.95-.68L16 4H4" stroke="#050507" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[12px] text-[#050507] uppercase tracking-[0.12em] font-medium">Add to Cart</span>
                  </div>
                </button>
                <div className="absolute top-4 right-4 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-sm px-2.5 py-1">
                  <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">{item.tag}</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-[16px] md:text-[18px] text-white tracking-[-0.01em] font-medium mb-1">
                  {item.name}
                </h4>
                <p className="text-[15px] text-[rgba(255,255,255,0.7)] font-light">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* New Drop CTA */}
        <div className="bg-gradient-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-none md:rounded-[4px] px-8 md:px-12 py-12 md:py-16 text-center">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-2 inline-flex items-center gap-2 mb-6">
            <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">Exclusive Access</span>
          </div>
          <h3 className="text-[28px] md:text-[32px] lg:text-[36px] text-white tracking-[-0.02em] font-medium mb-4">
            New Drop Every Month
          </h3>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.7)] max-w-[550px] mx-auto mb-8 font-light">
            Subscribe to get early access to limited-run merchandise and exclusive collaborations
          </p>
          <button className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-10 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
