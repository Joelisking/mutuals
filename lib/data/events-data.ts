export interface Event {
  title: string;
  date: string;
  location: string;
  type: string;
  status: string;
  image: string;
}

export const events: Event[] = [
  {
    title: "CULTURE NIGHTS",
    date: "DEC 15, 2025",
    location: "Lagos, Nigeria",
    type: "Live Performance",
    status: "On Sale",
    image: "/assets/editorial-visual-culture.png"
  },
  {
    title: "DIASPORA FEST",
    date: "JAN 20, 2026",
    location: "London, UK",
    type: "Festival",
    status: "Sold Out",
    image: "/assets/editorial-next-gen.png"
  },
  {
    title: "ART + SOUND SHOWCASE",
    date: "FEB 8, 2026",
    location: "New York, USA",
    type: "Exhibition",
    status: "On Sale",
    image: "/assets/editorial-street-art.png"
  }
];
