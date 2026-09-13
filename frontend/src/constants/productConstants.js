// productConstants.js
// Reusable constants for products and categories

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

export const CATEGORY_TILES = [
  { id: 'personalized', label: 'Photo Frames', icon: 'image' },
];

export const FILTER_CATEGORIES = [
  { id: 'family', label: 'Family Frames' },
  { id: 'couple', label: 'Couple Frames' },
  { id: 'baby', label: 'Baby Frames' },
  { id: 'wedding', label: 'Wedding Frames' },
  { id: 'collage', label: 'Collage Frames' },
  { id: 'personalized', label: 'Wooden / Personalized' },
];
