export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  tag: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  video?: string; // Optional video URL for motion-based thumbnails
  featured: boolean;
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "street-art-renaissance",
    title: "Street Art Renaissance",
    description: "Urban Voices Breaking Boundaries",
    excerpt: "Exploring the new wave of street artists transforming urban landscapes across the diaspora, from Lagos to London.",
    content: "In cities across the African diaspora, a new generation of street artists is redefining public art. From the vibrant murals of Lagos to the thought-provoking installations in London, these artists are using walls as canvases to tell stories of identity, resistance, and hope. This movement goes beyond aesthetics—it's a form of cultural documentation and social commentary that challenges traditional notions of where art belongs.",
    tag: "FEATURE",
    category: "Art",
    date: "Nov 18, 2025",
    author: "Amara Williams",
    readTime: "8 min read",
    image: "/assets/editorial-street-art.png",
    featured: true
  },
  {
    id: "2",
    slug: "designer-spotlight-ayo-collective",
    title: "Designer Spotlight: Ayo Collective",
    description: "Redefining Contemporary Fashion",
    excerpt: "How a Nigerian design studio is merging traditional craftsmanship with futuristic aesthetics.",
    content: "Ayo Collective is pushing boundaries in contemporary African fashion. Based in Lagos, the design studio seamlessly blends traditional Nigerian craftsmanship with cutting-edge design techniques. Their latest collection showcases hand-woven textiles reimagined through a modern lens, creating pieces that honor heritage while embracing innovation.",
    tag: "INTERVIEW",
    category: "Fashion",
    date: "Nov 15, 2025",
    author: "Kofi Mensah",
    readTime: "6 min read",
    image: "/assets/editorial-designer.png",
    featured: false
  },
  {
    id: "3",
    slug: "visual-culture-photography",
    title: "Visual Culture Now",
    description: "Photography at the Intersection",
    excerpt: "Contemporary photographers documenting the evolving narrative of Black identity and culture.",
    content: "A new generation of photographers is redefining visual storytelling. Through their lenses, they capture the nuances of Black culture—from intimate family moments to bold street fashion. These visual narratives challenge stereotypes and celebrate the diversity of Black experiences globally.",
    tag: "FEATURE",
    category: "Photography",
    date: "Nov 10, 2025",
    author: "Zara Hassan",
    readTime: "7 min read",
    image: "/assets/editorial-visual-culture.png",
    featured: false
  },
  {
    id: "4",
    slug: "next-gen-voices-poetry",
    title: "Next Gen Voices",
    description: "Poets Rewriting the Narrative",
    excerpt: "Young poets using verse to explore identity, displacement, and belonging in the modern diaspora.",
    content: "From spoken word stages to Instagram feeds, a new wave of poets is captivating audiences with raw, honest reflections on diaspora life. These writers are tackling themes of dual identity, cultural displacement, and the search for belonging with refreshing vulnerability and linguistic innovation.",
    tag: "INTERVIEW",
    category: "Literature",
    date: "Nov 8, 2025",
    author: "Nadia Thompson",
    readTime: "5 min read",
    image: "/assets/editorial-next-gen.png",
    featured: false
  },
  {
    id: "5",
    slug: "afrobeats-global-movement",
    title: "Afrobeats: The Global Movement",
    description: "How African Sounds Are Dominating World Charts",
    excerpt: "Tracing the journey of Afrobeats from Lagos nightclubs to Billboard charts and sold-out stadiums worldwide.",
    content: "Afrobeats has transcended its Nigerian origins to become a global phenomenon. Artists like Burna Boy, Wizkid, and Tems are not just topping charts—they're reshaping the sound of popular music. This article explores how the genre's infectious rhythms and innovative production have captured the world's attention.",
    tag: "FEATURE",
    category: "Music",
    date: "Nov 5, 2025",
    author: "Kwame Osei",
    readTime: "9 min read",
    image: "/assets/featured-afrobeats.png",
    featured: true
  },
  {
    id: "6",
    slug: "diaspora-film-makers",
    title: "Telling Our Stories",
    description: "Diaspora Filmmakers Breaking Through",
    excerpt: "Independent filmmakers creating authentic narratives that challenge Hollywood's narrow perspectives.",
    content: "A wave of diaspora filmmakers is taking control of their narratives. From intimate documentaries to bold feature films, these creators are telling stories that mainstream cinema has long overlooked. Their work celebrates cultural specificity while exploring universal themes of family, identity, and ambition.",
    tag: "PROFILE",
    category: "Film",
    date: "Nov 2, 2025",
    author: "Chimamanda Adeyemi",
    readTime: "8 min read",
    image: "/assets/editorial-street-art.png",
    featured: false
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter(article => article.featured);
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'All') return articles;
  return articles.filter(article => article.category === category);
}
