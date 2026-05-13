// =========================================================================
// Library — Product Pages / Collections / Assets tabs
// =========================================================================
// This is where the "Collections" breadcrumb lands when a user clicks it
// from inside a specific collection. It's a listing page with three tabs;
// Collections is the default. Each tab is mostly a placeholder apart from
// Collections, which renders a card grid of the 8 seeded collections.

const { useState: useStateLib, useMemo: useMemoLib } = React;

/* ---------- Seed collections --------------------------------------- */
// Inspired by the attached screenshot. Each card mixes a hero thumbnail
// (leveraging existing Thumb kinds when they fit), a title, a product-
// category pill (color-coded to match the tag taxonomy), and an asset
// count. The tile labeled "Test — shaving pillow shots" is the one whose
// detail page users came from — clicking it navigates back to /collections.

const COLLECTIONS = [
  { id: 'c01', title: 'Test — shaving pillow lifestyle ss', category: 'Shaving Gels',      cat_color: '#6941C6', thumb: 'lifestyle-woman', count: 24, isTest: true, route: '/collections' },
  { id: 'c02', title: 'Claim Explorations',                category: 'Shaving Gels',      cat_color: '#6941C6', thumb: 'bloom-cans',      count: 24 },
  { id: 'c03', title: 'Claim Flow Visuals',                category: 'Whitening Strips',  cat_color: '#B93815', thumb: 'claims-standards', count: 24 },
  { id: 'c04', title: 'Before/After Clean Feel',           category: 'Shaving Gels',      cat_color: '#6941C6', thumb: 'tube-purple',     count: 24 },
  { id: 'c05', title: 'Bristle Detail Callouts',           category: 'Toothbrushes',      cat_color: '#0B5CAD', thumb: 'tube-untinted',   count: 24 },
  { id: 'c06', title: 'Brush Head Variants',               category: 'Toothbrushes',      cat_color: '#0B5CAD', thumb: 'brush-kit',       count: 24 },
  { id: 'c07', title: 'Pack shot v2 – Minimal Aesthetic',  category: 'Pet supplies',      cat_color: '#C01048', thumb: 'milos-bag',       count: 24 },
  { id: 'c08', title: 'Test — shaving pillow shots',       category: 'Shaving Gels',      cat_color: '#6941C6', thumb: 'empty',           count: 0,  isTest: true, route: '/collections' },
];

/* ---------- Card thumbnails ---------------------------------------- */
// These are CSS-painted placeholders that echo the shapes / colors in the
// reference screenshot rather than shipping real imagery.
const LibThumbs = {
  'lifestyle-woman': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f5e0d6 0%, #d9a78c 55%, #8b4a5e 100%)' }}>
      <div style={{ position: 'absolute', left: '30%', right: '22%', top: '18%', bottom: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #f1bca6 0%, #b86f62 45%, #6d2c3c 85%)' }} />
      <div style={{ position: 'absolute', left: '38%', top: '44%', width: '18%', height: '10%',
        background: '#2a1515', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: '58%', top: '50%', width: '6%', height: '28%',
        background: '#c8bcef', borderRadius: 2 }} />
    </div>
  ),
  'bloom-cans': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #ffe8c7 0%, #f2c08b 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '8%', gap: '4%' }}>
      {['#f7cfd6', '#ec95b0', '#db738e', '#f7cfd6'].map((c, i) => (
        <div key={i} style={{ width: '14%', height: '72%', background: c, borderRadius: 2,
          boxShadow: 'inset -6px 0 0 rgba(0,0,0,.12)' }}>
          <div style={{ marginTop: '10%', marginLeft: '12%', fontFamily: 'Georgia, serif', fontSize: 8, color: '#6d2f44', fontWeight: 700 }}>bloom</div>
        </div>
      ))}
    </div>
  ),
  'claims-standards': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f1e4cf 0%, #d9c49a 100%)' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '20%', textAlign: 'center',
        fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#5a3a17', fontSize: 13 }}>Our Standards</div>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position: 'absolute', left: '28%', top: `${40 + i * 12}%`, width: '44%', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #8b5a2b' }} />
          <span style={{ flex: 1, height: 3, background: '#8b5a2b', opacity: 0.5 }} />
        </div>
      ))}
    </div>
  ),
  'tube-purple': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #c9bae6 0%, #9b86c6 100%)' }}>
      <div style={{ position: 'absolute', left: '40%', top: '22%', width: '22%', height: '64%',
        background: 'linear-gradient(180deg, #6d5aa0 0%, #4f3c86 100%)', borderRadius: '10px 10px 4px 4px' }} />
      <div style={{ position: 'absolute', left: '46%', top: '18%', width: '10%', height: '8%', background: '#d9d2ec' }} />
      <div style={{ position: 'absolute', left: '8%', top: '28%', color: '#fff', fontWeight: 700, fontSize: 9, lineHeight: 1.3 }}>
        A new way to<br/>brighten your smile
      </div>
    </div>
  ),
  'tube-untinted': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #7db3e0 0%, #285a8f 100%)' }}>
      <div style={{ position: 'absolute', left: '34%', top: '14%', width: '30%', height: '78%',
        background: 'linear-gradient(180deg, #ffffff 0%, #dfe7f0 100%)', borderRadius: '10px 10px 2px 2px' }}>
        <div style={{ marginTop: '30%', textAlign: 'center', fontWeight: 800, color: '#0f2a48', fontSize: 9 }}>UNTINTED</div>
      </div>
      {[[14, 22], [72, 34], [12, 64], [70, 70]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 10, height: 10,
          background: '#0f2a48', clipPath: 'polygon(50% 0,61% 35%,100% 50%,61% 65%,50% 100%,39% 65%,0 50%,39% 35%)' }} />
      ))}
    </div>
  ),
  'brush-kit': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #eaf2fb 0%, #c9d9ea 100%)' }}>
      {[20, 38, 54, 70].map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: '14%', width: '8%', height: '72%',
          background: i === 1 ? '#1a1a1a' : '#2d3b4a', borderRadius: '3px 3px 1px 1px' }}>
          <div style={{ marginTop: '6%', marginLeft: '20%', width: '60%', height: '10%', background: '#e8e4d8' }} />
        </div>
      ))}
      <div style={{ position: 'absolute', right: '4%', top: '32%', padding: '4px 6px',
        background: '#2a6dd8', color: '#fff', fontSize: 9, fontWeight: 800 }}>10x</div>
    </div>
  ),
  'milos-bag': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f4e4c3 0%, #d7ba7e 100%)' }}>
      <div style={{ position: 'absolute', left: '18%', right: '18%', top: '10%', bottom: '8%',
        background: 'linear-gradient(180deg, #d99a4f 0%, #a56229 100%)', borderRadius: '4px 4px 18px 18px' }}>
        <div style={{ marginTop: '14%', textAlign: 'center', color: '#ffffff',
          fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 14, letterSpacing: '.02em',
          textShadow: '0 1px 0 #6a3b14' }}>Milo's</div>
        <div style={{ textAlign: 'center', color: '#fff', fontSize: 8, letterSpacing: '.2em', marginTop: 2 }}>KITCHEN</div>
      </div>
    </div>
  ),
  'empty': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f8f6f3', display: 'grid', placeItems: 'center',
      color: '#b6afa4' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 16l5-5 3 3 4-4 6 6"/>
      </svg>
    </div>
  ),
};

