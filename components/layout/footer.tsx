import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Brand */}
          <div>
            <Image
              src="/assets/mutuals-logo.png"
              alt="Mutuals+"
              width={100}
              height={28}
              className="h-6 md:h-7 mb-4 w-auto"
            />
            <p className="text-sm text-white/50 leading-relaxed mb-6 font-light">
              A culture-forward platform spotlighting emerging
              artists, DJs, designers, and creatives across the
              African diaspora and beyond.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/mutualsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/8 hover:border-white/20 transition-all"
                aria-label="X">
                <svg
                  className="w-4 h-4"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mutualsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/8 hover:border-white/20 transition-all"
                aria-label="Instagram">
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
                href="https://www.youtube.com/@mutualsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/8 hover:border-white/20 transition-all"
                aria-label="YouTube">
                <svg
                  className="w-4 h-4"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Editorial Links */}
          <div>
            <h4 className="text-xs text-white/70 uppercase tracking-[0.12em] mb-6 font-medium">
              Editorial
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Latest Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Artist Profiles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Interviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Culture News
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs text-white/70 uppercase tracking-[0.12em] mb-6 font-medium">
              Platform
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/submissions"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Submissions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Partnerships
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs text-white/70 uppercase tracking-[0.12em] mb-6 font-medium">
              Legal
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-white transition-colors font-light">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40 font-light">
              © 2025 Mutuals+. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
