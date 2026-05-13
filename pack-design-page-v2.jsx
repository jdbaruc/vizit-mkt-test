// =========================================================================
// Pack Design Page — /library/pack-designs/:id
// =========================================================================
// A pack-design audit room: at the top, a PDP-style header strip
// (thumb · title · meta cluster of category / benchmark / product). Below,
// a grid of pack-design candidate images, each with 5 component scores
// rendered as ScoreMetricCells:
//   Shelf visibility · Brand clarity · Pack hierarchy · Distinctiveness · Legibility
//
// One of the tiles is an upload slot so the user can drop additional
// renders into the comparison without leaving the page.
// =========================================================================

const { useState: useStatePD } = React;

/* ---------- Seed data ------------------------------------------------ */
// Each design has a single visual identity; the 6 slots are angles of the
// SAME pack — front, back, side, top, on-shelf, lifestyle. Slots can be
// empty so the user sees what's still missing for a fair audit.
const PACK_DESIGNS = [
  {
    id: 'pd01',
    palette: 'coral',
    tags: ['hero', 'PDP', 'A/B'],
    overall: 78,
    scores: { shelf: 82, brand: 88, hierarchy: 74, distinctive: 71, legibility: 76 },
    slots: [
      { label: '0°',   angle: 'front',     tags: ['hero', 'PDP'] },
      { label: '180°', angle: 'back',      tags: ['nutrition'] },
      { label: '90°',  angle: 'side',      tags: [] },
      { label: 'Top',  angle: 'top',       tags: ['lid'] },
      { label: 'Shelf', angle: 'shelf',    tags: ['in-store'] },
      { label: 'Lifestyle', angle: null,   tags: [] },
    ],
  },
  {
    id: 'pd02',
    palette: 'mono',
    tags: ['minimal', 'in-store'],
    overall: 64,
    scores: { shelf: 58, brand: 72, hierarchy: 66, distinctive: 60, legibility: 64 },
    slots: [
      { label: '0°',   angle: 'front',     tags: ['hero'] },
      { label: '180°', angle: 'back',      tags: [] },
      { label: '90°',  angle: 'side',      tags: [] },
      { label: 'Top',  angle: null,        tags: [] },
      { label: 'Shelf', angle: 'shelf',    tags: ['in-store'] },
      { label: 'Lifestyle', angle: null,   tags: [] },
    ],
  },
  {
    id: 'pd03',
    palette: 'citrus',
    tags: ['campaign', 'limited'],
    overall: 86,
    scores: { shelf: 91, brand: 84, hierarchy: 88, distinctive: 89, legibility: 82 },
    slots: [
      { label: '0°',   angle: 'front',     tags: ['hero', 'PDP', 'A/B'] },
      { label: '180°', angle: 'back',      tags: ['nutrition'] },
      { label: '90°',  angle: 'side',      tags: ['ingredients'] },
      { label: 'Top',  angle: 'top',       tags: ['lid'] },
      { label: 'Shelf', angle: 'shelf',    tags: ['in-store'] },
      { label: 'Lifestyle', angle: 'lifestyle', tags: ['campaign'] },
    ],
  },
  {
    id: 'pd04',
    palette: 'noir',
    tags: ['draft'],
    overall: 52,
    scores: { shelf: 44, brand: 58, hierarchy: 56, distinctive: 62, legibility: 38 },
    slots: [
      { label: '0°',   angle: 'front',     tags: ['hero', 'draft'] },
      { label: '180°', angle: null,        tags: [] },
      { label: '90°',  angle: null,        tags: [] },
      { label: 'Top',  angle: null,        tags: [] },
      { label: 'Shelf', angle: 'shelf',    tags: [] },
      { label: 'Lifestyle', angle: null,   tags: [] },
    ],
  },
]

