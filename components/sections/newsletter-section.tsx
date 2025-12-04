"use client";

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service
    console.log('Newsletter signup:', email);
  };

  return (
    <section className="bg-[#050507] border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20">
        <div className="text-center max-w-[800px] mx-auto">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-sm px-4 py-2 inline-flex items-center gap-2 mb-6">
            <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">Stay Connected</span>
          </div>
          <h2 className="text-[28px] md:text-[32px] lg:text-[36px] text-white tracking-[-0.02em] font-medium mb-4">
            Never Miss a Drop
          </h2>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.6)] mb-10 font-light">
            Get the latest drops, event announcements, and editorial content delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[600px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-sm px-5 py-3.5 text-[15px] text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#1ecbe1] transition-colors font-light"
            />
            <button type="submit" className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-8 py-3.5 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium whitespace-nowrap flex items-center justify-center gap-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