const LibThumb = ({ kind }) => {
  const T = LibThumbs[kind] || LibThumbs.empty;
  return <T />;
};

/* ---------- Category pill ------------------------------------------ */
// Mirrors the tag chip in Tag Manager — subtle tinted background + colored
// dot derived from the category color.
const CategoryPill = ({ label, color }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 8px',
    background: `color-mix(in oklch, ${color} 12%, #fff)`,
    color,
    border: `1px solid color-mix(in oklch, ${color} 25%, #fff)`,
    fontSize: 11, fontWeight: 600,
  }}>
    {label}
  </span>
);

/* ---------- Collection card --------------------------------------- */
const CollectionCard = ({ c, onOpen }) => (
  <button
    onClick={() => onOpen(c)}
    style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: 0, background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit',
      textAlign: 'left',
    }}
  >
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '1 / 1',
      background: 'var(--bg-secondary)', border: '1px solid var(--border-tertiary)', overflow: 'hidden',
      transition: 'border-color .15s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-800)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-tertiary)'; }}
    >
      <LibThumb kind={c.thumb} />
    </div>
    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.005em' }}>
      {c.title}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <CategoryPill label={c.category} color={c.cat_color} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="2" y="3" width="12" height="10"/><circle cx="6" cy="7" r="1"/><path d="m2 11 3-3 3 3 2-2 4 4"/>
        </svg>
        {c.count}
      </span>
    </div>
  </button>
);

/* ---------- Tabs -------------------------------------------------- */
const LibraryTabs = ({ value, onChange }) => {
  const items = [
    { k: 'product-pages', label: 'Product Pages' },
    { k: 'collections',   label: 'Collections' },
    { k: 'assets',        label: 'Assets' },
  ];
  return (
    <div className="tabs tabs--underline" role="tablist" style={{ padding: '0 24px' }}>
      {items.map(it => (
        <button key={it.k} role="tab" aria-selected={value === it.k} className="tab"
          onClick={() => onChange(it.k)}>
          {it.label}
        </button>
      ))}
    </div>
  );
};

/* ---------- Page -------------------------------------------------- */
function LibraryPage({ route, onNavigate }) {
  // Tab state is derived from the route so the breadcrumb on asset-details
  // can honestly reflect the user's path (Library › Assets vs Library › Collections).
  const routeTab = (() => {
    const r = route || '/library';
    if (r.startsWith('/library/assets')) return 'assets';
    if (r.startsWith('/library/collections')) return 'collections';
    return 'product-pages';
  })();
  const setTab = (k) => {
    const path = k === 'product-pages' ? '/library' : `/library/${k}`;
    onNavigate && onNavigate(path);
  };
  const tab = routeTab;

  const openCollection = (c) => {
    if (c.route) onNavigate(c.route);
    // Other cards are placeholders in this prototype — no-op.
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route || '/library'} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <LibraryTabs value={tab} onChange={setTab} />

        {tab === 'collections' && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px 14px',
            }}>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                Showing {COLLECTIONS.length} collections
              </div>
              <button className="btn btn--primary btn--sm" style={{ gap: 6 }}>
                {Icons.Plus}<span>Create collection</span>
              </button>
            </div>

            <div style={{
              padding: '8px 24px 80px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
              gap: '28px 20px',
            }}>
              {COLLECTIONS.map(c => (
                <CollectionCard key={c.id} c={c} onOpen={openCollection} />
              ))}
            </div>
          </>
        )}

        {tab === 'product-pages' && <ProductPagesTab onNavigate={onNavigate} />}
        {tab === 'assets' && <AssetsTab onNavigate={onNavigate} />}
      </main>
    </div>
  );
}

/* ---------- Empty tab state -------------------------------------- */
const EmptyTab = ({ label }) => (
  <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 60, color: 'var(--text-quaternary)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 22, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13 }}>This tab is a placeholder for the prototype.</div>
    </div>
  </div>
);

