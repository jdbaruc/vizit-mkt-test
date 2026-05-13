// =========================================================================
// Opportunity Reporting drill-down — /analytics/opportunity
// =========================================================================
// Reached from the Opportunity section header on /analytics. Mirrors the
// Impact drill-down shell:
//   - Breadcrumb back to "Vizit What Matters"
//   - Title + brand tab strip (active = "All", per-brand tabs after)
//   - Four KPI tiles (ScoreMetricCell) keyed to the score-band cuts the
//     business cares about: <20 at-risk, <80 not-optimized, >=80 ready,
//     plus dollar-range revenue potential
//   - Searchable table of every product, sorted by score asc so the
//     worst-performing rises to the top of the queue
// =========================================================================

const { useState: useStateOR, useMemo: useMemoOR } = React;

/* ---------- breadcrumb back ------------------------------------------- */
const ChevLOR = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10 4-4 4 4 4" />
  </svg>
);

/* ---------- brand avatar (reused) ------------------------------------- */
// Deterministic palette per brand so a brand's avatar reads the same on
// every page it appears on.
const BRAND_PALETTE = [
  { bg: '#E0EAFF', fg: '#3538CD' }, // indigo
  { bg: '#ECFDF3', fg: '#067647' }, // green
  { bg: '#FEF0C7', fg: '#B54708' }, // amber
  { bg: '#FCE4EC', fg: '#C11574' }, // pink
  { bg: '#E0F2FE', fg: '#026AA2' }, // sky
  { bg: '#F4EBFF', fg: '#6941C6' }, // purple
  { bg: '#FFE6D5', fg: '#B93815' }, // orange
  { bg: '#E6F4F1', fg: '#0E7490' }, // teal
  { bg: '#F2F4F7', fg: '#344054' }, // slate
  { bg: '#FEE4E2', fg: '#B42318' }, // red
];
const paletteFor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return BRAND_PALETTE[Math.abs(h) % BRAND_PALETTE.length];
};
const BrandDot = ({ name, size = 24 }) => {
  const p = paletteFor(name);
  return (
    <span aria-hidden style={{
      width: size, height: size, borderRadius: '50%',
      background: p.bg, color: p.fg,
      display: 'inline-grid', placeItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: Math.round(size * 0.4), fontWeight: 700,
      flexShrink: 0,
      border: '1px solid rgba(0,0,0,0.04)',
    }}>{(name[0] || '?').toUpperCase()}</span>
  );
};

/* ---------- brand tab strip ------------------------------------------- */
// Measure-based overflow: render every tab into an invisible "ghost" row,
// note each tab's offsetWidth, then in the visible strip drop tabs that
// don't fit and replace them with a "More ▾" trigger holding the rest in a
// dropdown menu. If the active brand is in the overflow set, we promote it
// into the visible row (swapping out the last visible tab) so the user
// always sees their selection.
const ChevronDownSm = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 4.5 3 3 3-3" />
  </svg>
);

