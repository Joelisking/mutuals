export default function FeaturedArticle() {
  return (
    <section className="bg-[#050507] py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        <div
          className="relative rounded-none md:rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] group hover:border-[rgba(255,255,255,0.15)] transition-all h-[600px] md:h-[700px] lg:h-[800px]"
          style={{
            backgroundImage: `url(/assets/featured-afrobeats.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          {/* Animated background scale on hover */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(/assets/featured-afrobeats.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Dramatic gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[#050507] via-[rgba(5,5,7,0.75)] to-[rgba(5,5,7,0.3)]" />

          {/* Noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
            }}
          />

          {/* Featured Badge */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] px-4 py-1.5 rounded-sm">
              <span className="text-[11px] md:text-[12px] text-white uppercase tracking-[0.15em] font-medium">
                Featured
              </span>
            </div>
          </div>

          {/* Content - Positioned at bottom */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-16 z-10">
            <div className="max-w-[900px] space-y-6">
              {/* Category tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.6)] uppercase tracking-[0.12em] font-medium">
                  Music
                </span>
                <span className="text-[rgba(255,255,255,0.4)]">
                  •
                </span>
                <span className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.6)] uppercase tracking-[0.12em] font-medium">
                  Profile
                </span>
              </div>

              {/* Title */}
              <h2 className="text-[40px] md:text-[56px] lg:text-[72px] text-white leading-[1.05] tracking-[-0.03em] font-medium drop-shadow-2xl">
                The New Wave of Afrobeats
              </h2>

              {/* Description */}
              <p className="text-[16px] md:text-[18px] lg:text-[19px] text-[rgba(255,255,255,0.85)] leading-relaxed max-w-[700px] font-light drop-shadow-lg">
                How a new generation of artists is redefining the
                sound and pushing the genre into bold, experimental
                territory. From Lagos to London, the culture is
                evolving.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-[13px] text-[rgba(255,255,255,0.5)] font-light">
                  <span>By Mutuals+ Editorial</span>
                  <span>•</span>
                  <span>Nov 20, 2025</span>
                </div>

                {/* CTA */}
                <button className="group/btn inline-flex items-center gap-3 text-white hover:text-[#1ecbe1] transition-colors">
                  <span className="text-[13px] uppercase tracking-[0.12em] font-medium">
                    Read Article
                  </span>
                  <svg
                    className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 20 20">
                    <path
                      d="M4.16667 10H15.8333"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 4.16667L15.8333 10L10 15.8333"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
