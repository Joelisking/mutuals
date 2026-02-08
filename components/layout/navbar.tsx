'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isShopPage = pathname?.startsWith('/shop');

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/mutuals-logo.png"
                  alt="Mutuals+ Logo"
                  width={120}
                  height={40}
                  className="w-full"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/editorial"
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                Editorial
              </Link>
              <Link
                href="/#playlists"
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                Playlists
              </Link>
              <Link
                href="/events"
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                Events
              </Link>
              <Link
                href="/shop"
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                Shop
              </Link>
              <Link
                href="/select"
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                SELECT+
              </Link>
            </div>

            {/* Cart + Hamburger (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {!isShopPage && totalItems > 0 && (
                <Link
                  href="/shop/cart"
                  className="relative p-2 text-white/70 hover:text-white transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-[#1ecbe1] text-[#050507] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setIsSheetOpen(true)}
                className="text-white/70 hover:text-white p-2 transition-colors"
                aria-label="Open menu">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/8 py-6 space-y-4 px-4">
              <Link
                href="/editorial"
                className="block text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                Editorial
              </Link>
              <Link
                href="/select"
                className="block text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                SELECT+
              </Link>
              <Link
                href="/#playlists"
                className="block text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                Playlists
              </Link>
              <Link
                href="/events"
                className="block text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                Events
              </Link>
              <Link
                href="/shop"
                className="block text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                Shop
              </Link>
              {!isShopPage && totalItems > 0 && (
                <Link
                  href="/shop/cart"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Cart ({totalItems})
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sheet Overlay */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      {/* Sheet Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black z-[70] transform transition-transform duration-300 ease-out ${
          isSheetOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full p-8">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsSheetOpen(false)}
              className="text-white/70 hover:text-white p-2 transition-colors"
              aria-label="Close menu">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* About Content */}
          <div className="flex-1">
            <h2 className="text-xs text-white/70 uppercase tracking-[0.2em] mb-6 font-medium">
              About
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Mutuals+ is a culture-forward platform spotlighting emerging
              artists, DJs, designers, and creatives across the African
              diaspora and beyond.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              We curate and amplify the voices shaping contemporary culture
              through editorial content, curated playlists, events, and
              community-driven initiatives.
            </p>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-white/10">
            <h3 className="text-xs text-white/70 uppercase tracking-[0.2em] mb-6 font-medium">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://x.com/mutualsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-sm p-3 hover:bg-white/10 hover:border-white/20 transition-all"
                aria-label="X">
                <svg
                  className="w-5 h-5"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mutualsplus"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-sm p-3 hover:bg-white/10 hover:border-white/20 transition-all"
                aria-label="Instagram">
                <svg
                  className="w-5 h-5"
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
                    stroke="#000"
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
                className="bg-white/5 border border-white/10 rounded-sm p-3 hover:bg-white/10 hover:border-white/20 transition-all"
                aria-label="YouTube">
                <svg
                  className="w-5 h-5"
                  fill="white"
                  viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