const BrandTabs = ({ brands, active, onChange }) => {
  const items = React.useMemo(() => ['All', ...brands], [brands]);
  const containerRef = React.useRef(null);
  const ghostRef = React.useRef(null);
  const [containerW, setContainerW] = React.useState(0);
  const [tabWidths, setTabWidths] = React.useState([]); // px, parallel to items
  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreRef = React.useRef(null);

  // 1. Observe container width
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerW(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // 2. Re-measure ghost row whenever items change
  React.useEffect(() => {
    if (!ghostRef.current) return;
    const widths = Array.from(ghostRef.current.children).map((n) => Math.ceil(n.getBoundingClientRect().width));
    setTabWidths(widths);
  }, [items]);

  // 3. Close dropdown on outside click / esc
  React.useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [moreOpen]);

  // 4. Decide which tabs fit. Reserve ~92px for the "More ▾" trigger when
  //    there's any chance of overflow. If everything fits, show everything
  //    and hide the trigger.
  const MORE_W = 92;
  let visibleCount = items.length;
  if (containerW > 0 && tabWidths.length === items.length) {
    let used = 0;
    visibleCount = 0;
    // First pass: do they all fit naturally?
    const total = tabWidths.reduce((a, b) => a + b, 0);
    if (total <= containerW) {
      visibleCount = items.length;
    } else {
      // Need a trigger — fit what we can alongside it
      for (let i = 0; i < items.length; i++) {
        if (used + tabWidths[i] + MORE_W <= containerW) {
          used += tabWidths[i];
          visibleCount++;
        } else break;
      }
      // Always show at least the "All" tab
      if (visibleCount < 1) visibleCount = 1;
    }
  }

  let visible = items.slice(0, visibleCount);
  let overflow = items.slice(visibleCount);
  // Promote active brand into the visible row if it's hidden in overflow
  if (overflow.includes(active) && visible.length > 1) {
    const lastVisible = visible[visible.length - 1];
    visible = [...visible.slice(0, -1), active];
    overflow = overflow.filter((b) => b !== active).concat(lastVisible);
  }
  const hasOverflow = overflow.length > 0;
  const overflowActive = overflow.includes(active);

  const tabStyle = (isActive) => ({
    position: 'relative',
    padding: '12px 16px 14px',
    background: 'transparent',
    border: 0,
    borderBottom: isActive ? '2px solid var(--brand-800)' : '2px solid transparent',
    marginBottom: -1,
    font: 'inherit',
    fontSize: 14,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.12s',
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Ghost row — used only for measurement. Off-screen, same type-styling
          as the real tabs so widths match. */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        style={{
          position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
          left: 0, top: 0, display: 'flex',
          whiteSpace: 'nowrap',
        }}
      >
        {items.map((b) => (
          <span key={b} style={{ ...tabStyle(b === active), display: 'inline-block' }}>{b}</span>
        ))}
      </div>

      {/* Visible row */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          borderBottom: '1px solid var(--border-secondary)',
          overflow: 'hidden',
        }}
      >
        {visible.map((b) => {
          const isActive = active === b;
          return (
            <button
              key={b}
              type="button"
              onClick={() => onChange(b)}
              style={tabStyle(isActive)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >{b}</button>
          );
        })}

        {hasOverflow && (
          <div ref={moreRef} style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              style={{
                ...tabStyle(overflowActive),
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
              onMouseEnter={(e) => { if (!overflowActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { if (!overflowActive) e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >
              <span>More</span>
              <span style={{ color: 'var(--text-quaternary)', display: 'inline-flex' }}>
                <ChevronDownSm />
              </span>
              {overflow.length > 0 && (
                <span style={{
                  display: 'inline-grid', placeItems: 'center',
                  minWidth: 18, height: 18, padding: '0 5px',
                  marginLeft: 2,
                  background: overflowActive ? 'var(--brand-800)' : 'var(--bg-secondary)',
                  color: overflowActive ? '#fff' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  borderRadius: 9,
                  lineHeight: 1,
                }}>{overflow.length}</span>
              )}
            </button>

            {moreOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute', top: 'calc(100% + 2px)', right: 0,
                  minWidth: 220, maxHeight: 360, overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid var(--border-secondary)',
                  boxShadow: 'var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.10))',
                  borderRadius: 'var(--radius-xs)',
                  zIndex: 50, padding: 4,
                }}
              >
                {overflow.map((b) => {
                  const isActive = active === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      role="menuitem"
                      onClick={() => { onChange(b); setMoreOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', width: '100%',
                        padding: '7px 10px',
                        background: isActive ? 'var(--brand-50)' : 'transparent',
                        border: 0,
                        font: 'inherit', fontSize: 13,
                        color: isActive ? 'var(--text-brand-secondary)' : 'var(--text-primary)',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >{b}</button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- product fixtures ------------------------------------------ */
// Seed list of 18 rows spanning every brand. Scores are intentionally
// skewed low so the page is dominated by "at risk" and "not optimized"
// states — this is what a real opportunity queue would look like.
const OPP_THUMBS = ['plant','tile','stone','sage','hand','floral','existing','copy-pink','blue-sparkle','mint','studio'];

const OPP_PRODUCTS_RAW = [
  { id: 'op01', sku: 'B0C34GV9ZC', name: 'Marspet UltraFoam Multi-Surface Cleaner Spray, Fresh Citrus Scent, Streak-Free, 32 fl oz, Pack of 3',           brand: 'Pale Blue',         score: 3, assetsOpt: 0, assetsTotal: 5, rev: 230300, thumb: 'tile' },
  { id: 'op02', sku: 'B0C7F8KP2L', name: 'Marspet PowerShine Glass & Mirror Cleaner, Ammonia-Free, Crystal Clear Finish, 28 fl oz',                          brand: 'Pale Blue',         score: 3, assetsOpt: 0, assetsTotal: 5, rev: 140150, thumb: 'blue-sparkle' },
  { id: 'op03', sku: 'B0DRTM91XP', name: 'Operator GentleGlow Bathroom Cleaner Spray, Non-Toxic, Eucalyptus & Tea Tree, 28 fl oz, Pack of 2',                  brand: 'Operator',          score: 4, assetsOpt: 0, assetsTotal: 2, rev: 81453,  thumb: 'sage' },
  { id: 'op04', sku: 'B0AFLM8N42', name: 'V23 Cooktop & Oven Cleaner Paste, Heavy-Duty Burnt-On Grease Remover, Citrus Burst, 12 oz',                          brand: 'V23',               score: 5, assetsOpt: 0, assetsTotal: 9, rev: 13974,  thumb: 'floral' },
  { id: 'op05', sku: 'B0LK29F4HV', name: 'Operator EcoBoost Laundry Detergent Liquid, Hypoallergenic, Free & Clear, HE Compatible, 100 fl oz',                  brand: 'Operator',          score: 6, assetsOpt: 0, assetsTotal: 7, rev: 326105, thumb: 'plant' },
  { id: 'op06', sku: 'B0PVN8K3RM', name: 'Vessel ProLift Pet Stain & Odor Remover, Oxi-Powered Carpet Cleaner Spray, Fresh Meadow, 32 fl oz',                  brand: 'Vessel',            score: 6, assetsOpt: 0, assetsTotal: 1, rev: 254712, thumb: 'studio' },
  { id: 'op07', sku: 'B0XQ7L1PMK', name: 'Vessel MaxPower Pre-Treat Laundry Stain Remover Gel, Color-Safe, 22 fl oz, Pack of 3',                                brand: 'Vessel',            score: 7, assetsOpt: 0, assetsTotal: 6, rev: 199000, thumb: 'stone' },
  { id: 'op08', sku: 'B07HMRZ9XS', name: 'Marspet DeepClean Kitchen Degreaser Spray, Heavy-Duty Grease Cutter, Lemon Zest, 24 fl oz, Pack of 4',                brand: 'Pale Blue',         score: 7, assetsOpt: 1, assetsTotal: 5, rev: 185253, thumb: 'mint' },
  { id: 'op09', sku: 'B0BX7K2L9P', name: 'No Align FreshFlow Drain Cleaner Foam, Non-Caustic, Septic-Safe, Lavender, 32 fl oz',                                  brand: 'No Align',          score: 9, assetsOpt: 0, assetsTotal: 4, rev: 178400, thumb: 'sage' },
  { id: 'op10', sku: 'B09T7XYZ41', name: 'Secondhand DustGuard Microfiber Furniture Spray, Anti-Static, 22 fl oz',                                              brand: 'Secondhand',        score: 11, assetsOpt: 0, assetsTotal: 3, rev: 92800,  thumb: 'hand' },
  { id: 'op11', sku: 'B0CMN8H2QR', name: 'Quiet Room Floor Cleaner Concentrate, Natural Plant-Based, 64 fl oz',                                                 brand: 'Quiet Room',        score: 14, assetsOpt: 0, assetsTotal: 5, rev: 64100,  thumb: 'tile' },
  { id: 'op12', sku: 'B0DP4LF1ZK', name: 'Examine Archive BrightWash Whites Brightener, Bleach-Free, Powder, 80 oz, 60 Loads',                                  brand: 'Examine Archive',   score: 16, assetsOpt: 0, assetsTotal: 6, rev: 121340, thumb: 'studio' },
  { id: 'op13', sku: 'B0CRX9JMNT', name: 'Whorl Tile & Grout Restorer Cream, Bathroom & Kitchen, Mint, 16 oz',                                                  brand: 'Whorl',             score: 22, assetsOpt: 1, assetsTotal: 5, rev: 58400,  thumb: 'blue-sparkle' },
  { id: 'op14', sku: 'B0YK2MN1RX', name: 'Paper Weight EcoRinse Dishwasher Pods, Phosphate-Free, Lemon, 60 Count',                                              brand: 'Paper Weight',      score: 28, assetsOpt: 1, assetsTotal: 4, rev: 142800, thumb: 'plant' },
  { id: 'op15', sku: 'B0VC7K91MN', name: 'Thresh PetSafe Floor Mop Refill Pads, Quick-Dry, 30 Count',                                                            brand: 'Thresh',            score: 41, assetsOpt: 2, assetsTotal: 6, rev: 38200,  thumb: 'hand' },
  { id: 'op16', sku: 'B0RG1MV8QP', name: 'Negative Space ClearGlass Shower Door Cleaner, Streak-Free, Vinegar-Based, 24 fl oz',                                 brand: 'Negative Space',    score: 47, assetsOpt: 2, assetsTotal: 5, rev: 71600,  thumb: 'tile' },
  { id: 'op17', sku: 'B0KJ7M2NXP', name: 'Def Qlub HeavyHaul Bathroom Mildew Spray, Industrial Strength, 32 fl oz',                                              brand: 'Def Qlub',          score: 53, assetsOpt: 3, assetsTotal: 6, rev: 49100,  thumb: 'stone' },
  { id: 'op18', sku: 'B0TX2L8MRP', name: 'Teenage Engineering CitrusFresh Air & Fabric Refresher, Eliminates Odors, 14 fl oz, Pack of 3',                       brand: 'Teenage Engineering', score: 61, assetsOpt: 3, assetsTotal: 5, rev: 88450, thumb: 'mint' },
];

const tierOR = (s) => s < 20 ? 'vlow' : s < 40 ? 'low' : s < 60 ? 'mod' : s < 80 ? 'high' : 'vhigh';

const ScorePillOR = ({ value }) => {
  const t = tierOR(value);
  // Match the soft-fill / dark-glyph pattern from the mock — light tier bg
  // with the saturated tier color punched out as the number.
  const bg = t === 'vlow' || t === 'low' ? 'var(--error-50)'
          : t === 'mod' ? 'var(--warning-50)'
          : t === 'high' ? '#F9FEE7'
          : 'var(--success-50)';
  const fg = t === 'vlow' || t === 'low' ? 'var(--error-700)'
          : t === 'mod' ? 'var(--warning-700)'
          : t === 'high' ? 'var(--score-high-700)'
          : 'var(--success-700)';
  return (
    <span style={{
      display: 'inline-grid', placeItems: 'center',
      width: 34, height: 32,
      background: bg, color: fg,
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15,
      letterSpacing: '-0.01em',
      borderRadius: 3,
    }}>{value}</span>
  );
};

/* ---------- products table ------------------------------------------- */
const fmtUsd = (n) => '$' + n.toLocaleString('en-US');

const OpportunityTable = ({ rows, onRowClick }) => {
  const gridCols = '2.6fr 1.2fr 1fr 1fr 1fr';
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-secondary)',
      borderRadius: 'var(--radius-xs)',
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 16,
        padding: '14px 24px',
        borderBottom: '1px solid var(--border-secondary)',
        background: 'var(--bg-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-quaternary)',
      }}>
        <span>Name</span>
        <span>Brand</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>Product page score <InfoTip /></span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>Asset scores (80+) <InfoTip /></span>
        <span style={{ textAlign: 'right', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>Revenue potential <InfoTip /></span>
      </div>

      {rows.map((r, i) => {
        const last = i === rows.length - 1;
        return (
          <div
            key={r.id}
            role="button"
            tabIndex={0}
            onClick={() => onRowClick && onRowClick(r)}
            onKeyDown={(e) => { if (e.key === 'Enter') onRowClick && onRowClick(r); }}
            style={{
              display: 'grid',
              gridTemplateColumns: gridCols,
              gap: 16,
              padding: '14px 24px',
              alignItems: 'center',
              borderBottom: last ? 'none' : '1px solid var(--border-tertiary)',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {/* Name + thumb + ASIN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <span style={{
                position: 'relative',
                width: 44, height: 44, flexShrink: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-tertiary)',
                overflow: 'hidden',
                display: 'grid', placeItems: 'center',
              }}>
                <Thumb kind={r.thumb} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 3 }}>
                <span style={{
                  fontSize: 13.5, lineHeight: 1.3,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  textWrap: 'pretty',
                }}>{r.name}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-quaternary)',
                }}>{r.sku}</span>
              </div>
            </div>

            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <BrandDot name={r.brand} size={26} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.brand}</span>
            </div>

            {/* Product page score */}
            <div><ScorePillOR value={r.score} /></div>

            {/* Asset scores (80+) — fraction */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 14,
              color: r.assetsOpt === 0 ? 'var(--text-quaternary)' : 'var(--text-primary)',
            }}>
              <span style={{ color: r.assetsOpt === 0 ? 'var(--text-quaternary)' : 'var(--success-600)', fontWeight: 600 }}>{r.assetsOpt}</span>
              <span style={{ color: 'var(--text-quaternary)' }}>/{r.assetsTotal}</span>
            </div>

            {/* Revenue potential */}
            <div style={{
              textAlign: 'right',
              fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600,
              color: 'var(--success-700)',
            }}>{fmtUsd(r.rev)}</div>
          </div>
        );
      })}
    </div>
  );
};

const InfoTip = () => (
  <span style={{ color: 'var(--text-quaternary)', opacity: 0.7, display: 'inline-flex' }}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
      <path d="M6 5.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </span>
);

const SearchGlyphOR = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6.25" cy="6.25" r="4.25" />
    <path d="m9.5 9.5 2.5 2.5" />
  </svg>
);

/* ---------- the page -------------------------------------------------- */
function OpportunityReportingPage({ route, onNavigate }) {
  const brands = window.BRANDS || [];
  const [activeBrand, setActiveBrand] = useStateOR('All');
  const [q, setQ] = useStateOR('');

  // Filter rows by tab + search
  const rows = useMemoOR(() => {
    const norm = q.trim().toLowerCase();
    return OPP_PRODUCTS_RAW
      .filter(r => activeBrand === 'All' || r.brand === activeBrand)
      .filter(r => !norm || r.name.toLowerCase().includes(norm) || r.sku.toLowerCase().includes(norm) || r.brand.toLowerCase().includes(norm))
      .sort((a, b) => a.score - b.score);
  }, [activeBrand, q]);

  // KPI cells — counts are stable per-tab so the page reflects the tab.
  // For "All" we hard-code the workspace-wide numbers from the mock; for
  // a single brand we compute from the visible cohort and scale revenue.
  const kpis = useMemoOR(() => {
    if (activeBrand === 'All') {
      return {
        atRisk:        { value: 102, total: 385, delta: 3 },
        notOptimized:  { value: 264, total: 385, delta: 7 },
        ready:         { value: 82,  total: 385, delta: null },
        revenue:       { value: '$6–8M', cadence: 'in Q4' },
      };
    }
    // Per-brand: count from the FULL brand set (not the searched subset)
    // so KPIs don't blink as the search changes.
    const brandRows = OPP_PRODUCTS_RAW.filter(r => r.brand === activeBrand);
    const total     = brandRows.length;
    const atRisk    = brandRows.filter(r => r.score < 20).length;
    const notOpt    = brandRows.filter(r => r.score < 80).length;
    const ready     = brandRows.filter(r => r.score >= 80).length;
    const rev       = brandRows.reduce((s, r) => s + r.rev, 0);
    const revLo     = Math.round(rev * 1.4 / 1e6 * 10) / 10;
    const revHi     = Math.round(rev * 1.9 / 1e6 * 10) / 10;
    return {
      atRisk:       { value: atRisk, total, delta: null },
      notOptimized: { value: notOpt, total, delta: null },
      ready:        { value: ready,  total, delta: null },
      revenue:      { value: revLo === revHi ? `$${revLo}M` : `$${revLo}–${revHi}M`, cadence: 'in Q4' },
    };
  }, [activeBrand]);

  const neutralValue = { '--smc-value-fg': 'var(--text-primary)' };

  // Workspace label sourced from the StatusBar so heading stays in sync.
  const workspace = 'Marspet';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          flex: 1,
          padding: '36px 48px 64px',
          display: 'flex', flexDirection: 'column', gap: 28,
          maxWidth: 1440,
        }}>

          {/* Title — doubles as breadcrumb back-link via the chart icon */}
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--display-md, 36px)',
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            display: 'inline-flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/analytics')}
              aria-label="Back to Reporting"
              title="Back to Reporting"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44,
                background: 'transparent', border: 0, padding: 0, margin: 0,
                color: 'var(--text-quaternary)', cursor: 'pointer',
                transition: 'color .15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-quaternary)'}
            >
              <IconAt name="chart-sharp.png" size={32} />
            </button>
            <span aria-hidden style={{ color: 'var(--text-quaternary)', fontWeight: 300, fontSize: 'var(--display-sm, 30px)' }}>›</span>
            <span>Opportunity Report</span>
            <span aria-hidden style={{ color: 'var(--text-quaternary)', fontWeight: 300, fontSize: 'var(--display-sm, 30px)' }}>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{activeBrand === 'All' ? 'All brands' : activeBrand}</span>
          </h1>

          {/* Brand tabs */}
          <BrandTabs brands={brands} active={activeBrand} onChange={setActiveBrand} />

          {/* KPI strip */}
          <MetricGroup columns={4}>
            <ScoreMetricCell
              label="Products at risk  (<20)"
              info={false}
              strength={0} totalStrength={0}
              tier="vlow"
              value={kpis.atRisk.value}
              denom={
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>/ {kpis.atRisk.total}</span>
                  <span style={{ color: 'var(--text-quaternary)' }}>·</span>
                  <span style={{ color: 'var(--text-quaternary)' }}>since last month</span>
                </span>
              }
              delta={kpis.atRisk.delta != null ? `${kpis.atRisk.delta} resolved` : undefined}
            />
            <ScoreMetricCell
              label="Products not optimized  (<80)"
              info={false}
              strength={0} totalStrength={0}
              tier="mod"
              value={kpis.notOptimized.value}
              denom={
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>/ {kpis.notOptimized.total}</span>
                  <span style={{ color: 'var(--text-quaternary)' }}>·</span>
                  <span style={{ color: 'var(--text-quaternary)' }}>since last month</span>
                </span>
              }
              delta={kpis.notOptimized.delta != null ? `${kpis.notOptimized.delta} resolved` : undefined}
            />
            <ScoreMetricCell
              label="Conversion-ready PPs  (≥80)"
              info={false}
              strength={0} totalStrength={0}
              tier="vhigh"
              value={kpis.ready.value}
              denom={
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>/ {kpis.ready.total}</span>
                </span>
              }
            />
            <div style={neutralValue}>
              <ScoreMetricCell
                label="Revenue potential"
                tooltip="If these products had syndicated optimized imagery (80+ conversion score), this would have been the dollar amount of revenue."
                strength={0} totalStrength={0}
                tier="na"
                value={kpis.revenue.value}
                denom={<span style={{ color: 'var(--text-quaternary)' }}>{kpis.revenue.cadence}</span>}
              />
            </div>
          </MetricGroup>

          {/* Products table */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <h2 style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--display-xs, 22px)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                }}>{activeBrand === 'All' ? `All ${workspace} Products` : `${activeBrand} Products`}</h2>
                <span style={{
                  display: 'inline-grid', placeItems: 'center',
                  minWidth: 36, height: 22, padding: '0 8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-tertiary)',
                  borderRadius: 11,
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                  color: 'var(--text-tertiary)',
                }}>{rows.length}</span>
              </div>
              <label className="input" style={{ height: 36, width: 280 }}>
                <span className="input__icon"><SearchGlyphOR /></span>
                <input
                  type="search"
                  placeholder="Search by name, ASIN or brand"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </label>
            </div>

            {rows.length === 0 ? (
              <div style={{
                padding: '40px 24px',
                textAlign: 'center',
                background: '#fff',
                border: '1px dashed var(--border-secondary)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-tertiary)',
                fontSize: 13,
              }}>
                No products match this filter.
              </div>
            ) : (
              <OpportunityTable
                rows={rows}
                onRowClick={(r) => onNavigate && onNavigate(`/library/product-pages/${r.sku}`)}
              />
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

Object.assign(window, { OpportunityReportingPage });
