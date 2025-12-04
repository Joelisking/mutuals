export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  materials: string;
  sizeGuide: string;
  images: string[];
  sizes: string[];
  inStock: boolean;
  stockLevel: 'in-stock' | 'low-stock' | 'sold-out';
  tags: string[];
  relatedProducts?: string[]; // Product IDs
}

export const products: Product[] = [
  {
    id: 'mutuals-tee-black',
    name: 'MUTUALS+ TEE',
    slug: 'mutuals-tee-black',
    price: 45,
    category: 'T-Shirts',
    description: 'Limited edition heavyweight cotton tee featuring the Mutuals+ logo. Crafted for the culture, built to last. This piece represents more than fashion—it\'s a statement of community and creative excellence.',
    materials: '100% heavyweight cotton, 220gsm. Pre-shrunk fabric. Screen-printed logo with water-based inks.',
    sizeGuide: 'S (Chest: 36-38"), M (Chest: 38-40"), L (Chest: 42-44"), XL (Chest: 46-48"), XXL (Chest: 50-52")',
    images: ['/assets/featured-afrobeats.png', '/assets/editorial-street-art.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockLevel: 'low-stock',
    tags: ['Limited Edition', 'Bestseller'],
    relatedProducts: ['culture-hoodie-black', 'diaspora-cap-black']
  },
  {
    id: 'culture-hoodie-black',
    name: 'CULTURE+ HOODIE',
    slug: 'culture-hoodie-black',
    price: 85,
    category: 'Hoodies',
    description: 'Premium heavyweight fleece hoodie with embroidered details. Features a relaxed fit, kangaroo pocket, and ribbed cuffs. Designed for those who carry the culture forward.',
    materials: '80% cotton, 20% polyester blend. 320gsm brushed fleece. Embroidered logo and details.',
    sizeGuide: 'S (Chest: 38-40"), M (Chest: 40-42"), L (Chest: 44-46"), XL (Chest: 48-50"), XXL (Chest: 52-54")',
    images: ['/assets/editorial-designer.png', '/assets/editorial-diaspora.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockLevel: 'in-stock',
    tags: ['New', 'Premium'],
    relatedProducts: ['mutuals-tee-black', 'sound-tote-natural']
  },
  {
    id: 'diaspora-cap-black',
    name: 'DIASPORA CAP',
    slug: 'diaspora-cap-black',
    price: 35,
    category: 'Accessories',
    description: 'Classic 6-panel cap with embroidered branding. Adjustable strap for perfect fit. A subtle way to represent the movement.',
    materials: '100% cotton twill. Embroidered front logo. Adjustable metal strap closure.',
    sizeGuide: 'One size fits most. Adjustable from 21" to 24" circumference.',
    images: ['/assets/editorial-street-art.png', '/assets/editorial-visual-culture.png'],
    sizes: ['One Size'],
    inStock: true,
    stockLevel: 'in-stock',
    tags: ['Bestseller', 'Everyday'],
    relatedProducts: ['mutuals-tee-black', 'sound-tote-natural']
  },
  {
    id: 'sound-tote-natural',
    name: 'SOUND+ TOTE',
    slug: 'sound-tote-natural',
    price: 40,
    category: 'Accessories',
    description: 'Heavy-duty canvas tote bag with screen-printed graphics. Perfect for records, books, or daily essentials. Built to carry the weight of culture.',
    materials: '12oz natural canvas. Screen-printed design. Reinforced handles and seams.',
    sizeGuide: 'Width: 15", Height: 16", Depth: 5". Handle drop: 11"',
    images: ['/assets/editorial-diaspora.png', '/assets/editorial-next-gen.png'],
    sizes: ['One Size'],
    inStock: true,
    stockLevel: 'in-stock',
    tags: ['Limited Edition', 'Sustainable'],
    relatedProducts: ['diaspora-cap-black', 'culture-hoodie-black']
  },
  {
    id: 'archive-tee-white',
    name: 'ARCHIVE TEE',
    slug: 'archive-tee-white',
    price: 45,
    category: 'T-Shirts',
    description: 'Clean white tee with archive graphics from our editorial series. A wearable piece of Mutuals+ history.',
    materials: '100% heavyweight cotton, 220gsm. Pre-shrunk fabric. Screen-printed graphics.',
    sizeGuide: 'S (Chest: 36-38"), M (Chest: 38-40"), L (Chest: 42-44"), XL (Chest: 46-48"), XXL (Chest: 50-52")',
    images: ['/assets/editorial-visual-culture.png', '/assets/featured-playlist.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockLevel: 'in-stock',
    tags: ['New'],
    relatedProducts: ['mutuals-tee-black', 'culture-hoodie-black']
  },
  {
    id: 'futures-hoodie-grey',
    name: 'FUTURES HOODIE',
    slug: 'futures-hoodie-grey',
    price: 85,
    category: 'Hoodies',
    description: 'Premium heather grey hoodie with future-forward graphics. Oversized fit for maximum comfort.',
    materials: '80% cotton, 20% polyester blend. 320gsm brushed fleece. Screen-printed graphics.',
    sizeGuide: 'S (Chest: 38-40"), M (Chest: 40-42"), L (Chest: 44-46"), XL (Chest: 48-50"), XXL (Chest: 52-54")',
    images: ['/assets/editorial-next-gen.png', '/assets/featured-afrobeats.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
    stockLevel: 'sold-out',
    tags: ['Sold Out'],
    relatedProducts: ['culture-hoodie-black']
  },
  {
    id: 'collective-cap-cream',
    name: 'COLLECTIVE CAP',
    slug: 'collective-cap-cream',
    price: 35,
    category: 'Accessories',
    description: 'Cream colorway with tonal embroidery. Part of our seasonal capsule collection.',
    materials: '100% cotton twill. Tonal embroidered logo. Adjustable metal strap closure.',
    sizeGuide: 'One size fits most. Adjustable from 21" to 24" circumference.',
    images: ['/assets/featured-playlist.png', '/assets/editorial-designer.png'],
    sizes: ['One Size'],
    inStock: true,
    stockLevel: 'low-stock',
    tags: ['Limited Edition'],
    relatedProducts: ['diaspora-cap-black', 'sound-tote-natural']
  },
  {
    id: 'studio-crewneck-black',
    name: 'STUDIO CREWNECK',
    slug: 'studio-crewneck-black',
    price: 75,
    category: 'Hoodies',
    description: 'Classic crewneck sweatshirt with embroidered chest logo. Perfect layering piece for any season.',
    materials: '80% cotton, 20% polyester fleece. 280gsm. Embroidered logo.',
    sizeGuide: 'S (Chest: 38-40"), M (Chest: 40-42"), L (Chest: 44-46"), XL (Chest: 48-50"), XXL (Chest: 52-54")',
    images: ['/assets/editorial-street-art.png', '/assets/editorial-diaspora.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockLevel: 'in-stock',
    tags: ['Core'],
    relatedProducts: ['culture-hoodie-black', 'mutuals-tee-black']
  }
];

export const categories = [
  'All',
  'T-Shirts',
  'Hoodies',
  'Accessories'
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getRelatedProducts(productIds: string[]): Product[] {
  return products.filter(p => productIds.includes(p.id));
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
}
