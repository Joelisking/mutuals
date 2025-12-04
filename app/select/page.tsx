'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { selectProfiles, getProfilesByCategory } from '@/lib/data/select-data';

const categories = ['All', 'Music', 'Fashion', 'Art', 'Photography', 'Business'];

export default function SelectPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProfiles = getProfilesByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-[#050507] pt-32 md:pt-36">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-[56px] md:text-[72px] lg:text-[96px] text-white tracking-[-0.03em] font-medium">
              SELECT
            </h1>
            <span className="text-[32px] md:text-[48px] lg:text-[64px] text-[#1ecbe1] tracking-[-0.03em] font-medium">
              +
            </span>
          </div>
          <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.6)] max-w-[600px] font-light leading-relaxed">
            Spotlighting exceptional individuals and brands shaping culture across the diaspora. From emerging artists to groundbreaking collectives, these are the voices defining tomorrow.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-sm text-[13px] uppercase tracking-[0.12em] font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-[#050507]'
                    : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Profiles */}
        {selectedCategory === 'All' && filteredProfiles.some(p => p.featured) && (
          <div className="mb-20">
            <h2 className="text-[24px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-8">
              Featured
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProfiles
                .filter(profile => profile.featured)
                .slice(0, 2)
                .map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/select/${profile.slug}`}
                    className="group"
                  >
                    <div className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] rounded-[4px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all h-full">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          width={800}
                          height={600}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <span className="bg-[#1ecbe1] px-4 py-2 rounded-sm text-[11px] text-[#050507] uppercase tracking-[0.12em] font-bold">
                            {profile.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-[rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 16 16">
                            <path d="M8 1L10 6L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 6L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                            {profile.location}
                          </span>
                        </div>

                        <h3 className="text-[28px] md:text-[32px] text-white tracking-[-0.02em] font-medium mb-2">
                          {profile.name}
                        </h3>

                        <p className="text-[14px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium mb-4">
                          {profile.title}
                        </p>

                        <p className="text-[15px] text-[rgba(255,255,255,0.7)] mb-6 font-light leading-relaxed">
                          {profile.description}
                        </p>

                        {/* Stats */}
                        {profile.stats && profile.stats.length > 0 && (
                          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                            {profile.stats.slice(0, 3).map((stat, index) => (
                              <div key={index}>
                                <div className="text-[20px] md:text-[24px] text-white font-medium">
                                  {stat.value}
                                </div>
                                <div className="text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-light">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles
            .filter(profile => selectedCategory === 'All' ? !profile.featured : true)
            .map((profile) => (
              <Link
                key={profile.id}
                href={`/select/${profile.slug}`}
                className="group"
              >
                <div className="bg-[#0a0a0f] rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width={600}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-40" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm text-[11px] text-white uppercase tracking-[0.12em] font-medium">
                        {profile.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-3 h-3 text-[rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                      </svg>
                      <span className="text-[11px] text-[rgba(255,255,255,0.5)] font-light">
                        {profile.location}
                      </span>
                    </div>

                    <h3 className="text-[22px] md:text-[24px] text-white tracking-[-0.01em] font-medium mb-2 leading-tight">
                      {profile.name}
                    </h3>

                    <p className="text-[13px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium mb-3">
                      {profile.title}
                    </p>

                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] mb-4 font-light leading-relaxed flex-1">
                      {profile.description}
                    </p>

                    {/* Social Links */}
                    {profile.socialLinks && (
                      <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                        {profile.socialLinks.instagram && (
                          <div className="text-[11px] text-[rgba(255,255,255,0.5)] font-light">
                            {profile.socialLinks.instagram}
                          </div>
                        )}
                        <span className="text-[13px] text-[#1ecbe1] uppercase tracking-[0.12em] font-medium group-hover:text-white transition-colors ml-auto">
                          View Profile
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[18px] text-[rgba(255,255,255,0.5)] font-light">
              No profiles found in this category.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-[4px] px-8 md:px-12 py-12 md:py-16 text-center">
          <h3 className="text-[28px] md:text-[36px] text-white tracking-[-0.02em] font-medium mb-4">
            Know someone who should be featured?
          </h3>
          <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.7)] mb-8 font-light max-w-[600px] mx-auto">
            We're always looking to spotlight exceptional talent and innovative brands from the diaspora. Nominate yourself or someone you admire.
          </p>
          <button className="bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-8 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
            Submit Nomination
          </button>
        </div>
      </div>
    </div>
  );
}
