/* ============================================================
   DATA LAYER — BongoWear
   Structured placeholder data for dynamic rendering.
   These will later map to Laravel models / API responses.
   ============================================================ */

const SITE = {
  brandName: 'BongoWear',
  tagline: 'Bangladesh-Made Fashion for Australia',
  announcementMessage: 'Free Australia-wide delivery on orders over A$99',
  announcementLink: '#',
  currency: 'A$',
  countryCode: 'AU',
};

const NAV_CATEGORIES = [
  {
    name: 'New Drops',
    slug: 'new-drops',
    megaMenu: null,
  },
  {
    name: 'Men',
    slug: 'men',
    megaMenu: [
      {
        heading: 'Tops',
        links: [
          { label: 'T-Shirts', slug: 'men-tshirts' },
          { label: 'Polos', slug: 'men-polos' },
          { label: 'Shirts', slug: 'men-shirts' },
          { label: 'Hoodies', slug: 'men-hoodies' },
          { label: 'New Arrivals', slug: 'men-new' },
        ],
      },
      {
        heading: 'Bottoms',
        links: [
          { label: 'Trousers', slug: 'men-trousers' },
          { label: 'Chinos', slug: 'men-chinos' },
          { label: 'Joggers', slug: 'men-joggers' },
        ],
      },
      {
        heading: 'Collections',
        links: [
          { label: 'Essentials', slug: 'men-essentials' },
          { label: 'Premium', slug: 'men-premium' },
          { label: 'Sale', slug: 'men-sale' },
        ],
      },
    ],
  },
  {
    name: 'Women',
    slug: 'women',
    megaMenu: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Tops', slug: 'women-tops' },
          { label: 'Dresses', slug: 'women-dresses' },
          { label: 'Tunics', slug: 'women-tunics' },
          { label: 'Trousers', slug: 'women-trousers' },
          { label: 'New Arrivals', slug: 'women-new' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { label: 'Scarves', slug: 'women-scarves' },
          { label: 'Bags', slug: 'women-bags' },
          { label: 'Jewellery', slug: 'women-jewellery' },
        ],
      },
      {
        heading: 'Collections',
        links: [
          { label: 'Essentials', slug: 'women-essentials' },
          { label: 'Premium', slug: 'women-premium' },
          { label: 'Sale', slug: 'women-sale' },
        ],
      },
    ],
  },
  {
    name: 'Collections',
    slug: 'collections',
    megaMenu: null,
  },
  {
    name: 'Sale',
    slug: 'sale',
    megaMenu: null,
  },
];

const HERO_SLIDES = [
  {
    id: 1,
    label: 'New Collection',
    headline: 'Made for You. Priced for Australia.',
    subtext: 'Bangladesh-made fashion, thoughtfully selected for the Bangladeshi community in Australia.',
    cta: 'Shop New Drop',
    ctaLink: '#new-drop',
    image: 'assets/images/hero/hero-1.png',
  },
  {
    id: 2,
    label: 'Size Inclusive',
    headline: 'Your Size Shouldn\'t Be Hard to Find.',
    subtext: 'Extended sizes and familiar fits, now delivered across Australia.',
    cta: 'Explore Sizes',
    ctaLink: '#sizes',
    image: 'assets/images/hero/hero-2.png',
  },
  {
    id: 3,
    label: 'Limited Drop',
    headline: 'Limited Drop. Better Price.',
    subtext: 'Pre-order during the drop and get exclusive launch pricing.',
    cta: 'Shop This Drop',
    ctaLink: '#drop',
    image: 'assets/images/hero/hero-3.png',
  },
];

const TRUST_ITEMS = [
  {
    icon: 'flag',
    title: 'Bangladesh Quality',
    desc: 'Authentically sourced',
  },
  {
    icon: 'truck',
    title: 'Australia Delivery',
    desc: 'Delivered across Australia',
  },
  {
    icon: 'ruler',
    title: 'Better Sizes',
    desc: 'Made with South Asian fits in mind',
  },
  {
    icon: 'shield',
    title: 'Secure Checkout',
    desc: 'Safe & trusted payments',
  },
];

// Pre-order countdown target — 4 days from page load for demo
const DROP_END_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  d.setHours(d.getHours() + 12);
  d.setMinutes(d.getMinutes() + 32);
  return d;
})();

