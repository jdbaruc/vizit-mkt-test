// =========================================================================
// Collections — seed data (Hanni Shave Pillow, from the screenshot)
// =========================================================================
// 11 assets, each with score, date added, generated/uploaded origin, uploader
// metadata, tags, and a CSS-painted thumbnail that stands in for the real
// product shot.

// =========================================================================
// Centralized brand list — used by every Brand dropdown across the platform
// (Library product-pages filter, Reporting filters, Impact row brands, etc).
// Add or rename here, and all surfaces stay in sync.
// =========================================================================
const BRANDS = [
  'Pale Blue',
  'Operator',
  'V23',
  'Vessel',
  'No Align',
  'Secondhand',
  'Quiet Room',
  'Examine Archive',
  'Whorl',
  'Paper Weight',
  'Thresh',
  'Negative Space',
  'Def Qlub',
  'Teenage Engineering',
];

// =========================================================================
// Centralized category list — used by every Category dropdown and field
// across the platform (Library collection meta, Reporting filters, Product
// page metadata, etc). Add or rename here, and all surfaces stay in sync.
// =========================================================================
const CATEGORIES = [
  'Cell Phones & Accessories',
  'MP3 & MP4 Players',
  'Digital Voice Recorders',
  'Tabletop Synthesizers',
  'Portable Bluetooth Speakers',
];

// Deterministic per-category color so the colored "category pill" always
// renders the same hue for the same category across the app.
const CATEGORY_COLORS = {
  'Cell Phones & Accessories':   '#3538CD', // indigo
  'MP3 & MP4 Players':           '#6941C6', // purple
  'Digital Voice Recorders':     '#B93815', // orange
  'Tabletop Synthesizers':       '#067647', // green
  'Portable Bluetooth Speakers': '#0E7490', // teal
};
const categoryColor = (name) => CATEGORY_COLORS[name] || '#4B5565';

const USERS = {
  jb:  { initials: 'JB', name: 'Jordan Baruc',    color: '#202939' },
  ma:  { initials: 'MA', name: 'Mira Alonso',     color: '#6B3A9A' },
  ks:  { initials: 'KS', name: 'Kai Sato',        color: '#0E7490' },
  rl:  { initials: 'RL', name: 'Remi Lee',        color: '#A15C07' },
  ai:  { initials: 'AI', name: 'Vizit AI',        color: '#6941C6', isBot: true },
};

const ASSETS = [
  // row 1
  { id: 'a01', score: 26, added: '2026-04-22T10:14:00', origin: 'uploaded',  uploader: 'jb', label: 'Hanni · plant shelf',      thumb: 'plant',        tags: ['lifestyle', 'hero', 'summer', 'plants', 'v2'] },
  { id: 'a02', score: 86, added: '2026-04-22T09:58:00', origin: 'uploaded',  uploader: 'ma', label: 'Hanni · bath tile',        thumb: 'tile',         tags: ['studio', 'packshot'] },
  { id: 'a03', score: 65, added: '2026-04-22T09:58:00', origin: 'uploaded',  uploader: 'ma', label: 'Hanni · stone trio',       thumb: 'stone',        tags: ['range', 'studio', 'bathroom', 'editorial'] },
  { id: 'a04', score: 45, added: '2026-04-21T16:42:00', origin: 'generated', uploader: 'ai', label: 'Hanni · sage carousel',    thumb: 'sage',         tags: ['carousel', 'copy', 'pdp', 'green', 'v3', 'approved'] },
  { id: 'a05', score: 79, added: '2026-04-21T16:41:00', origin: 'uploaded',  uploader: 'ks', label: 'Hanni · held in hand',     thumb: 'hand',         tags: ['lifestyle', 'hand-held', 'ugc'] },
  { id: 'a06', score: 43, added: '2026-04-21T12:08:00', origin: 'generated', uploader: 'ai', label: 'Hanni · floral pink',      thumb: 'floral',       tags: ['carousel'] },
  // row 2
  { id: 'a07', score: 71, added: '2026-04-18T09:30:00', origin: 'generated', uploader: 'ai', label: 'Hanni · existing creative', thumb: 'existing',    tags: ['evergreen', 'ad', 'pdp'] },
  { id: 'a08', score: 21, added: '2026-04-17T14:11:00', origin: 'generated', uploader: 'ai', label: 'Hanni · smooth shave copy', thumb: 'copy-pink',   tags: ['copy', 'promo', 'pink'] },
  { id: 'a09', score: 88, added: '2026-04-15T11:02:00', origin: 'generated', uploader: 'ai', label: 'Hanni · shave pillow hero', thumb: 'blue-sparkle',tags: ['hero', 'seasonal', 'holiday', 'approved', 'v2'] },
  { id: 'a10', score: 67, added: '2026-04-12T15:45:00', origin: 'generated', uploader: 'ai', label: 'Hanni · mint awaits',      thumb: 'mint',         tags: ['copy', 'seasonal'] },
  { id: 'a11', score: 21, added: '2026-04-05T08:20:00', origin: 'uploaded',  uploader: 'rl', label: 'Hanni · white studio',     thumb: 'studio',       tags: ['packshot'] },
];

