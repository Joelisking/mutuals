import Hero from "@/components/sections/hero";
import FeaturedArticle from "@/components/sections/featured-article";
import EditorialSection from "@/components/sections/editorial-section";
import SelectSection from "@/components/sections/select-section";
import PlaylistsSection from "@/components/sections/playlists-section";
import EventsSection from "@/components/sections/events-section";
import MerchSection from "@/components/sections/merch-section";
import NewsletterSection from "@/components/sections/newsletter-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#050507] font-sans">
      <Hero />
      <FeaturedArticle />
      <section id="editorial">
        <EditorialSection />
      </section>
      <section id="select">
        <SelectSection />
      </section>
      <section id="playlists">
        <PlaylistsSection />
      </section>
      <section id="events">
        <EventsSection />
      </section>
      <section id="merch">
        <MerchSection />
      </section>
      <NewsletterSection />
    </div>
  );
}