const PRODUCTS = [
  {
    id: 1,
    name: 'Essential Heavyweight Tee',
    desc: 'Premium Cotton · Relaxed Fit',
    price: 24.90,
    originalPrice: 34.90,
    image: 'assets/images/products/tshirt-olive.png',
    badge: 'new',
    colors: ['#5C6B4F', '#1A1A1A', '#F5F0E8'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    outOfStockSizes: [],
    category: 'men',
    slug: 'essential-heavyweight-tee',
  },
  {
    id: 2,
    name: 'Classic Black Tee',
    desc: 'Premium Cotton · Regular Fit',
    price: 22.90,
    originalPrice: null,
    image: 'assets/images/products/tshirt-black.png',
    badge: 'preorder',
    colors: ['#1A1A1A', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: [],
    category: 'men',
    slug: 'classic-black-tee',
  },
  {
    id: 3,
    name: 'Premium Polo',
    desc: 'Piqué Cotton · Slim Fit',
    price: 29.90,
    originalPrice: 39.90,
    image: 'assets/images/products/polo-navy.png',
    badge: 'limited',
    colors: ['#1B2A4A', '#1A1A1A', '#5C6B4F'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    outOfStockSizes: ['3XL'],
    category: 'men',
    slug: 'premium-polo',
  },
  {
    id: 4,
    name: 'Linen Casual Shirt',
    desc: 'Pure Linen · Regular Fit',
    price: 34.90,
    originalPrice: null,
    image: 'assets/images/products/shirt-white.png',
    badge: 'new',
    colors: ['#FFFFFF', '#E8DDD0', '#8BA5B5'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: ['S'],
    category: 'men',
    slug: 'linen-casual-shirt',
  },
  {
    id: 5,
    name: 'Everyday Chinos',
    desc: 'Stretch Cotton · Tapered',
    price: 32.90,
    originalPrice: 44.90,
    image: 'assets/images/products/trousers-khaki.png',
    badge: 'sale',
    colors: ['#C4A882', '#1A1A1A', '#3A3A3A'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    outOfStockSizes: [],
    category: 'men',
    slug: 'everyday-chinos',
  },
  {
    id: 6,
    name: 'Essential Hoodie',
    desc: 'Heavyweight French Terry',
    price: 39.90,
    originalPrice: null,
    image: 'assets/images/products/hoodie-grey.png',
    badge: 'preorder',
    colors: ['#9E9E9E', '#1A1A1A', '#5C6B4F'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    outOfStockSizes: [],
    category: 'men',
    slug: 'essential-hoodie',
  },
  {
    id: 7,
    name: 'Modern Tunic Top',
    desc: 'Cotton Blend · Contemporary Cut',
    price: 27.90,
    originalPrice: 36.90,
    image: 'assets/images/products/tunic-burgundy.png',
    badge: 'new',
    colors: ['#722F37', '#1A1A1A', '#4A6741'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStockSizes: [],
    category: 'women',
    slug: 'modern-tunic-top',
  },
  {
    id: 8,
    name: 'Midi Dress',
    desc: 'Flowing Fabric · Elegant Fit',
    price: 36.90,
    originalPrice: null,
    image: 'assets/images/products/dress-teal.png',
    badge: 'limited',
    colors: ['#3D7A8A', '#1A1A1A', '#722F37'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStockSizes: ['XS'],
    category: 'women',
    slug: 'midi-dress',
  },
];

const CATEGORIES = [
  { name: 'T-Shirts', slug: 'tshirts', image: 'assets/images/products/tshirt-olive.png', gradient: 'linear-gradient(135deg, #5C6B4F, #3A4A30)' },
  { name: 'Trousers', slug: 'trousers', image: 'assets/images/products/trousers-khaki.png', gradient: 'linear-gradient(135deg, #C4A882, #8B7355)' },
  { name: 'Shirts', slug: 'shirts', image: 'assets/images/products/shirt-white.png', gradient: 'linear-gradient(135deg, #8BA5B5, #5A7A8A)' },
  { name: 'Polos', slug: 'polos', image: 'assets/images/products/polo-navy.png', gradient: 'linear-gradient(135deg, #1B2A4A, #0F1A2F)' },
  { name: "Women's", slug: 'womens', image: 'assets/images/products/tunic-burgundy.png', gradient: 'linear-gradient(135deg, #722F37, #4A1F24)' },
  { name: 'Hoodies', slug: 'hoodies', image: 'assets/images/products/hoodie-grey.png', gradient: 'linear-gradient(135deg, #6B6B6B, #3A3A3A)' },
];

const REVIEWS = [
  {
    id: 1,
    stars: 5,
    text: "Finally found sizes that actually fit me without paying crazy prices. The quality is genuinely impressive for the price point.",
    name: 'Rahim',
    location: 'Melbourne',
    initial: 'R',
  },
  {
    id: 2,
    stars: 5,
    text: "Love the pre-order model. I get better prices and they only produce what people actually want. Shipping was faster than expected too.",
    name: 'Fatima',
    location: 'Sydney',
    initial: 'F',
  },
  {
    id: 3,
    stars: 5,
    text: "My husband is so hard to shop for because nothing fits right. These guys actually understand South Asian body types. Game changer.",
    name: 'Nusrat',
    location: 'Brisbane',
    initial: 'N',
  },
  {
    id: 4,
    stars: 4,
    text: "Great quality basics at fair prices. The heavyweight tee is seriously good — feels premium without the premium price tag.",
    name: 'Tanvir',
    location: 'Perth',
    initial: 'T',
  },
];

const FOOTER_LINKS = {
  shop: [
    { label: 'New Drops', href: '#' },
    { label: 'Men', href: '#' },
    { label: 'Women', href: '#' },
    { label: 'Collections', href: '#' },
    { label: 'Sale', href: '#' },
  ],
  help: [
    { label: 'Contact Us', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns & Exchanges', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'Pre-order Information', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Our Story', href: '#' },
    { label: 'Why Bangladesh', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
  ],
};
