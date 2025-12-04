export interface MerchItem {
  name: string;
  price: string;
  tag: string;
  image: string;
}

export const merchItems: MerchItem[] = [
  {
    name: "MUTUALS+ TEE",
    price: "$45",
    tag: "Limited Edition",
    image: "/assets/featured-afrobeats.png"
  },
  {
    name: "CULTURE+ HOODIE",
    price: "$85",
    tag: "New",
    image: "/assets/editorial-designer.png"
  },
  {
    name: "DIASPORA CAP",
    price: "$35",
    tag: "Best Seller",
    image: "/assets/editorial-street-art.png"
  },
  {
    name: "SOUND+ TOTE",
    price: "$40",
    tag: "Limited Edition",
    image: "/assets/editorial-diaspora.png"
  }
];
