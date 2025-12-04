'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(5,5,7,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/mutuals-logo.png"
                alt="Mutuals+"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/editorial"
              className="text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              Editorial
            </Link>
            <Link
              href="/select"
              className="text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              SELECT+
            </Link>
            <Link
              href="/#playlists"
              className="text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              Playlists
            </Link>
            <Link
              href="/#events"
              className="text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              Events
            </Link>
            <Link
              href="/shop"
              className="text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
              Shop
            </Link>
          </div>

          {/* CTA Button + Cart (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/shop/cart"
              className="relative p-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
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
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1ecbe1] text-[#050507] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-all rounded-sm px-5 py-2.5 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
              Subscribe
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
          <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] py-6 space-y-4">
            <Link
              href="/editorial"
              className="block text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
              Editorial
            </Link>
            <Link
              href="/select"
              className="block text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
              SELECT+
            </Link>
            <Link
              href="/#playlists"
              className="block text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
              Playlists
            </Link>
            <Link
              href="/#events"
              className="block text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
              Events
            </Link>
            <Link
              href="/shop"
              className="block text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
              Shop
            </Link>
            <Link
              href="/shop/cart"
              className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium py-2">
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
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
            <button className="w-full bg-white hover:bg-[rgba(255,255,255,0.9)] transition-all rounded-sm px-5 py-2.5 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium mt-4">
              Subscribe
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
