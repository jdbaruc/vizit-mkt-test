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
const PACK_DESIGNS = [
  {
    id: 'pd01',
    name: 'Route A — Coral hero',
    note: 'Heritage typography, oversized fruit',
    thumb: 'pd-coral',
    overall: 78,
    scores: { shelf: 82, brand: 88, hierarchy: 74, distinctive: 71, legibility: 76 },
  },
  {
    id: 'pd02',
    name: 'Route B — Mono lockup',
    note: 'Stripped-back wordmark, oat tones',
    thumb: 'pd-mono',
    overall: 64,
    scores: { shelf: 58, brand: 72, hierarchy: 66, distinctive: 60, legibility: 64 },
  },
  {
    id: 'pd03',
    name: 'Route C — Citrus burst',
    note: 'High-contrast type, illustrated fruit',
    thumb: 'pd-citrus',
    overall: 86,
    scores: { shelf: 91, brand: 84, hierarchy: 88, distinctive: 89, legibility: 82 },
  },
  {
    id: 'pd04',
    name: 'Route D — Studio noir',
    note: 'Dark mode, foil accent, serif claim',
    thumb: 'pd-noir',
    overall: 52,
    scores: { shelf: 44, brand: 58, hierarchy: 56, distinctive: 62, legibility: 38 },
  },
  {
    id: 'pd05',
    name: 'Route E — Natural craft',
    note: 'Kraft paper, hand-set type, badge',
    thumb: 'pd-craft',
    overall: 71,
    scores: { shelf: 68, brand: 76, hierarchy: 70, distinctive: 65, legibility: 78 },
  },
  {
    id: 'pd06',
    name: 'Route F — Pastel aisle',
    note: 'Soft palette, photographic hero',
    thumb: 'pd-pastel',
    overall: 59,
    scores: { shelf: 54, brand: 62, hierarchy: 60, distinctive: 51, legibility: 68 },
  },
];