// Global tag dictionary — drives the autocomplete for the "add tag" picker.
// Seeded from the assets above plus a few common ones the team already uses.
const TAG_DICTIONARY = [
  'lifestyle', 'hero', 'studio', 'packshot', 'range', 'carousel', 'copy',
  'evergreen', 'promo', 'seasonal', 'summer', 'winter', 'ugc', 'ad',
  'pdp', 'pack-front', 'pack-back', 'hand-held',
];

// Fake uploads-in-progress feed (the toast in the bottom-right).
const UPLOADS = [
  { name: 'image01.jpg', size: '200 KB', done: true },
  { name: 'image02.jpg', size: '200 KB', done: true },
  { name: 'image03.jpg', size: '200 KB', done: true },
  { name: 'image04.jpg', size: '200 KB', done: true },
];

// Tier helpers, consistent with the design system.
function scoreTier(s) {
  if (s == null) return 'na';
  if (s < 20) return 'vlow';
  if (s < 40) return 'low';
  if (s < 60) return 'mod';
  if (s < 80) return 'high';
  return 'vhigh';
}

// "2h ago" / "Yesterday" / "Apr 12"
function relativeDate(iso, now = new Date('2026-04-22T11:30:00')) {
  const d = new Date(iso);
  const diffMs = now - d;
  const mins = Math.round(diffMs / 60000);
  const hours = Math.round(diffMs / 3600000);
  const days  = Math.floor((now.setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0)) / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (days === 0) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Date-grouping bucket used by the Timeline variant.
function dateBucket(iso, now = new Date('2026-04-22T11:30:00')) {
  const d = new Date(iso);
  const days = Math.floor((new Date(now).setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0)) / 86400000);
  if (days <= 0) return { key: 'today',     label: 'Added today' };
  if (days === 1) return { key: 'yesterday', label: 'Yesterday' };
  if (days < 7)  return { key: 'week',      label: 'Earlier this week' };
  if (days < 14) return { key: 'lastweek',  label: 'Last week' };
  return { key: 'earlier', label: 'Earlier' };
}

// =========================================================================
// Tag Manager — seed data
// =========================================================================
const TAG_GROUPS = [
  { id: 'campaign', name: 'Campaigns', color: '#B93815' },
  { id: 'season',   name: 'Seasonality', color: '#067647' },
  { id: 'status',   name: 'Status', color: '#175CD3' },
  { id: 'format',   name: 'Format', color: '#6941C6' },
  { id: 'channel',  name: 'Channel', color: '#A15C07' },
  { id: 'sys-hero', name: 'System', color: '#4B5565', system: true, description: 'Auto-classified by Vizit when assets are ingested' },
];

const TAG_SWATCHES = [
  { name: 'slate',  value: '#4B5565' },
  { name: 'red',    value: '#D92D20' },
  { name: 'orange', value: '#DC6803' },
  { name: 'amber',  value: '#CA8504' },
  { name: 'green',  value: '#079455' },
  { name: 'teal',   value: '#0E9384' },
  { name: 'blue',   value: '#175CD3' },
  { name: 'indigo', value: '#3538CD' },
  { name: 'purple', value: '#6941C6' },
  { name: 'pink',   value: '#C11574' },
];