/* =================================================================== */
/*  Product Pages tab                                                  */
/* =================================================================== */
// Flat table of retailer product pages. Each row shows a thumb, a long
// title + ASIN-style product ID, the retailer (Amazon only in this seed),
// and two score chips — Retailer score vs. Live score. Scores are tiered
// into red / amber / lime / green buckets to match the app's scorecard
// conventions.

const PRODUCT_PAGES = [
  { id: 'p01', thumb: 'pp-strips',   title: 'MySmile Teeth Whitening Strips 14 Treatments Kit, Hydroxyapatite-Infuse White Strips, Non-Sensitive Teeth Whitening with Soothing Natural Ingredients, Enamel-Safe, Residue-Free, N…', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: 41,  lscore: 45 },
  { id: 'p02', thumb: 'pp-brush-pink', title: 'MySmile DY156 Electric Toothbrush for Adults, Rechargeable Sonic Battery Toothbrush Portable with 3 Brush Heads, 2 Mins 5 Modes Smart Timer, 45000VPM, One Charge for 60…', asin: 'B0C34GV9ZC', retailer: 'walmart', rscore: 40,  lscore: 64 },
  { id: 'p03', thumb: 'pp-paste-tube', title: 'MySmile Fluoride Free Toothpaste, Nano Hydroxyapatite Toothpaste for Sensitive Teeth, Strengthens Enamel, Remineralizes & Whitens Teeth, Freshens Breath for Adults, SLS Free,…', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: 60,  lscore: 85, selected: true },
  { id: 'p04', thumb: 'pp-led-kit',  title: 'MySmile Teeth Whitening Kit with LED Light, 10 Min Non-Sensitive Fast Teeth Whitener with 3 Carbamide Peroxide Whitening Gel, Helps to Remove Stains from Coffee, Smoking, Wine…', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: null, lscore: 56, processing: true },
  { id: 'p05', thumb: 'pp-box-green', title: 'MySmile 7 Treatments Prefilled Teeth Whitening Trays Kit with 12% Hydrogen Peroxide Whiter Gel for Sensitive Teeth, Fast-Result Vegan Teeth Whitener Tooth Stain Remover, Mi…', asin: 'B0C34GV9ZC', retailer: 'walmart', rscore: 40,  lscore: 81 },
  { id: 'p06', thumb: 'pp-op-z',     title: 'OP-Z portable sequencer, synthesizer, drum machine and visual controller with built-in microphone for sampling, effects and midi, iOS compatible and battery powered', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: 12,  lscore: 25 },
  { id: 'p07', thumb: 'pp-brush-white', title: 'MySmile DY156 Electric Toothbrush for Adults, Rechargeable Sonic Battery Toothbrush Portable with 3 Brush Heads, 2 Mins 5 Modes Smart Timer, 45000VPM, On……', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: null, lscore: 40, processing: true },
  { id: 'p08', thumb: 'pp-wipes',    title: 'MySmile Teeth Wipes 100pcs Disposal Finger Brush Deep Cleaning Wipes Oral Brush Ups', asin: 'B0C34GV9ZC', retailer: 'walmart', rscore: 55, lscore: 58 },
  { id: 'p09', thumb: 'pp-strips',   title: 'MySmile Teeth Whitening Strips — Variety Pack (Mint + Charcoal) 28 Treatments', asin: 'B0C34GV9ZC', retailer: 'amazon', rscore: 72, lscore: 78 },
];

// Compact CSS thumbnails for the PP table, 56×56 rendered.
const PPThumbs = {
  'pp-strips': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2a2f6d 0%, #6b57c0 100%)', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1 }}>
      {[0,1,2,3].map(i => <div key={i} style={{ background: ['#fff','#dfd8ff','#fff','#b8a8ff'][i] }} />)}
    </div>
  ),
  'pp-brush-pink': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fff3ec 0%, #f4cfb4 100%)' }}>
      <div style={{ position: 'absolute', left: '42%', top: '8%', width: '18%', height: '84%', background: 'linear-gradient(90deg, #e8906b, #c56a4a)', borderRadius: 3 }} />
    </div>
  ),
  'pp-paste-tube': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <div style={{ position: 'absolute', left: '20%', top: '22%', width: '55%', height: '56%', background: 'linear-gradient(180deg, #d0d7d0, #5f6f5f)', borderRadius: '30% 8px 8px 30%' }} />
      <div style={{ position: 'absolute', left: '70%', top: '30%', width: '12%', height: '40%', background: '#3a3a3a', borderRadius: 1 }} />
    </div>
  ),
  'pp-led-kit': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a1340 0%, #2a4fb8 100%)' }}>
      <div style={{ position: 'absolute', left: '16%', top: '20%', width: '36%', height: '60%', background: '#12296e' }} />
      <div style={{ position: 'absolute', right: '10%', top: '30%', width: '28%', height: '44%', background: '#4a8cf7', borderRadius: '50%' }} />
    </div>
  ),
  'pp-box-green': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #ebe9e0 0%, #d4d0bd 100%)' }}>
      <div style={{ position: 'absolute', left: '18%', top: '22%', width: '34%', height: '56%', background: '#fff', border: '1.5px solid #5f7e4b' }} />
      <div style={{ position: 'absolute', left: '52%', top: '36%', width: '32%', height: '32%', background: '#5f7e4b', borderRadius: 2 }} />
    </div>
  ),
  'pp-op-z': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #111 0%, #000 100%)' }}>
      <div style={{ position: 'absolute', inset: '14% 10%', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: 2 }}>
        {Array.from({length:12}).map((_,i) => <div key={i} style={{ background: ['#2a5cff','#fff','#f43','#ffd200','#2a5cff','#fff','#1ad','#f43','#fff','#2a5cff','#ffd200','#fff'][i%12] }} />)}
      </div>
    </div>
  ),
  'pp-brush-white': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f4f6fb 0%, #d9dee8 100%)' }}>
      <div style={{ position: 'absolute', left: '44%', top: '6%', width: '14%', height: '88%', background: 'linear-gradient(180deg, #ffffff, #c2c8d3)', borderRadius: 3, boxShadow: 'inset -2px 0 0 rgba(0,0,0,.08)' }} />
    </div>
  ),
  'pp-wipes': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f7f1ea 0%, #dcc7ac 100%)' }}>
      <div style={{ position: 'absolute', inset: '18% 14%', background: '#fff', border: '1px solid #c2a780' }} />
      <div style={{ position: 'absolute', left: '28%', top: '42%', width: '44%', height: '4%', background: '#8b6a3f' }} />
      <div style={{ position: 'absolute', left: '28%', top: '52%', width: '30%', height: '3%', background: '#8b6a3f', opacity: .6 }} />
    </div>
  ),
};

