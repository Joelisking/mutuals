export interface SelectProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  bio: string;
  category: string;
  location: string;
  date: string;
  image: string;
  video?: string; // Optional video URL for motion-based thumbnails
  episodeNumber?: number; // For SELECT+ EP. numbering (e.g., 1 for EP. 001)
  featured: boolean;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  stats?: {
    label: string;
    value: string;
  }[];
}

export const selectProfiles: SelectProfile[] = [
  {
    id: "1",
    slug: "dj-kemi-lagos",
    name: "DJ Kemi",
    title: "Sound Architect",
    description: "Blending Afrobeats with Electronic Futures",
    bio: "DJ Kemi is reshaping the sound of Lagos nightlife. With a unique ability to blend traditional Afrobeats rhythms with cutting-edge electronic production, she's become one of the most sought-after DJs in West Africa. Her monthly residency at The Shrine has become legendary, drawing crowds from across the continent.",
    category: "Music",
    location: "Lagos, Nigeria",
    date: "Nov 20, 2025",
    image: "/assets/featured-playlist.png",
    episodeNumber: 1,
    featured: true,
    socialLinks: {
      instagram: "@djkemi",
      twitter: "@djkemi",
      website: "djkemi.com"
    },
    stats: [
      { label: "Years Active", value: "8" },
      { label: "Countries Toured", value: "15" },
      { label: "Monthly Listeners", value: "250K" }
    ]
  },
  {
    id: "2",
    slug: "studio-adire",
    name: "Studio Adire",
    title: "Contemporary Textile Brand",
    description: "Reimagining Traditional Dyeing Techniques",
    bio: "Studio Adire is a Lagos-based textile brand bringing traditional Nigerian tie-dye techniques into the contemporary fashion world. Founded by sisters Ade and Folake Ogunleye, the studio collaborates with local artisans to create limited-edition fabrics that honor ancestral craft while pushing creative boundaries.",
    category: "Fashion",
    location: "Lagos, Nigeria",
    date: "Nov 17, 2025",
    image: "/assets/editorial-designer.png",
    episodeNumber: 2,
    featured: true,
    socialLinks: {
      instagram: "@studioadire",
      website: "studioadire.com"
    },
    stats: [
      { label: "Founded", value: "2021" },
      { label: "Artisan Partners", value: "40" },
      { label: "Collections Released", value: "12" }
    ]
  },
  {
    id: "3",
    slug: "kwame-visual-artist",
    name: "Kwame Asante",
    title: "Visual Artist & Muralist",
    description: "Painting Stories of Diaspora Identity",
    bio: "Kwame Asante's large-scale murals have transformed walls across Accra, London, and New York. His work explores themes of migration, memory, and belonging through vibrant colors and symbolic imagery drawn from Ghanaian folklore. Each piece tells a story of connection between the continent and its diaspora.",
    category: "Art",
    location: "Accra, Ghana",
    date: "Nov 14, 2025",
    image: "/assets/editorial-street-art.png",
    episodeNumber: 3,
    featured: false,
    socialLinks: {
      instagram: "@kwameasante.art",
      website: "kwameasante.art"
    },
    stats: [
      { label: "Murals Created", value: "45" },
      { label: "Cities", value: "12" },
      { label: "Square Meters Painted", value: "2000+" }
    ]
  },
  {
    id: "4",
    slug: "amara-music-producer",
    name: "Amara",
    title: "Music Producer",
    description: "Crafting the Sound of Tomorrow",
    bio: "Producer Amara is behind some of the biggest Afrobeats hits of the past two years. Working from her studio in London, she's developed a signature sound that blends West African percussion with UK electronic influences. She's produced for artists across three continents and shows no signs of slowing down.",
    category: "Music",
    location: "London, UK",
    date: "Nov 11, 2025",
    image: "/assets/editorial-diaspora.png",
    episodeNumber: 4,
    featured: false,
    socialLinks: {
      instagram: "@amaraproduces",
      twitter: "@amaraproduces"
    },
    stats: [
      { label: "Tracks Produced", value: "150+" },
      { label: "Chart Entries", value: "23" },
      { label: "Collaborations", value: "60+" }
    ]
  },
  {
    id: "5",
    slug: "black-owned-cafe-collective",
    name: "The Commons Collective",
    title: "Community Cafe & Creative Space",
    description: "Building Community Through Coffee & Culture",
    bio: "The Commons Collective is more than a cafe—it's a cultural hub in the heart of Brooklyn. Founded by three friends from the diaspora, the space hosts everything from poetry slams to art exhibitions, DJ sets to book clubs. Their mission is simple: create a space where Black creatives can gather, collaborate, and thrive.",
    category: "Business",
    location: "Brooklyn, New York",
    date: "Nov 6, 2025",
    image: "/assets/editorial-visual-culture.png",
    episodeNumber: 5,
    featured: true,
    socialLinks: {
      instagram: "@thecommonscollective",
      website: "thecommonscollective.com"
    },
    stats: [
      { label: "Events Hosted", value: "200+" },
      { label: "Artists Supported", value: "300+" },
      { label: "Community Members", value: "5K+" }
    ]
  },
  {
    id: "6",
    slug: "zara-photographer",
    name: "Zara Ibrahim",
    title: "Documentary Photographer",
    description: "Capturing Untold Stories of the Diaspora",
    bio: "Zara Ibrahim's photography work documents the everyday lives of diaspora communities across Europe. Her intimate portraits and street photography reveal the beauty, struggle, and resilience of Black communities often overlooked by mainstream media. Her recent exhibition 'Home is Everywhere' toured five European cities.",
    category: "Photography",
    location: "Paris, France",
    date: "Nov 3, 2025",
    image: "/assets/editorial-next-gen.png",
    episodeNumber: 6,
    featured: false,
    socialLinks: {
      instagram: "@zaraibrahimphotography",
      website: "zaraibrahim.com"
    },
    stats: [
      { label: "Exhibitions", value: "8" },
      { label: "Published Works", value: "3 Books" },
      { label: "Awards", value: "5" }
    ]
  }
];

export function getSelectProfileBySlug(slug: string): SelectProfile | undefined {
  return selectProfiles.find(profile => profile.slug === slug);
}

export function getFeaturedProfiles(): SelectProfile[] {
  return selectProfiles.filter(profile => profile.featured);
}

export function getProfilesByCategory(category: string): SelectProfile[] {
  if (category === 'All') return selectProfiles;
  return selectProfiles.filter(profile => profile.category === category);
}