/* ---------- Painted thumbs (placeholders for real renders) ----------- */
const PackDesignThumbs = {
  'pd-coral': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fde8e1 0%, #f7c0a8 100%)' }}>
      <div style={{ position: 'absolute', left: '22%', top: '12%', width: '56%', height: '76%', background: 'linear-gradient(180deg, #ff7e5f 0%, #c8472a 100%)', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '34%', transform: 'translateX(-50%)', color: '#fff', fontFamily: 'serif', fontSize: 22, fontStyle: 'italic', letterSpacing: '-0.02em' }}>Marlowe</div>
      <div style={{ position: 'absolute', left: '50%', top: '56%', transform: 'translateX(-50%)', width: '38%', height: '24%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fde047 0%, #d97706 70%)' }} />
    </div>
  ),
  'pd-mono': () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f3eee2' }}>
      <div style={{ position: 'absolute', left: '24%', top: '14%', width: '52%', height: '72%', background: '#ece4d0', border: '1px solid #c8b890' }} />
      <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', color: '#2d2a1f', fontSize: 14, fontWeight: 800, letterSpacing: '.18em' }}>MARLOWE</div>
      <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translateX(-50%)', color: '#736c55', fontSize: 9, letterSpacing: '.16em' }}>OAT · UNSWEETENED</div>
    </div>
  ),
  'pd-citrus': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #fff7ed 0%, #fed7aa 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '10%', width: '60%', height: '80%', background: 'linear-gradient(180deg, #f97316 0%, #c2410c 100%)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translateX(-50%)', color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>ZEST</div>
      <div style={{ position: 'absolute', left: '15%', top: '54%', width: '34%', height: '34%', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #fde047 0%, #ca8a04 80%)' }} />
      <div style={{ position: 'absolute', right: '12%', top: '60%', width: '28%', height: '28%', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #4ade80 0%, #166534 80%)' }} />
    </div>
  ),
  'pd-noir': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)' }}>
      <div style={{ position: 'absolute', left: '24%', top: '12%', width: '52%', height: '76%', background: 'linear-gradient(180deg, #2a2a2a 0%, #0a0a0a 100%)', border: '1px solid #3a3a3a' }} />
      <div style={{ position: 'absolute', left: '50%', top: '32%', transform: 'translateX(-50%)', color: '#d4af37', fontFamily: 'serif', fontStyle: 'italic', fontSize: 18 }}>Marlowe</div>
      <div style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translateX(-50%)', width: '40%', height: 1, background: '#d4af37' }} />
      <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translateX(-50%)', color: '#9a9a9a', fontSize: 8, letterSpacing: '.2em' }}>RESERVE BLEND</div>
    </div>
  ),
  'pd-craft': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #d8b994 0%, #a07b50 100%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: '20%', transform: 'translateX(-50%)', width: '56%', height: '14%', background: '#fef3c7', display: 'grid', placeItems: 'center', color: '#7c2d12', fontWeight: 800, fontSize: 12, letterSpacing: '.1em' }}>SMALL BATCH</div>
      <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translateX(-50%)', color: '#3f2e1a', fontFamily: 'serif', fontSize: 18, fontStyle: 'italic' }}>Marlowe</div>
      <div style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translateX(-50%)', width: 38, height: 38, borderRadius: '50%', border: '2px solid #3f2e1a', display: 'grid', placeItems: 'center', color: '#3f2e1a', fontSize: 8, fontWeight: 700, lineHeight: 1 }}>EST<br/>1962</div>
    </div>
  ),
  'pd-pastel': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fce7f3 0%, #c7d2fe 100%)' }}>
      <div style={{ position: 'absolute', left: '22%', top: '14%', width: '56%', height: '72%', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '34%', transform: 'translateX(-50%)', width: '36%', height: '36%', background: 'radial-gradient(ellipse at 40% 40%, #fbbf24 0%, #b45309 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: '50%', top: '78%', transform: 'translateX(-50%)', color: '#3730a3', fontFamily: 'serif', fontSize: 14, fontStyle: 'italic' }}>marlowe</div>
    </div>
  ),
};
const PackDesignThumb = ({ kind }) => {
  const T = PackDesignThumbs[kind] || (() => <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-secondary)' }} />);
  return <T />;
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

/* ---------- Component-score row (5 mini cells) ----------------------- */
// Tiny version of the ScoreMetricCell row used on PDP — fits inside a card.
const ComponentRow = ({ scores }) => {
  const cells = [
    { key: 'shelf',       label: 'Shelf visibility' },
    { key: 'brand',       label: 'Brand clarity' },
    { key: 'hierarchy',   label: 'Pack hierarchy' },
    { key: 'distinctive', label: 'Distinctiveness' },
    { key: 'legibility',  label: 'Legibility' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
      borderTop: '1px solid var(--border-tertiary)',
      background: 'var(--bg-primary)',
    }}>
      {cells.map((c, i) => {
        const v = scores[c.key];
        const tier = scoreTier(v);
        // Tier → bar fill color, mirroring score-bar's tokens
        const tierColor = {
          vlow:  'var(--error-500)',
          mod:   'var(--yellow-500)',
          high:  'var(--score-high-500, #84cc16)',
          vhigh: 'var(--success-500)',
          na:    'var(--gray-400)',
        }[tier];
        return (
          <div key={c.key} style={{
            borderRight: i < cells.length - 1 ? '1px solid var(--border-tertiary)' : 0,
            padding: '12px 12px 14px',
            display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
            position: 'relative',
          }}>
            <span style={{
              fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.3,
              minHeight: 30, paddingRight: 14,
              overflowWrap: 'anywhere', wordBreak: 'break-word', hyphens: 'auto',
            }}>
              {c.label}
            </span>
            <span aria-hidden style={{
              position: 'absolute', top: 12, right: 10,
              color: 'var(--text-quaternary)', display: 'inline-flex',
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
                <path d="M6 5.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
            <div style={{
              fontSize: 20, fontWeight: 600, color: 'var(--text-primary)',
              fontFeatureSettings: '"tnum"', letterSpacing: '-0.01em', lineHeight: 1,
            }}>{v}</div>
            <div style={{ height: 3, background: 'var(--gray-100)', overflow: 'hidden' }}>
              <div style={{ width: `${v}%`, height: '100%', background: tierColor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- One pack-design card ------------------------------------ */
const PackDesignCard = ({ design }) => {
  const tier = scoreTier(design.overall);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-tertiary)',
    }}>
      {/* Top: thumb + title + sticker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
        <div style={{ position: 'relative', aspectRatio: '4 / 3', background: '#eee', overflow: 'hidden' }}>
          <PackDesignThumb kind={design.thumb} />
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <div className={`score-sticker score-sticker--lg score-sticker--${tier}`} aria-label={`Pack design score ${design.overall}`}>
              <span className="score-sticker__num">{design.overall}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{design.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{design.note}</div>
          </div>
          <button className="btn btn--ghost btn--sm" style={{ gap: 4, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Open
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 4l4 4-4 4"/></svg>
          </button>
        </div>
      </div>

      <ComponentRow scores={design.scores} />
    </div>
  );
};

/* ---------- Upload slot tile ---------------------------------------- */
const UploadSlot = () => (
  <button style={{
    display: 'flex', flexDirection: 'column', gap: 10,
    background: 'var(--bg-secondary)',
    border: '1px dashed var(--border-secondary)',
    cursor: 'pointer', font: 'inherit', textAlign: 'left',
    padding: 0,
  }}>
    <div style={{
      aspectRatio: '4 / 3',
      display: 'grid', placeItems: 'center',
      color: 'var(--text-quaternary)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 40, height: 40,
          background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)',
          display: 'grid', placeItems: 'center', color: 'var(--text-tertiary)',
        }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 11V3M5 6l3-3 3 3M2 11v3h12v-3"/>
          </svg>
        </span>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Upload pack design</div>
        <div style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>PNG, JPG, or PDF · up to 25 MB</div>
      </div>
    </div>
    {/* Empty placeholder rows so the card height matches scored cards */}
    <div style={{ height: 49, borderTop: '1px solid var(--border-tertiary)' }} />
    <div style={{ height: 88, borderTop: '1px solid var(--border-tertiary)' }} />
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

        {/* Grid */}
        <div style={{ padding: '0 24px 80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 20,
          }}>
            {PACK_DESIGNS.map(d => (
              <PackDesignCard key={d.id} design={d} />
            ))}
            <UploadSlot />
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { PackDesignPage });