const PPThumb = ({ kind }) => {
  const T = PPThumbs[kind] || PPThumbs['pp-strips'];
  return <T />;
};

// Score sticker (small): mirrors @vizit/atoms ScoreStickerV2 — flat 200-tier
// background, monospace bold value, square footprint. Sized down for the
// product-pages table rows. Tiers follow getScoreColorVariant():
// <20 VeryLow / <40 Low → error-200, <60 Moderate → warning-200,
// <80 High → green-yellow-200, ≥80 VeryHigh → success-200.
const scoreStickerStyle = (v) => {
  if (v == null || v === 0) return { bg: 'var(--gray-200)',          color: 'var(--text-tertiary)' };
  if (v < 40)               return { bg: 'var(--error-200)',         color: '#7a271a' };
  if (v < 60)               return { bg: 'var(--warning-200)',       color: '#7a2e0e' };
  if (v < 80)               return { bg: 'var(--green-yellow-200, #d9f99d)', color: '#365314' };
  return                           { bg: 'var(--success-200)',       color: '#054f31' };
};
const ScoreStickerSm = ({ value }) => {
  if (value == null) {
    return <span style={{ fontSize: 12, color: 'var(--text-quaternary)' }}>Processing</span>;
  }
  const { bg, color } = scoreStickerStyle(value);
  return (
    <span aria-label={`Score: ${value}`} style={{
      display: 'inline-grid', placeItems: 'center',
      width: 36, height: 36,
      background: bg, color,
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, letterSpacing: 0,
    }}>
      {value}
    </span>
  );
};

const RetailerGlyph = ({ retailer }) => {
  const src = retailer === 'walmart' ? 'assets/walmart.png' : 'assets/amazon.png';
  const alt = retailer === 'walmart' ? 'Walmart' : 'Amazon';
  return (
    <span style={{ display: 'inline-grid', placeItems: 'center', width: 22, height: 22 }}>
      <img src={src} alt={alt} style={{ width: 20, height: 20, display: 'block' }} />
    </span>
  );
};

const FakeSelect = ({ label }) => (
  <button style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', height: 36, padding: '0 12px',
    background: '#fff', border: '1px solid var(--border-secondary)',
    font: 'inherit', fontSize: 13, color: 'var(--text-secondary)',
    cursor: 'pointer',
  }}>
    <span>{label}</span>
    <IconAt name="chevron-down.png" size={14} style={{ color: 'var(--text-quaternary)' }} />
  </button>
);

const SearchBox = () => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-quaternary)', display: 'flex' }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5"/><path d="m11 11 3 3"/></svg>
    </span>
    <input placeholder="Search" style={{
      width: '100%', height: 36, padding: '0 12px 0 30px',
      background: '#fff', border: '1px solid var(--border-secondary)',
      font: 'inherit', fontSize: 13, outline: 'none',
    }} />
  </div>
);

// Split-button primary: label + chevron divider (matches screenshot).
const NewProductPageButton = () => (
  <div style={{ display: 'inline-flex', alignItems: 'stretch' }}>
    <button className="btn btn--primary btn--sm" style={{ gap: 6, borderRight: '1px solid rgba(255,255,255,.18)' }}>
      {Icons.Plus}<span>New product page</span>
    </button>
    <button className="btn btn--primary btn--sm" aria-label="New product page options" style={{ padding: '0 8px' }}>
      <IconAt name="chevron-down.png" size={14} />
    </button>
  </div>
);

