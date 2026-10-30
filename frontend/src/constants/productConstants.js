// productConstants.js
// Reusable constants for products, frame colors, finishes, sizes, and categories

export const FRAME_COLORS = [
  { id: 'black', name: 'Classic Black', hex: '#1E1E1E', border: 'border-transparent' },
  { id: 'white', name: 'Matte White', hex: '#F5F5F7', border: 'border-warmDark-300' },
  { id: 'walnut', name: 'Dark Walnut', hex: '#4A2E1C', border: 'border-transparent' },
  { id: 'oak', name: 'Natural Wood', hex: '#C8A06A', border: 'border-transparent' },
  { id: 'gold', name: 'Elegant Gold', hex: '#D4AF37', border: 'border-transparent' },
];

export const FINISHES = FRAME_COLORS;

export const SIZES = [
  { label: '6 x 4 inch', delta: -100 },
  { label: '8 x 6 inch', delta: 0 },
  { label: '10 x 8 inch', delta: 200 },
  { label: '12 x 10 inch', delta: 450 },
  { label: '16 x 12 inch', delta: 750 },
  { label: '20 x 16 inch', delta: 1100 },
];

export const resolveFrameColor = (colorOrFinish) => {
  if (!colorOrFinish) return FRAME_COLORS[0];
  const name = typeof colorOrFinish === 'string' ? colorOrFinish : (colorOrFinish.name || '');
  const lower = name.toLowerCase();

  if (colorOrFinish.hex && colorOrFinish.hex !== '#ccc' && colorOrFinish.hex !== '#ffffff00') {
    return {
      name: name || 'Custom',
      hex: colorOrFinish.hex,
      border: lower.includes('white') ? 'border-warmDark-300' : 'border-transparent'
    };
  }

  if (lower.includes('black')) return FRAME_COLORS[0];
  if (lower.includes('white')) return FRAME_COLORS[1];
  if (lower.includes('walnut') || lower.includes('brown') || lower.includes('rustic')) return FRAME_COLORS[2];
  if (lower.includes('wood') || lower.includes('oak') || lower.includes('natural')) return FRAME_COLORS[3];
  if (lower.includes('gold')) return FRAME_COLORS[4];
  if (lower.includes('matte')) return { name: name || 'Matte Black', hex: '#2B2B2B', border: 'border-transparent' };
  if (lower.includes('glossy')) return { name: name || 'Glossy Black', hex: '#191512', border: 'border-transparent' };
  if (lower.includes('canvas')) return { name: name || 'Natural Canvas', hex: '#C8A06A', border: 'border-transparent' };

  return FRAME_COLORS[0];
};

export const HIGHLIGHTS = [
  { icon: 'wood', title: 'Solid Wood Moulding', desc: 'Sustainably sourced premium timber' },
  { icon: 'print', title: 'Museum-Grade HD Print', desc: 'Fade-proof archival inks (100+ yrs)' },
  { icon: 'glass', title: 'Ultra-Clear UV Glass', desc: 'Glare-resistant protective glazing' },
  { icon: 'clean', title: 'Easy Wall & Desk Setup', desc: 'Pre-installed hooks & 2-way easel stand' },
];

export const CATEGORY_TILES = [
  { id: '1', label: 'Photo Frames', desc: 'Classic wooden & gallery frames', icon: 'image', path: '/products?category=1' },
  { id: '2', label: 'Collage Frames', desc: 'Storytelling multi-opening frames', icon: 'grid', path: '/products?category=2' },
  { id: '3', label: 'Personalized Frames', desc: 'Custom text & name engraving', icon: 'sliders', path: '/products?category=3' },
  { id: '4', label: 'Couple & Wedding', desc: 'Romantic anniversary shadow boxes', icon: 'heart', path: '/products?category=4' },
  { id: '5', label: 'Family Heritage', desc: 'Celebrate generations of memories', icon: 'users', path: '/products?category=5' },
];

export const FILTER_CATEGORIES = [
  { id: '1', label: 'Photo Frames' },
  { id: '2', label: 'Collage Frames' },
  { id: '3', label: 'Personalized Frames' },
  { id: '4', label: 'Couple & Wedding' },
  { id: '5', label: 'Family Frames' },
];
