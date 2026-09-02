// mockData.js
// Single source of mock catalog data for the FrameWala frontend (no backend).

export const FINISHES = [
  { name: 'Dark Walnut', hex: '#4A2E1C' },
  { name: 'Natural Oak', hex: '#C8A06A' },
  { name: 'Matte White', hex: '#F3F0E9' },
  { name: 'Classic Black', hex: '#191512' },
  { name: 'Rustic Brown', hex: '#7A4A2B' },
];

export const SIZES = [
  { label: '6 x 4 inch', delta: -100 },
  { label: '8 x 6 inch', delta: 0 },
  { label: '10 x 8 inch', delta: 200 },
  { label: '12 x 10 inch', delta: 450 },
];

export const HIGHLIGHTS = [
  { icon: 'wood', title: 'Premium Wooden', desc: 'High quality wood' },
  { icon: 'print', title: 'High Definition Print', desc: 'Vibrant & long lasting' },
  { icon: 'glass', title: 'Glass Protection', desc: 'Scratch resistant' },
  { icon: 'clean', title: 'Easy to Clean', desc: 'Wipe with dry cloth' },
];

const gallery = (n) => {
  const next = (n % 10) + 1;
  return [
    `/images/products/product_${String(n).padStart(2, '0')}.jpg`,
    `/images/products/frame_${String(n).padStart(2, '0')}.jpg`,
    `/images/products/product_${String(next).padStart(2, '0')}.jpg`,
    `/images/products/frame_${String(next).padStart(2, '0')}.jpg`,
  ];
};

export const PRODUCTS = [
  {
    id: 1, slug: 'classic-wooden-photo-frame',
    name: 'Classic Wooden Photo Frame', category: 'personalized', category_name: 'Wooden Frames',
    price: 699, mrp: 899, rating: 4.8, review_count: 128, badge: 'Best Seller', stock: 15,
    subtitle: 'Timeless elegance for your precious memories.',
    description: 'Elegant & timeless wooden frame to showcase your precious memories. Handcrafted with premium teak-finish wood and crystal-clear UV protective glass.',
    is_customizable: true,
  },
  {
    id: 2, slug: 'multi-photo-collage-frame',
    name: 'Multi Photo Collage Frame', category: 'collage', category_name: 'Collage Frames',
    price: 1099, mrp: 1399, rating: 4.7, review_count: 96, badge: 'Trending', stock: 22,
    subtitle: 'Showcase multiple moments in one beautiful frame.',
    description: 'Display all your favourite moments together in one stunning multi-window collage frame with a personalised "Family" cutout centrepiece.',
    is_customizable: true,
  },
  {
    id: 3, slug: 'natural-wood-grain-frame',
    name: 'Natural Wood Grain Frame', category: 'family', category_name: 'Family Frames',
    price: 699, mrp: 849, rating: 4.9, review_count: 74, badge: 'Popular', stock: 30,
    subtitle: 'Simple, natural finish perfect for every home.',
    description: 'A minimal natural oak grain frame that fits effortlessly into any home decor while keeping the focus on your memories.',
    is_customizable: false,
  },
  {
    id: 4, slug: 'heart-shape-couple-frame',
    name: 'Heart Shape Couple Frame', category: 'couple', category_name: 'Couple Frames',
    price: 859, mrp: 1099, rating: 4.9, review_count: 210, badge: 'Gift Choice', stock: 12,
    subtitle: 'Perfect romantic gift for special moments.',
    description: 'A romantic heart-shaped frame on a solid base, perfect for anniversaries, Valentine\'s day and celebrating your loved ones.',
    is_customizable: true,
  },
  {
    id: 5, slug: 'modern-white-baby-frame',
    name: 'Modern White Baby Frame', category: 'baby', category_name: 'Baby Frames',
    price: 899, mrp: 1149, rating: 4.9, review_count: 82, badge: 'New', stock: 18,
    subtitle: 'Sleek minimal white frame for baby milestones.',
    description: 'A modern, minimal white frame designed to cherish your baby\'s cutest milestones and everyday little moments.',
    is_customizable: true,
  },
  {
    id: 6, slug: 'warm-glow-led-light-frame',
    name: 'Warm Glow LED Light Frame', category: 'led', category_name: 'LED Light Frames',
    price: 1299, mrp: 1799, rating: 4.7, review_count: 291, badge: '20% OFF', stock: 9,
    subtitle: 'Light up your memories with a warm glow.',
    description: 'Bring your photos to life with a soft ambient backlight. USB powered warm-white LED frame that sets a cosy mood in any room.',
    is_customizable: true,
  },
  {
    id: 7, slug: 'rustic-vintage-wooden-frame',
    name: 'Rustic Vintage Wooden Frame', category: 'personalized', category_name: 'Wooden Frames',
    price: 749, mrp: 999, rating: 4.8, review_count: 67, badge: null, stock: 25,
    subtitle: 'Vintage distressed look for classic charm.',
    description: 'A distressed vintage wooden frame that adds warm rustic character to landscapes, travel and heritage photographs.',
    is_customizable: false,
  },
  {
    id: 8, slug: 'acrylic-table-floating-frame',
    name: 'Acrylic Table Floating Frame', category: 'couple', category_name: 'Couple Frames',
    price: 699, mrp: 899, rating: 4.9, review_count: 114, badge: 'Sleek', stock: 20,
    subtitle: 'Sleek floating frame with premium acrylic.',
    description: 'A sleek, modern floating acrylic frame that makes your photo appear suspended in crystal-clear glass. Perfect for desks and shelves.',
    is_customizable: true,
  },
  {
    id: 9, slug: 'wedding-shadow-box-frame',
    name: 'Wedding Shadow Box Frame', category: 'wedding', category_name: 'Wedding Frames',
    price: 1199, mrp: 1599, rating: 4.9, review_count: 153, badge: 'Premium', stock: 7,
    subtitle: 'Preserve keepsakes & photo memories.',
    description: 'A deep shadow box frame to preserve wedding keepsakes, dried flowers and your most treasured photographs together.',
    is_customizable: true,
  },
  {
    id: 10, slug: 'hanging-rope-wooden-frame',
    name: 'Hanging Rope Wooden Frame', category: 'family', category_name: 'Family Frames',
    price: 799, mrp: 999, rating: 4.9, review_count: 188, badge: null, stock: 16,
    subtitle: 'Rope hanging accent for feature walls.',
    description: 'A charming rope-hung wooden frame that adds a natural, decorative accent to gallery and feature walls.',
    is_customizable: false,
  },
].map((p) => ({
  ...p,
  primary_image: `/images/products/product_${String(p.id).padStart(2, '0')}.jpg`,
  images: gallery(p.id),
  sizes: SIZES,
  finishes: FINISHES,
  highlights: HIGHLIGHTS,
}));