const ProductPagesTab = ({ onNavigate }) => {
  const [hoverId, setHoverId] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(PRODUCT_PAGES.find(p => p.selected)?.id || null);
  const openProductPage = (p) => {
    setSelectedId(p.id);
    onNavigate && onNavigate(`/library/product-pages/${p.id}`);
  };

  return (
    <>
      {/* Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr)) minmax(220px, 1.4fr)',
        gap: 12,
        padding: '18px 24px 14px',
      }}>
        <FakeSelect label="All categories" />
        <FakeSelect label="All brands" />
        <FakeSelect label="All scores" />
        <SearchBox />
      </div>

      {/* Count + primary action */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px 10px',
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          Showing {PRODUCT_PAGES.length} product pages
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <NewProductPageButton />
          <button className="btn btn--ghost btn--icon btn--sm" aria-label="More actions"
            style={{ border: '1px solid var(--border-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="8" cy="13" r="1.4"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 96px 120px 120px 68px',
          columnGap: 16,
          alignItems: 'center',
          padding: '10px 14px',
          color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.04em',
          borderBottom: '1px solid var(--border-secondary)',
        }}>
          <div>Product</div>
          <div />
          <div style={{ textAlign: 'center' }}>Retailer</div>
          <div style={{ textAlign: 'center' }}>Live score</div>
          <div />
        </div>

        {PRODUCT_PAGES.map((p) => {
          const selected = selectedId === p.id;
          const hovered = hoverId === p.id;
          return (
            <div
              key={p.id}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => openProductPage(p)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 96px 120px 120px 68px',
                columnGap: 16,
                alignItems: 'center',
                padding: '14px',
                cursor: 'pointer',
                background: hovered && !selected ? 'var(--bg-secondary)' : 'transparent',
                outline: selected ? '1px solid var(--border-primary)' : 'none',
                outlineOffset: -1,
                borderBottom: selected ? 0 : '1px solid var(--border-tertiary)',
                transition: 'background .12s',
              }}
            >
              {/* Product */}
              <div style={{ display: 'flex', gap: 12, minWidth: 0, alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-tertiary)', overflow: 'hidden' }}>
                  <PPThumb kind={p.thumb} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: 13, lineHeight: 1.45, color: 'var(--text-primary)',
                    textDecoration: selected ? 'underline' : 'none',
                    textUnderlineOffset: 2,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {p.title}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>
                    {p.asin}
                  </div>
                </div>
              </div>

              {/* Retailer icon */}
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <RetailerGlyph retailer={p.retailer} />
              </div>

              {/* Retailer score */}
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <ScoreStickerSm value={p.rscore} />
              </div>

              {/* Live score */}
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <ScoreStickerSm value={p.lscore} />
              </div>

              {/* Row actions — only visible on the selected row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, opacity: selected ? 1 : 0, transition: 'opacity .12s' }}>
                <button className="btn btn--ghost btn--icon btn--sm" aria-label="Swap" onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h8l-2-2M13 10H5l2 2"/></svg>
                </button>
                <button className="btn btn--ghost btn--icon btn--sm" aria-label="Delete" onClick={(e) => e.stopPropagation()}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M4 4l1 9h6l1-9"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

Object.assign(window, { LibraryPage });

/* =================================================================== */
/*  Assets tab                                                         */
/* =================================================================== */
// Flat grid of individual image assets. Each tile is a small "Asset class"
// micro-label, a square CSS-painted thumbnail, and an editable tag row
// (reusing TagsRow from tags.jsx so tags match the Collections tab).

const ASSET_CLASSES = [
  'In-Use',
  'Lifestyle',
  'Benefit Highlight',
  'Before and After',
  'Product Swatch',
  'Comparison',
  'Product Range',
  'Hero Image',
  'Multi-Pack',
  'Included Items',
  'Feature Callout',
  'Alternate Product Views',
  'Endorsements',
  'Certification Mark',
  'Usage Instructions',
  'Size and Scale',
  'Product Facts Panel',
];

const ASSET_TILES = [
  // Row 1 — hismile / whitening
  { id: 'at01', klass: 'Hero Image',              thumb: 'at-hismile-purple',  tags: ['packshot', 'hero', 'purple'], score: 82, file: 'hismile_hero.jpg',        collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Hero' },
  { id: 'at02', klass: 'In-Use',                  thumb: 'at-smile-woman',     tags: ['lifestyle'],                   score: 74, file: 'smile_woman.jpg',          collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at03', klass: 'Comparison',              thumb: 'at-venn',            tags: ['claims', 'editorial', 'ugc'],  score: 58, file: 'before_after.jpg',         collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at04', klass: 'Hero Image',           thumb: 'at-duo-purple',      tags: ['packshot'],                    score: 71, file: 'range_purple.jpg',         collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Hero' },
  { id: 'at05', klass: 'Benefit Highlight',       thumb: 'at-plaque-claim',    tags: ['claim', 'pink'],               score: 64, file: 'plaque_claim.jpg',         collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at06', klass: 'Feature Callout',         thumb: 'at-brush-modes',     tags: ['feature'],                     score: 52, file: 'brush_modes.jpg',          collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at07', klass: 'Lifestyle',               thumb: 'at-smile-timer',     tags: ['lifestyle', 'hero', 'editorial'], score: 79, file: 'smile_timer.jpg',          collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  // Row 2
  { id: 'at08', klass: 'Hero Image',              thumb: 'at-strips-box',      tags: ['packshot', 'hero'],            score: 69, file: 'strips_quantity.jpg',     collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Hero' },
  { id: 'at09', klass: 'Feature Callout',         thumb: 'at-non-slip',        tags: ['detail'],                      score: 47, file: 'non_slip.jpg',             collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at10', klass: 'Usage Instructions',      thumb: 'at-3-steps',         tags: ['how-to', 'steps', 'editorial'], score: 61, file: 'three_steps.jpg',          collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at11', klass: 'Benefit Highlight',       thumb: 'at-sensitivity',     tags: ['claim'],                       score: 73, file: 'sensitivity_free.jpg',     collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at12', klass: 'Certification Mark',      thumb: 'at-enamel-safe',     tags: ['packshot', 'studio'],          score: 56, file: 'enamel_safe.jpg',          collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  { id: 'at13', klass: 'Hero Image',              thumb: 'at-strips-fan',      tags: ['hero'],                        score: 77, file: 'strips_fan.jpg',           collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Hero' },
  { id: 'at14', klass: 'Usage Instructions',      thumb: 'at-how-to',          tags: ['how-to', 'editorial'],         score: 44, file: 'how_to.jpg',               collection: 'Hismile Teeth Whitening Strips for Sensitive…', category: 'Teeth Whitening Strips', type: 'Carousel' },
  // Row 3 — pistachios / mixed
  { id: 'at15', klass: 'Product Facts Panel',     thumb: 'at-key-ingredients', tags: ['editorial', 'ingredients', 'green'], score: 63, file: 'key_ingredients.jpg',      collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Carousel' },
  { id: 'at16', klass: 'Endorsements',            thumb: 'at-standards',       tags: ['editorial'],                   score: 59, file: 'our_standards.jpg',        collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Carousel' },
  { id: 'at17', klass: 'Hero Image', thumb: 'at-pistachios-duo',  tags: ['packshot', 'green'],           score: 81, file: 'pistachios_duo.jpg',       collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Hero' },
  { id: 'at18', klass: 'In-Use',                  thumb: 'at-pistachio-bowl',  tags: ['lifestyle', 'food', 'ugc'],    score: 72, file: 'pistachio_bowl.jpg',       collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Carousel' },
  { id: 'at19', klass: 'Hero Image',       thumb: 'at-no-shells',       tags: ['claim'],                       score: 86, file: 'no_shells.jpg',            collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Hero' },
  { id: 'at20', klass: 'Lifestyle',               thumb: 'at-on-the-go',       tags: ['lifestyle', 'ugc'],            score: 66, file: 'on_the_go.jpg',            collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Carousel' },
  { id: 'at21', klass: 'Product Facts Panel',     thumb: 'at-protein-chart',   tags: ['infographic', 'nutrition', 'editorial'], score: 54, file: 'protein_chart.jpg',        collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Carousel' },
  // Row 4
  { id: 'at22', klass: 'Hero Image',              thumb: 'at-complete-protein', tags: ['packshot'],                    score: 68, file: 'complete_protein.jpg',     collection: 'Wonderful Pistachios No Shells',                category: 'Pistachios',             type: 'Hero' },
];

// CSS-painted placeholder thumbnails. Square, inset:0, no real imagery.
const AssetThumbs = {
  'at-hismile-purple': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f4e9f5 0%, #e3d0e6 100%)' }}>
      <div style={{ position: 'absolute', left: '18%', top: '16%', width: '28%', height: '68%', background: 'linear-gradient(180deg, #e9dff0, #c9b8d9)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', right: '12%', top: '12%', width: '42%', height: '74%', background: 'linear-gradient(160deg, #6b46c1 0%, #4c2a9e 60%, #2a1458 100%)' }} />
      <div style={{ position: 'absolute', right: '20%', top: '42%', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.04em' }}>hismile</div>
    </div>
  ),
  'at-smile-woman': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f4d0c5 0%, #e09a9f 55%, #8e3a53 100%)' }}>
      <div style={{ position: 'absolute', left: '32%', top: '28%', width: '36%', height: '44%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.7), rgba(255,255,255,0) 60%)' }} />
    </div>
  ),
  'at-venn': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f5f3ea' }}>
      <div style={{ position: 'absolute', left: '18%', top: '22%', width: '46%', height: '46%', borderRadius: '50%', background: '#c7b17a' }} />
      <div style={{ position: 'absolute', right: '18%', top: '32%', width: '46%', height: '46%', borderRadius: '50%', background: '#5d2ba8', mixBlendMode: 'multiply' }} />
    </div>
  ),
  'at-duo-purple': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #ece1ed 0%, #d9c8db 100%)' }}>
      <div style={{ position: 'absolute', left: '26%', top: '14%', width: '18%', height: '72%', background: 'linear-gradient(180deg, #c8b4dc 0%, #7f5bb2 100%)', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: '52%', top: '18%', width: '20%', height: '68%', background: 'linear-gradient(180deg, #b89ccf 0%, #6a3fa3 100%)', borderRadius: 3 }} />
    </div>
  ),
  'at-plaque-claim': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fce7e7 0%, #f4b4b4 100%)', padding: 10, color: '#6c2020', fontSize: 9, fontWeight: 700, lineHeight: 1.2 }}>
      <div>Remove up to</div>
      <div style={{ fontSize: 13, color: '#b71c1c' }}>10x more plaque</div>
    </div>
  ),
  'at-brush-modes': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fde7ea 0%, #f0c4cc 100%)' }}>
      <div style={{ position: 'absolute', left: '38%', top: '12%', width: '18%', height: '76%', background: 'linear-gradient(180deg, #d8a1ad 0%, #8e4a5f 100%)', borderRadius: 20 }} />
    </div>
  ),
  'at-smile-timer': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f2d9d3 0%, #d18a7f 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '24%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.6), rgba(255,255,255,0) 70%)' }} />
    </div>
  ),
  'at-strips-box': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #bfd6e6 0%, #7ba8c8 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '26%', width: '60%', height: '48%', background: 'linear-gradient(135deg, #ec4899 0%, #b91d6a 100%)' }} />
      <div style={{ position: 'absolute', left: '24%', top: '38%', color: '#fff', fontSize: 8, fontWeight: 700 }}>14 treatments</div>
    </div>
  ),
  'at-non-slip': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f3f4f6', display: 'grid', gridTemplateRows: '1fr 1fr' }}>
      <div style={{ background: '#e5e7eb', display: 'grid', placeItems: 'center', color: '#475569', fontSize: 9, fontWeight: 600 }}>Non-slip</div>
      <div style={{ background: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>Whitening strips</div>
    </div>
  ),
  'at-3-steps': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#dbe7f1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 6, gap: 4 }}>
      {[1,2,3].map(i => <div key={i} style={{ background: '#fff', border: '1px solid #b8c9d9' }} />)}
    </div>
  ),
  'at-sensitivity': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e9b6a5 0%, #a33a40 100%)' }}>
      <div style={{ position: 'absolute', left: 8, bottom: 8, color: '#fff', fontSize: 9, fontWeight: 700 }}>Sensitivity free</div>
    </div>
  ),
  'at-enamel-safe': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#d8d8d8' }}>
      <div style={{ position: 'absolute', left: '28%', top: '22%', width: '44%', height: '56%', background: 'linear-gradient(180deg, #ec4899 0%, #9d174d 100%)' }} />
      <div style={{ position: 'absolute', left: '32%', top: '46%', color: '#fff', fontSize: 8, fontWeight: 700 }}>Enamel safe</div>
    </div>
  ),
  'at-strips-fan': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f3f4f6' }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ position: 'absolute', left: `${14 + i*10}%`, top: `${18 + i*4}%`, width: '36%', height: '54%', background: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)', transform: `rotate(${-12 + i*6}deg)`, transformOrigin: 'bottom left' }} />
      ))}
    </div>
  ),
  'at-how-to': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f5f2ec', padding: 8 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#4b3b2a' }}>How to use</div>
      <div style={{ position: 'absolute', right: 8, top: 8, width: '48%', height: '80%', background: 'linear-gradient(180deg, #d7c2a6 0%, #8b6e4e 100%)' }} />
    </div>
  ),
  'at-key-ingredients': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#ece0cd', padding: 10 }}>
      <div style={{ fontFamily: 'serif', fontSize: 12, color: '#3f2f1a', fontStyle: 'italic' }}>Key Ingredients</div>
    </div>
  ),
  'at-standards': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#ede3d0', padding: 10 }}>
      <div style={{ fontFamily: 'serif', fontSize: 12, color: '#3f2f1a', fontStyle: 'italic' }}>Our Standards</div>
    </div>
  ),
  'at-pistachios-duo': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#eef2dc' }}>
      <div style={{ position: 'absolute', left: '14%', top: '14%', width: '36%', height: '72%', background: 'linear-gradient(180deg, #84cc16 0%, #3f6212 100%)' }} />
      <div style={{ position: 'absolute', right: '14%', top: '18%', width: '36%', height: '68%', background: 'linear-gradient(180deg, #a3e635 0%, #4d7c0f 100%)' }} />
    </div>
  ),
  'at-pistachio-bowl': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#0c0a09' }}>
      <div style={{ position: 'absolute', left: '20%', top: '30%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, #6b8e23 0%, #2d3a12 80%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: 8, bottom: 8, color: '#d1fae5', fontSize: 10, fontWeight: 700 }}>Sensitivity free whitening</div>
    </div>
  ),
  'at-no-shells': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)', display: 'grid', placeItems: 'center', color: '#0c0a09', fontWeight: 900, fontSize: 11, textAlign: 'center', lineHeight: 1.1 }}>
      NO SHELLS<br/>ROASTED<br/>&amp; SALTED
    </div>
  ),
  'at-on-the-go': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #a8c45a 0%, #4d7c0f 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '30%', width: '60%', height: '40%', background: 'rgba(255,255,255,0.15)' }} />
    </div>
  ),
  'at-protein-chart': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#a3e635', padding: 8, color: '#0c2a05', fontSize: 9, fontWeight: 800, lineHeight: 1.2 }}>
      A GOOD SOURCE<br/>OF PROTEIN
      <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, display: 'grid', gap: 3 }}>
        {[60, 40, 30, 20].map(w => <div key={w} style={{ height: 4, background: 'rgba(12,42,5,0.2)' }}><div style={{ width: `${w}%`, height: '100%', background: '#0c2a05' }} /></div>)}
      </div>
    </div>
  ),
  'at-complete-protein': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #65a30d 0%, #365314 100%)', display: 'grid', placeItems: 'center', color: '#f7fee7', fontWeight: 900, fontSize: 12, textAlign: 'center' }}>
      COMPLETE<br/>PROTEIN
    </div>
  ),
};

