export interface EditorialItem {
  title: string;
  description: string;
  tag: string;
  category: string;
  date: string;
  image: string;
}

export const editorialItems: EditorialItem[] = [
  {
    title: "Street Art Renaissance",
    description: "Urban Voices Breaking Boundaries",
    tag: "PROFILE",
    category: "Art",
    date: "Nov 18, 2025",
    image: "/assets/editorial-street-art.png"
  },
  {
    title: "Designer Spotlight",
    description: "Redefining Contemporary Fashion",
    tag: "INTERVIEW",
    category: "Fashion",
    date: "Nov 15, 2025",
    image: "/assets/editorial-designer.png"
  },
  {
    title: "Sound of the Diaspora",
    description: "Emerging Producers Shaping the Future",
    tag: "SELECT",
    category: "Music",
    date: "Nov 12, 2025",
    image: "/assets/editorial-diaspora.png"
  },
  {
    title: "Visual Culture Now",
    description: "Photography at the Intersection",
    tag: "FEATURE",
    category: "Photography",
    date: "Nov 10, 2025",
    image: "/assets/editorial-visual-culture.png"
  },
  {
    title: "Next Gen Voices",
    description: "Poets Rewriting the Narrative",
    tag: "INTERVIEW",
    category: "Literature",
    date: "Nov 8, 2025",
    image: "/assets/editorial-next-gen.png"
  }
];