/* ---------- Painted pack mocks (placeholder for real renders) -------- */
// One palette per design — each angle reuses the same colors / lockup so
// the 6 slots look like the SAME pack viewed from different sides.
const PALETTES = {
  coral:  { bg1: '#fde8e1', bg2: '#f7c0a8', pack1: '#ff7e5f', pack2: '#c8472a', ink: '#fff',     accent: '#fde047', shelf: '#f7c0a8' },
  mono:   { bg1: '#f3eee2', bg2: '#e6dcc4', pack1: '#ece4d0', pack2: '#d6c79e', ink: '#2d2a1f', accent: '#736c55', shelf: '#e6dcc4' },
  citrus: { bg1: '#fff7ed', bg2: '#fed7aa', pack1: '#f97316', pack2: '#c2410c', ink: '#fff',     accent: '#fde047', shelf: '#fed7aa' },
  noir:   { bg1: '#1a1a1a', bg2: '#000000', pack1: '#2a2a2a', pack2: '#0a0a0a', ink: '#d4af37', accent: '#9a9a9a', shelf: '#1a1a1a' },
};

// Brand mark used on every angle so it reads as the same SKU.
const BrandMark = ({ p, scale = 1 }) => (
  <div style={{
    color: p.ink, fontFamily: 'serif', fontStyle: 'italic',
    fontSize: 18 * scale, letterSpacing: '-0.02em', lineHeight: 1,
  }}>marlowe</div>
);

// Tiny lockup variant for backs / sides where the front face isn't shown.
const BrandStrip = ({ p }) => (
  <div style={{
    width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  }}>
    <div style={{ color: p.ink, fontSize: 9, fontWeight: 700, letterSpacing: '.16em' }}>MARLOWE OAT</div>
    <div style={{ height: 1, width: '50%', background: p.ink, opacity: 0.5 }} />
  </div>
);

const PackAngles = {
  // Front — hero face
  front: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg1} 0%, ${p.bg2} 100%)` }}>
      <div style={{ position: 'absolute', left: '24%', top: '12%', width: '52%', height: '76%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)`, boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '34%', transform: 'translateX(-50%)' }}>
        <BrandMark p={p} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translateX(-50%)', width: '36%', height: '24%', borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${p.accent} 0%, ${p.pack2} 80%)` }} />
    </div>
  ),
  // Back — nutrition / copy block, same colorway
  back: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg1} 0%, ${p.bg2} 100%)` }}>
      <div style={{ position: 'absolute', left: '24%', top: '12%', width: '52%', height: '76%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)` }} />
      <div style={{ position: 'absolute', left: '32%', top: '20%', right: '32%', display: 'flex', justifyContent: 'center' }}>
        <BrandStrip p={p} />
      </div>
      <div style={{ position: 'absolute', left: '32%', right: '32%', top: '38%', height: '46%', background: 'rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 3, padding: 8 }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{ height: 2, background: p.ink, opacity: 0.45, width: `${85 - (i % 3) * 12}%` }} />
        ))}
      </div>
    </div>
  ),
  // Side — narrow panel, lockup vertical-ish
  side: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg1} 0%, ${p.bg2} 100%)` }}>
      <div style={{ position: 'absolute', left: '38%', top: '12%', width: '24%', height: '76%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)` }} />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)', whiteSpace: 'nowrap' }}>
        <BrandMark p={p} scale={0.7} />
      </div>
    </div>
  ),
  // Top — looking down at the pack
  top: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg1} 0%, ${p.bg2} 100%)` }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) perspective(120px) rotateX(55deg)', width: '60%', height: '60%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)`, boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%)' }}>
        <BrandMark p={p} scale={0.7} />
      </div>
    </div>
  ),
  // On-shelf — the same pack repeated next to a couple of competitors
  shelf: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: '#e9e7e2' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', height: 2, background: '#bbb6a8' }} />
      <div style={{ position: 'absolute', left: '8%', bottom: '16%', width: '20%', height: '60%', background: '#cfc8b4', border: '1px solid #aaa392' }} />
      <div style={{ position: 'absolute', left: '32%', bottom: '16%', width: '20%', height: '60%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)`, boxShadow: '0 4px 10px rgba(0,0,0,0.18)' }}>
        <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)' }}>
          <BrandMark p={p} scale={0.55} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: '54%', bottom: '16%', width: '20%', height: '60%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)` }}>
        <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)' }}>
          <BrandMark p={p} scale={0.55} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: '76%', bottom: '16%', width: '18%', height: '60%', background: '#d8d2c0', border: '1px solid #aaa392' }} />
    </div>
  ),
  // Lifestyle — pack on a kitchen surface, soft light
  lifestyle: (p) => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f3ece1 0%, #d8c8a8 100%)' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '60%', bottom: 0, background: 'linear-gradient(180deg, #c8b78f 0%, #8a7048 100%)' }} />
      <div style={{ position: 'absolute', left: '34%', top: '22%', width: '32%', height: '54%', background: `linear-gradient(180deg, ${p.pack1} 0%, ${p.pack2} 100%)`, boxShadow: '0 12px 22px rgba(0,0,0,0.28)' }}>
        <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translateX(-50%)' }}>
          <BrandMark p={p} scale={0.65} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: '12%', bottom: '12%', width: '18%', height: '14%', borderRadius: '50%', background: 'rgba(0,0,0,0.18)', filter: 'blur(4px)' }} />
    </div>
  ),
};