export const CATEGORY_TILES = [
  { id: 'personalized', label: 'Photo Frames', icon: 'image' },
  { id: 'led', label: 'LED Frames', icon: 'zap' },
  { id: 'mugs', label: 'Mugs', icon: 'coffee' },
  { id: 'tshirts', label: 'T-Shirts', icon: 'tag' },
  { id: 'pillows', label: 'Pillows', icon: 'square' },
  { id: 'keychains', label: 'Keychains', icon: 'key' },
  { id: 'covers', label: 'Mobile Covers', icon: 'phone' },
  { id: 'gifts', label: 'Gift Boxes', icon: 'gift' },
];

export const FILTER_CATEGORIES = [
  { id: 'family', label: 'Family Frames' },
  { id: 'couple', label: 'Couple Frames' },
  { id: 'baby', label: 'Baby Frames' },
  { id: 'wedding', label: 'Wedding Frames' },
  { id: 'collage', label: 'Collage Frames' },
  { id: 'personalized', label: 'Wooden / Personalized' },
  { id: 'led', label: 'LED Light Frames' },
];

const REVIEW_POOL = [
  { name: 'Rahul Sharma', city: 'Mumbai', rating: 5, text: 'The wooden frame quality exceeded my expectations! Print was vibrant and packaging was superb.' },
  { name: 'Pooja Deshmukh', city: 'Pune', rating: 5, text: 'Delivered within 3 days, perfectly wrapped without a single scratch. Loved it!' },
  { name: 'Amit Kapoor', city: 'Delhi', rating: 4, text: 'Beautiful finish and looks premium on my wall. Would happily order again.' },
  { name: 'Sneha Iyer', city: 'Bengaluru', rating: 5, text: 'Made a lovely anniversary gift. The customization preview matched the final product exactly.' },
];

export const getProductById = (id) => PRODUCTS.find((p) => String(p.id) === String(id));

export const getReviews = (id) =>
  REVIEW_POOL.map((r, i) => ({
    id: `${id}-${i}`,
    ...r,
    date: new Date(Date.now() - i * 86400000 * 6).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
  }));

export const getRelated = (product, count = 4) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);

export const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