const TAGS = [
  { id: 't01', name: 'lifestyle',  color: '#6941C6', group: 'format',   source: 'user',   usage: 1284, updated: '2h',  description: 'Real-world environments; people + product' },
  { id: 't03', name: 'studio',     color: '#4B5565', group: 'format',   source: 'user',   usage: 2104, updated: '1d' },
  { id: 't04', name: 'packshot',   color: '#4B5565', group: 'format',   source: 'user',   usage: 1780, updated: '1d' },
  { id: 't06', name: 'copy',       color: '#CA8504', group: 'format',   source: 'user',   usage: 522,  updated: '5d' },
  { id: 't07', name: 'summer',     color: '#079455', group: 'season',   source: 'user',   usage: 201,  updated: '7d' },
  { id: 't08', name: 'winter',     color: '#175CD3', group: 'season',   source: 'user',   usage: 140,  updated: '7d' },
  { id: 't09', name: 'holiday-2025', color: '#C11574', group: 'campaign', source: 'user', usage: 64,   updated: '12d', description: 'Q4 launch · assets gated to Nov–Jan' },
  { id: 't10', name: 'bf-cm',      color: '#D92D20', group: 'campaign', source: 'user',   usage: 38,   updated: '12d' },
  { id: 't11', name: 'evergreen',  color: '#079455', group: 'campaign', source: 'user',   usage: 920,  updated: '1mo' },
  { id: 't12', name: 'approved',   color: '#079455', group: 'status',   source: 'user',   usage: 1820, updated: '2h' },
  { id: 't13', name: 'in-review',  color: '#CA8504', group: 'status',   source: 'user',   usage: 312,  updated: '2h' },
  { id: 't14', name: 'rejected',   color: '#D92D20', group: 'status',   source: 'user',   usage: 89,   updated: '1d' },
  { id: 't15', name: 'pdp',        color: '#3538CD', group: 'channel',  source: 'user',   usage: 2401, updated: '2h' },
  { id: 't16', name: 'ad',         color: '#3538CD', group: 'channel',  source: 'user',   usage: 1190, updated: '1d' },
  { id: 't17', name: 'ugc',        color: '#6941C6', group: 'channel',  source: 'user',   usage: 740,  updated: '3d' },
  { id: 't18', name: 'hand-held',  color: '#4B5565', group: 'format',   source: 'user',   usage: 56,   updated: '4d', archived: true },
  // System — auto-classified by Vizit
  { id: 's00a', name: 'hero',                    color: '#4B5565', group: 'sys-hero', source: 'system', usage: 1502, updated: 'live', description: 'Primary PDP hero shot' },
  { id: 's00b', name: 'carousel',                color: '#4B5565', group: 'sys-hero', source: 'system', usage: 688,  updated: 'live', description: 'Secondary PDP carousel imagery' },
  { id: 's01', name: 'in-use',                   color: '#4B5565', group: 'sys-hero', source: 'system', usage: 1284, updated: 'live', description: 'Product shown actively being used' },
  { id: 's02', name: 'lifestyle',                color: '#4B5565', group: 'sys-hero', source: 'system', usage: 2140, updated: 'live', description: 'Real-world environments and scenes' },
  { id: 's03', name: 'benefit-highlight',        color: '#4B5565', group: 'sys-hero', source: 'system', usage: 612,  updated: 'live', description: 'Call-outs for a specific product benefit' },
  { id: 's04', name: 'before-and-after',         color: '#4B5565', group: 'sys-hero', source: 'system', usage: 188,  updated: 'live', description: 'Split or sequential transformation imagery' },
  { id: 's05', name: 'product-swatch',           color: '#4B5565', group: 'sys-hero', source: 'system', usage: 244,  updated: 'live', description: 'Isolated texture, color or finish swatches' },
  { id: 's06', name: 'comparison',               color: '#4B5565', group: 'sys-hero', source: 'system', usage: 96,   updated: 'live', description: 'Side-by-side against competitors or variants' },
  { id: 's07', name: 'product-range',            color: '#4B5565', group: 'sys-hero', source: 'system', usage: 328,  updated: 'live', description: 'The full family of products together' },
  { id: 's09', name: 'multi-pack',               color: '#4B5565', group: 'sys-hero', source: 'system', usage: 142,  updated: 'live', description: 'Bundled or multi-unit packaging' },
  { id: 's10', name: 'included-items',           color: '#4B5565', group: 'sys-hero', source: 'system', usage: 78,   updated: 'live', description: 'What\'s in the box / kit contents' },
  { id: 's11', name: 'feature-callout',          color: '#4B5565', group: 'sys-hero', source: 'system', usage: 420,  updated: 'live', description: 'Annotated diagram of product features' },
  { id: 's12', name: 'alternate-product-views',  color: '#4B5565', group: 'sys-hero', source: 'system', usage: 512,  updated: 'live', description: 'Secondary angles and detail crops' },
  { id: 's13', name: 'endorsements',             color: '#4B5565', group: 'sys-hero', source: 'system', usage: 54,   updated: 'live', description: 'Reviews, ratings, press mentions' },
  { id: 's14', name: 'certification-mark',       color: '#4B5565', group: 'sys-hero', source: 'system', usage: 38,   updated: 'live', description: 'USDA Organic, Leaping Bunny, etc.' },
  { id: 's15', name: 'usage-instructions',       color: '#4B5565', group: 'sys-hero', source: 'system', usage: 162,  updated: 'live', description: 'How-to steps and directions' },
  { id: 's16', name: 'size-and-scale',           color: '#4B5565', group: 'sys-hero', source: 'system', usage: 88,   updated: 'live', description: 'Dimensions or in-hand scale reference' },
  { id: 's17', name: 'product-facts-panel',      color: '#4B5565', group: 'sys-hero', source: 'system', usage: 71,   updated: 'live', description: 'Ingredients, nutrition or regulatory panel' },
];

Object.assign(window, { ASSETS, BRANDS, CATEGORIES, CATEGORY_COLORS, categoryColor, UPLOADS, USERS, TAG_DICTIONARY, TAG_GROUPS, TAG_SWATCHES, TAGS, scoreTier, relativeDate, dateBucket });