const PackThumb = ({ palette, angle }) => {
  const p = PALETTES[palette] || PALETTES.coral;
  const Render = PackAngles[angle] || PackAngles.front;
  return Render(p);
};

/* ---------- Header (matches PDP language) ---------------------------- */
const PackDesignCrumbs = ({ onNavigate }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    height: 44, padding: '0 16px',
    borderBottom: '1px solid var(--border-secondary)',
    background: 'var(--bg-primary)',
  }}>
    <button
      onClick={() => onNavigate && onNavigate('/home')}
      aria-label="Back to home"
      className="btn btn--ghost btn--icon btn--sm"
      style={{ color: 'var(--text-quaternary)' }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 7 8 2l6 5v7H2V7Z"/>
      </svg>
    </button>
    <span style={{ color: 'var(--text-quaternary)' }}>›</span>
    <button
      onClick={() => onNavigate && onNavigate('/library')}
      style={{
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        color: 'var(--text-tertiary)', font: 'inherit', fontSize: 13,
      }}
    >Pack designs</button>
    <span style={{ color: 'var(--text-quaternary)' }}>›</span>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 10px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-tertiary)',
      fontSize: 13, color: 'var(--text-secondary)',
      maxWidth: 360, overflow: 'hidden',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Marlowe Oat — Q4 redesign
      </span>
    </div>
    <div style={{ flex: 1 }} />
    <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 11v3h12v-3M8 1v9M5 7l3 3 3-3"/>
      </svg>
      Export report
    </button>
    <button className="btn btn--primary btn--sm" style={{ gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 3v10M3 8h10"/>
      </svg>
      Upload designs
    </button>
  </div>
);

const PackDesignHeader = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '72px 1fr auto',
    alignItems: 'flex-start', gap: 20,
    padding: '18px 24px',
    borderBottom: '1px solid var(--border-tertiary)',
    background: 'var(--bg-primary)',
  }}>
    {/* Project thumb — abstract pack stack */}
    <div style={{
      width: 64, height: 64, position: 'relative', overflow: 'hidden',
      background: '#f3eee2', border: '1px solid var(--border-tertiary)',
    }}>
      <div style={{ position: 'absolute', left: 10, top: 8, width: 26, height: 48, background: 'linear-gradient(180deg, #ff7e5f, #c8472a)' }} />
      <div style={{ position: 'absolute', right: 10, top: 14, width: 22, height: 42, background: 'linear-gradient(180deg, #fde047, #ca8a04)' }} />
    </div>

    {/* Title block */}
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, letterSpacing: '-0.005em' }}>
        Marlowe Oat — Q4 carton redesign exploration
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
        6 candidates · last updated 2 days ago by Mara D.
      </div>
    </div>

    {/* Meta cluster */}
    <div style={{ display: 'flex', gap: 32, paddingTop: 4 }}>
      {[
        { label: 'Category',    value: 'Plant-based milk' },
        { label: 'Benchmark',   value: 'Oatly Original' },
        { label: 'Audience',    value: 'Millennial women, urban' },
      ].map(m => (
        <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
          <span style={{ fontSize: 11, color: 'var(--text-quaternary)', letterSpacing: '0.04em' }}>{m.label}</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{m.value}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Component-score list (vertical, sits to the right of slots) - */
const ComponentList = ({ scores }) => {
  const rows = [
    { key: 'shelf',       label: 'Shelf visibility', sub: 'Standout against typical category permutations.' },
    { key: 'brand',       label: 'Brand clarity',    sub: '"Who is this?" recognition at a glance.' },
    { key: 'hierarchy',   label: 'Pack hierarchy',   sub: 'Eye flow lands on the key claim, not noise.' },
    { key: 'distinctive', label: 'Distinctiveness',  sub: 'Differentiation in a sea of same.' },
    { key: 'legibility',  label: 'Legibility',       sub: 'In-store and digital-shelf hero readability.' },
  ];
  const tierColor = {
    vlow:  'var(--error-500)',
    mod:   'var(--yellow-500)',
    high:  'var(--score-high-500, #84cc16)',
    vhigh: 'var(--success-500)',
    na:    'var(--gray-400)',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((r, i) => {
        const v = scores[r.key];
        const tier = scoreTier(v);
        return (
          <div key={r.key} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center', gap: 16,
            padding: '12px 16px',
            borderTop: i === 0 ? 0 : '1px solid var(--border-tertiary)',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              }}>
                {r.label}
                <span aria-hidden style={{ color: 'var(--text-quaternary)', display: 'inline-flex' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
                    <path d="M6 5.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{r.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 132 }}>
              <div style={{ flex: 1, height: 4, background: 'var(--gray-100)', overflow: 'hidden' }}>
                <div style={{ width: `${v}%`, height: '100%', background: tierColor[tier] }} />
              </div>
              <span style={{
                fontSize: 18, fontWeight: 600, color: 'var(--text-primary)',
                fontFeatureSettings: '"tnum"', letterSpacing: '-0.01em',
                width: 28, textAlign: 'right',
              }}>{v}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Hero + thumbnail strip (left half of each row) ----------- */
// Big hero preview of the currently-selected pack image, with a 2-column
// thumbnail strip alongside (5 remaining slots; the 6th is the hero).
// Filled slots show a thumb; empty slots invite an upload.
const SlotThumb = ({ slot, palette, active, size = 'sm' }) => {
  const isHero = size === 'hero';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, height: '100%' }}>
      <div style={{
        position: 'relative', flex: 1, minHeight: 0,
        aspectRatio: isHero ? undefined : '1 / 1',
        overflow: 'hidden',
        background: slot.angle ? '#fff' : 'var(--bg-primary)',
        border: slot.angle
          ? (active ? '1.5px solid var(--text-primary)' : '1px solid var(--border-tertiary)')
          : '1px dashed var(--border-secondary)',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}>
        {slot.angle ? (
          <PackThumb palette={palette} angle={slot.angle} />
        ) : (
          <div style={{
            flex: 1, display: 'grid', placeItems: 'center',
            color: 'var(--text-quaternary)',
          }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <svg width={isHero ? 22 : 16} height={isHero ? 22 : 16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 4v8M4 8h8"/>
              </svg>
              <span style={{ fontSize: isHero ? 12 : 10 }}>Add image</span>
            </span>
          </div>
        )}
      </div>
      <div style={{
        fontSize: 10, color: active ? 'var(--text-primary)' : 'var(--text-quaternary)',
        fontWeight: active ? 600 : 400,
        textTransform: 'uppercase', letterSpacing: '.06em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{slot.label}</div>
    </div>
  );
};

const HeroAndThumbs = ({ slots, palette }) => {
  // Pick first filled slot as hero, else first slot.
  const heroIdx = Math.max(0, slots.findIndex(s => s.angle));
  const hero = slots[heroIdx];
  const rest = slots.filter((_, i) => i !== heroIdx);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
      gap: 12,
      padding: 12,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-tertiary)',
    }}>
      {/* 2-col thumbnail strip — left side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: '1fr',
        gap: 8,
        minWidth: 0,
      }}>
        {rest.map((s, i) => (
          <SlotThumb key={i} slot={s} palette={palette} />
        ))}
      </div>

      {/* Hero preview — right side */}
      <SlotThumb slot={hero} palette={palette} active size="hero" />
    </div>
  );
};

/* ---------- One pack-design row ------------------------------------ */
// Layout:
//   ┌──────────────────────────────────────────────────────────────┐
//   │ Header: name + note + sticker                                │
//   ├──────────────────────────────┬───────────────────────────────┤
//   │ Slot grid (3×2)              │ Component list (5 rows)       │
//   └──────────────────────────────┴───────────────────────────────┘
const PackDesignCard = ({ design }) => {
  const tier = scoreTier(design.overall);
  const filledCount = design.slots.filter(s => s.angle).length;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-tertiary)',
    }}>
      {/* Header strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center', gap: 16,
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-tertiary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flexWrap: 'wrap' }}>
          <div className={`score-sticker score-sticker--lg score-sticker--${tier}`} aria-label={`Pack design score ${design.overall}`}>
            <span className="score-sticker__num">{design.overall}</span>
          </div>
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-quaternary)', letterSpacing: '.04em', textTransform: 'uppercase' }}>Design</div>
            <div style={{ fontSize: 12, color: filledCount < design.slots.length ? 'var(--text-warning-primary, var(--yellow-700))' : 'var(--text-tertiary)' }}>
              {filledCount} of {design.slots.length} images
            </div>
          </div>
          {/* Tag chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', marginLeft: 4 }}>
            {(design.tags || []).map(t => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 500, lineHeight: 1,
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-tertiary)',
                padding: '4px 7px',
                letterSpacing: '.02em',
                whiteSpace: 'nowrap',
              }}>{t}</span>
            ))}
            <button title="Add tag" style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 11, lineHeight: 1, font: 'inherit',
              color: 'var(--text-tertiary)',
              background: 'transparent',
              border: '1px dashed var(--border-secondary)',
              padding: '3px 6px',
              cursor: 'pointer',
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2v8M2 6h8"/>
              </svg>
              tag
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost btn--sm" style={{ gap: 4, color: 'var(--text-tertiary)' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M8 11V3M5 6l3-3 3 3M2 11v3h12v-3"/>
            </svg>
            Add images
          </button>
        </div>
      </div>

      {/* Body: hero+thumbs | components */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
      }}>
        <HeroAndThumbs slots={design.slots} palette={design.palette} />
        <ComponentList scores={design.scores} />
      </div>
    </div>
  );
};

/* ---------- Empty new-design row ---------------------------------- */
const NewDesignRow = () => (
  <button style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: 'var(--bg-secondary)',
    border: '1px dashed var(--border-secondary)',
    cursor: 'pointer', font: 'inherit',
    padding: '24px 16px',
    color: 'var(--text-secondary)',
  }}>
    <span style={{
      width: 28, height: 28,
      background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)',
      display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)',
    }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3v10M3 8h10"/></svg>
    </span>
    <span style={{ fontSize: 13, fontWeight: 500 }}>Add a new design</span>
    <span style={{ fontSize: 12, color: 'var(--text-quaternary)' }}>· 6 image slots per design</span>
  </button>
);

/* ---------- Main page ------------------------------------------------ */
function PackDesignPage({ route, onNavigate }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} data-screen-label="Pack design audit">
        <PackDesignCrumbs onNavigate={onNavigate} />
        <PackDesignHeader />

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: '20px 24px 12px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.005em' }}>
              Design candidates
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Each design is scored across five components: shelf visibility, brand clarity, pack hierarchy, distinctiveness, and legibility.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-quaternary)' }}>Sort:</span>
            <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
              Score (high → low)
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6l4 4 4-4"/></svg>
            </button>
          </div>
        </div>

        {/* Stacked rows — full width per design */}
        <div style={{ padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PACK_DESIGNS.map(d => (
              <PackDesignCard key={d.id} design={d} />
            ))}
            <NewDesignRow />
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { PackDesignPage: PackDesignPage });