const AssetThumb = ({ kind }) => {
  const T = AssetThumbs[kind] || (() => <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-secondary)' }} />);
  return <T />;
};

const AssetsTab = ({ onNavigate }) => {
  // Mutable tags keyed by asset id, so TagsRow add/remove updates state.
  const [tagsByAsset, setTagsByAsset] = React.useState(() => {
    const m = {};
    ASSET_TILES.forEach(a => { m[a.id] = [...(a.tags || [])]; });
    return m;
  });
  const onAdd = (id, tag) => setTagsByAsset(m => {
    const cur = m[id] || [];
    if (cur.includes(tag)) return m;
    return { ...m, [id]: [...cur, tag] };
  });
  const onRemove = (id, tag) => setTagsByAsset(m => ({
    ...m, [id]: (m[id] || []).filter(t => t !== tag),
  }));
  const dictionary = (typeof TAG_DICTIONARY !== 'undefined') ? TAG_DICTIONARY : [];

  // Asset-class filter — multi-select. Empty = show all.
  const [classFilter, setClassFilter] = React.useState([]);
  // Asset-type filter — single-select. null = All.
  const [typeFilter, setTypeFilter] = React.useState(null);
  const filtered = ASSET_TILES.filter(a =>
    (classFilter.length === 0 || classFilter.includes(a.klass)) &&
    (typeFilter == null || a.type === typeFilter)
  );

  return (
    <>
      {/* Filters */}
      <div style={{
        display: 'flex', gap: 12,
        padding: '18px 24px 14px',
        flexWrap: 'wrap',
      }}>
        <AssetTypeFilter selected={typeFilter} onChange={setTypeFilter} />
        <AssetClassFilter selected={classFilter} onChange={setClassFilter} />
      </div>

      {/* Count + primary action */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px 16px',
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          {filtered.length} {filtered.length === 1 ? 'asset' : 'assets'}
          {typeFilter && (
            <span className="text-quaternary"> · type: {typeFilter}</span>
          )}
          {classFilter.length > 0 && (
            <span className="text-quaternary"> · {classFilter.length} {classFilter.length === 1 ? 'class' : 'classes'} selected</span>
          )}
        </div>
        <button className="btn btn--primary btn--sm" style={{ gap: 6 }}>
          {Icons.Plus}<span>Upload asset</span>
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: '0 24px 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-quaternary)', fontSize: 13 }}>
            No assets match the selected classes.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: '28px 14px',
          }}>
            {filtered.map(a => (
              <AssetTile
                key={a.id}
                asset={{ ...a, tags: tagsByAsset[a.id] || [] }}
                thumb={<AssetThumb kind={a.thumb} />}
                onOpen={() => onNavigate && onNavigate(`/library/assets/${a.id}`)}
                onAddTag={(_id, t) => onAdd(a.id, t)}
                onRemoveTag={(_id, t) => onRemove(a.id, t)}
                dictionary={dictionary}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

/* ---------- Asset-type filter (single-select dropdown) ------------- */
// Single-select for the asset's media type (Hero / Carousel). null = All.
const AssetTypeFilter = ({ selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Counts per type for the menu — read straight from seed.
  const counts = React.useMemo(() => {
    const c = {};
    ASSET_TILES.forEach(a => { c[a.type] = (c[a.type] || 0) + 1; });
    return c;
  }, []);

  const TYPES = ['Hero', 'Carousel'];
  const label = selected || 'All types';

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 180 }}>
      <button
        className="btn btn--secondary"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 40, padding: '0 12px',
          background: '#fff',
          borderColor: open ? 'var(--border-primary)' : 'var(--border-secondary)',
          fontWeight: 500,
        }}
      >
        <span style={{
          color: selected ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{label}</span>
        <IconAt name="chevron-down.png" size={16} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          minWidth: '100%',
          background: '#fff',
          border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)',
          padding: 4,
          zIndex: 30,
        }}>
          {/* "All types" entry — clears the filter. */}
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', height: 32, padding: '0 8px',
              background: selected == null ? 'var(--bg-secondary)' : '#fff',
              border: 0, font: 'inherit', fontSize: 13,
              color: 'var(--text-primary)', cursor: 'pointer',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 14, display: 'inline-flex' }}>
                {selected == null ? <IconAt name="checkmark.png" size={14} /> : null}
              </span>
              All types
            </span>
            <span className="text-quaternary" style={{ fontSize: 12 }}>{ASSET_TILES.length}</span>
          </button>
          <div style={{ height: 1, background: 'var(--border-tertiary)', margin: '4px 0' }} />
          {TYPES.map(t => {
            const active = selected === t;
            return (
              <button
                key={t}
                onClick={() => { onChange(t); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', height: 32, padding: '0 8px',
                  background: active ? 'var(--bg-secondary)' : '#fff',
                  border: 0, font: 'inherit', fontSize: 13,
                  color: 'var(--text-primary)', cursor: 'pointer',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, display: 'inline-flex' }}>
                    {active ? <IconAt name="checkmark.png" size={14} /> : null}
                  </span>
                  {t}
                </span>
                <span className="text-quaternary" style={{ fontSize: 12 }}>{counts[t] || 0}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ---------- Asset-class filter (multi-select dropdown) ------------- */
const AssetClassFilter = ({ selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Counts per class for the menu.
  const counts = React.useMemo(() => {
    const c = {};
    ASSET_TILES.forEach(a => { c[a.klass] = (c[a.klass] || 0) + 1; });
    return c;
  }, []);

  const toggle = (k) => {
    onChange(selected.includes(k) ? selected.filter(x => x !== k) : [...selected, k]);
  };

  const label = selected.length === 0
    ? 'All asset classes'
    : selected.length === 1 ? selected[0] : `${selected.length} asset classes`;

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 220 }}>
      <button
        className="btn btn--secondary"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: 40, padding: '0 12px',
          background: '#fff',
          borderColor: open ? 'var(--border-primary)' : 'var(--border-secondary)',
          fontWeight: 500,
        }}
      >
        <span style={{
          display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
          color: selected.length ? 'var(--text-secondary)' : 'var(--text-tertiary)',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
          {selected.length > 0 && (
            <span style={{
              display: 'inline-grid', placeItems: 'center',
              height: 18, minWidth: 18, padding: '0 5px',
              background: 'var(--brand-100)', color: 'var(--text-brand-secondary)',
              fontSize: 11, fontWeight: 600,
            }}>{selected.length}</span>
          )}
        </span>
        <IconAt name="chevron-down.png" size={14} style={{ color: 'var(--text-quaternary)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          width: 280, maxHeight: 420, overflow: 'auto',
          background: '#fff',
          border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 20,
          padding: 4,
        }}>
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              style={{
                display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', margin: 0,
                background: 'transparent', border: 'none',
                color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer',
              }}
            >
              <span>Clear selection</span>
              <span>{selected.length}</span>
            </button>
          )}
          {ASSET_CLASSES.map(k => {
            const on = selected.includes(k);
            const count = counts[k] || 0;
            return (
              <button key={k} onClick={() => toggle(k)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '8px 10px',
                  background: on ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none', textAlign: 'left', cursor: 'pointer',
                  font: 'inherit', fontSize: 13, color: 'var(--text-secondary)',
                }}
              >
                <span style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: '1px solid ' + (on ? 'var(--brand-600)' : 'var(--border-primary)'),
                  background: on ? 'var(--brand-600)' : '#fff',
                  display: 'grid', placeItems: 'center',
                }}>
                  {on && (
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="m3 8 3 3 7-7"/>
                    </svg>
                  )}
                </span>
                <span style={{ flex: 1 }}>{k}</span>
                <span className="text-quaternary" style={{ fontSize: 12 }}>{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AssetsTab, AssetThumb, ASSET_TILES });
