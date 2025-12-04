import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Brand */}
          <div>
            <Image
              src="/assets/mutuals-logo.png"
              alt="Mutuals+"
              width={100}
              height={28}
              className="h-[24px] md:h-[28px] mb-4 w-auto"
            />
            <p className="text-[14px] text-[rgba(255,255,255,0.5)] leading-relaxed mb-6 font-light">
              A culture-forward platform spotlighting emerging
              artists, DJs, designers, and creatives across the
              African diaspora and beyond.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm p-2.5 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] transition-all">
                <svg
                  className="w-4 h-4"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm p-2.5 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] transition-all">
                <svg
                  className="w-4 h-4"
                  fill="white"
                  viewBox="0 0 24 24">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                  />
                  <path
                    d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"
                    stroke="#050507"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm p-2.5 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] transition-all">
                <svg
                  className="w-4 h-4"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Editorial Links */}
          <div>
            <h4 className="text-[12px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] mb-6 font-medium">
              Editorial
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Latest Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Artist Profiles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Interviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Culture News
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-[12px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] mb-6 font-medium">
              Platform
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Submit Your Work
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Partnerships
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[12px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] mb-6 font-medium">
              Legal
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors font-light">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[rgba(255,255,255,0.08)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-[rgba(255,255,255,0.4)] font-light">
              © 2025 Mutuals+. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
