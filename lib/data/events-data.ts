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
  },
  {
    title: "AFROBEATS LIVE",
    date: "MAR 5, 2026",
    location: "Accra, Ghana",
    type: "Concert",
    status: "On Sale",
    image: "/assets/editorial-visual-culture.png"
  },
  {
    title: "CREATIVE SUMMIT",
    date: "MAR 22, 2026",
    location: "Toronto, Canada",
    type: "Conference",
    status: "On Sale",
    image: "/assets/editorial-next-gen.png"
  },
  {
    title: "FASHION FORWARD",
    date: "APR 10, 2026",
    location: "Paris, France",
    type: "Fashion Show",
    status: "On Sale",
    image: "/assets/editorial-street-art.png"
  },
  {
    title: "VINYL SESSIONS",
    date: "APR 28, 2026",
    location: "Brooklyn, USA",
    type: "Listening Party",
    status: "Sold Out",
    image: "/assets/editorial-visual-culture.png"
  },
  {
    title: "CULTURAL EXCHANGE",
    date: "MAY 15, 2026",
    location: "Johannesburg, SA",
    type: "Workshop",
    status: "On Sale",
    image: "/assets/editorial-next-gen.png"
  }
];
