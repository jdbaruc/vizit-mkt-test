// =========================================================================
// Tag Manager — seed data
// =========================================================================
// ~20 user tags across 4 groups + ~8 system tags in 2 system groups, mix of
// usage counts incl. some 0-use tags to demo cleanup, plus a couple archived.

const TAG_SWATCHES = [
  { name: 'lime',    value: '#84cc16' },
  { name: 'indigo',  value: '#4f46e5' },
  { name: 'pink',    value: '#ec4899' },
  { name: 'amber',   value: '#f59e0b' },
  { name: 'teal',    value: '#14b8a6' },
  { name: 'red',     value: '#dc2626' },
  { name: 'violet',  value: '#8b5cf6' },
  { name: 'sky',     value: '#0ea5e9' },
  { name: 'stone',   value: '#78716c' },
  { name: 'ink',     value: '#0c0a09' },
];

const TAG_GROUPS = [
  { id: 'campaign', name: 'Campaign', color: '#4f46e5', system: false },
  { id: 'season',   name: 'Season',   color: '#f59e0b', system: false },
  { id: 'audience', name: 'Audience', color: '#ec4899', system: false },
  { id: 'status',   name: 'Status',   color: '#14b8a6', system: false },
  { id: 'sys-scoring', name: 'Scoring signals', color: '#4f46e5', system: true, parent: 'system' },
  { id: 'sys-quality', name: 'Quality',         color: '#78716c', system: true, parent: 'system' },
];

const TAGS = [
  // Campaign
  { id: 't01', name: 'holiday-2025',        group: 'campaign', color: '#4f46e5', description: 'Holiday 2025 push — Oct–Dec', usage: 142, updated: '2d',  created: '42d', source: 'user' },
  { id: 't02', name: 'summer-drop',         group: 'campaign', color: '#f59e0b', description: 'Summer 2025 product drop',   usage: 89,  updated: '5d',  created: '30d', source: 'user' },
  { id: 't03', name: 'valentines-edit',     group: 'campaign', color: '#ec4899', description: '',                            usage: 34,  updated: '11d', created: '60d', source: 'user' },
  { id: 't04', name: 'black-friday-2024',   group: 'campaign', color: '#0c0a09', description: 'BF 2024 archive',             usage: 0,   updated: '6mo', created: '8mo', source: 'user', archived: true },
  { id: 't05', name: 'back-to-school',      group: 'campaign', color: '#84cc16', description: '',                            usage: 12,  updated: '21d', created: '90d', source: 'user' },

  // Season
  { id: 't06', name: 'spring',              group: 'season',   color: '#84cc16', description: '',                            usage: 67,  updated: '3d',  created: '120d', source: 'user' },
  { id: 't07', name: 'summer',              group: 'season',   color: '#f59e0b', description: '',                            usage: 112, updated: '3d',  created: '120d', source: 'user' },
  { id: 't08', name: 'fall',                group: 'season',   color: '#dc2626', description: '',                            usage: 54,  updated: '9d',  created: '120d', source: 'user' },
  { id: 't09', name: 'winter',              group: 'season',   color: '#0ea5e9', description: '',                            usage: 88,  updated: '4d',  created: '120d', source: 'user' },
  { id: 't10', name: 'evergreen',           group: 'season',   color: '#78716c', description: 'Not tied to a season',        usage: 301, updated: '1d',  created: '200d', source: 'user' },

  // Audience
  { id: 't11', name: 'gen-z',               group: 'audience', color: '#ec4899', description: '',                            usage: 41,  updated: '7d',  created: '80d', source: 'user' },
  { id: 't12', name: 'millennials',         group: 'audience', color: '#8b5cf6', description: '',                            usage: 37,  updated: '7d',  created: '80d', source: 'user' },
  { id: 't13', name: 'parents',             group: 'audience', color: '#14b8a6', description: '',                            usage: 22,  updated: '14d', created: '80d', source: 'user' },
  { id: 't14', name: 'diy',                 group: 'audience', color: '#f59e0b', description: '',                            usage: 0,   updated: '55d', created: '55d', source: 'user' },

  // Status
  { id: 't15', name: 'approved',            group: 'status',   color: '#84cc16', description: 'Cleared by brand review',     usage: 1208, updated: '1h',  created: '300d', source: 'user' },
  { id: 't16', name: 'needs-reshoot',       group: 'status',   color: '#dc2626', description: 'Flagged by scoring',          usage: 47,  updated: '2d',  created: '180d', source: 'user' },
  { id: 't17', name: 'pending-legal',       group: 'status',   color: '#f59e0b', description: '',                            usage: 18,  updated: '6d',  created: '180d', source: 'user' },
  { id: 't18', name: 'mobile-hero',         group: 'status',   color: '#4f46e5', description: 'Hero candidates for mobile',  usage: 73,  updated: '2d',  created: '120d', source: 'user' },
  { id: 't19', name: 'do-not-use',          group: 'status',   color: '#0c0a09', description: '',                            usage: 9,   updated: '30d', created: '250d', source: 'user', archived: true },

  // System — Scoring signals
  { id: 's01', name: 'above-category-median', group: 'sys-scoring', color: '#84cc16', description: 'Scores in the top half of category', usage: 842, updated: '4h', created: '365d', source: 'system', hidden: false },
  { id: 's02', name: 'low-mobile-readiness',  group: 'sys-scoring', color: '#dc2626', description: 'Low score on mobile crop benchmarks', usage: 214, updated: '4h', created: '365d', source: 'system', hidden: false },
  { id: 's03', name: 'brand-weak',             group: 'sys-scoring', color: '#f59e0b', description: 'Brand recognition signal is low',     usage: 98,  updated: '4h', created: '365d', source: 'system', hidden: false },
  { id: 's04', name: 'above-benchmark',        group: 'sys-scoring', color: '#14b8a6', description: '',                                    usage: 512, updated: '4h', created: '365d', source: 'system', hidden: false },

  // System — Quality
  { id: 's05', name: 'needs-regeneration',     group: 'sys-quality', color: '#dc2626', description: 'Image suggests reshoot/regeneration', usage: 67,  updated: '4h', created: '365d', source: 'system', hidden: false },
  { id: 's06', name: 'duplicate-suspected',    group: 'sys-quality', color: '#78716c', description: '',                                    usage: 23,  updated: '4h', created: '365d', source: 'system', hidden: false },
  { id: 's07', name: 'low-resolution',         group: 'sys-quality', color: '#f59e0b', description: 'Below 1200px on longest edge',        usage: 12,  updated: '4h', created: '365d', source: 'system', hidden: true },
  { id: 's08', name: 'color-cast',             group: 'sys-quality', color: '#0ea5e9', description: '',                                    usage: 4,   updated: '4h', created: '365d', source: 'system', hidden: false },
];

Object.assign(window, { TAGS, TAG_GROUPS, TAG_SWATCHES });
