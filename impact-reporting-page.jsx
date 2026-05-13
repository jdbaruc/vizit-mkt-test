// =========================================================================
// Impact Reporting drill-down — /analytics/impact
// =========================================================================
// Reached from the Impact section header on /analytics. Composes:
//   - Breadcrumb back to Vizit What Matters
//   - Hero title with the three core Impact KPIs (same ScoreMetricCells)
//   - Conversion-bump trend chart (SVG sparkline-style line over 12 weeks)
//   - Optimized-products table — per-row: thumb · title · before/after
//     scores · conversion lift · revenue lift
// =========================================================================

const { useState: useStateIR } = React;

/* ---------- tiny svg primitives ----------------------------------------- */
const ChevL = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10 4-4 4 4 4" />
  </svg>
);

/* ---------- chart ------------------------------------------------------ */
// Two-series line chart: optimized cohort vs baseline. Data is hand-tuned
// so the optimized line clears the baseline mid-Q and ends at +28%.
const TREND = {
  weeks: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],
  baseline:  [ 6,  7,  6,  8,  7,  9,  8,  9,  8, 10,  9, 10],
  optimized: [ 7,  8,  9, 11, 14, 16, 19, 21, 23, 25, 27, 28],
};

const TrendChart = () => {
  const W = 920, H = 220;
  const padL = 36, padR = 12, padT = 16, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxY = 32;
  const n = TREND.weeks.length;
  const x = (i) => padL + (innerW * i) / (n - 1);
  const y = (v) => padT + innerH - (innerH * v) / maxY;

  const path = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = (arr) => `${path(arr)} L ${x(n - 1).toFixed(1)} ${y(0)} L ${x(0).toFixed(1)} ${y(0)} Z`;
  const yTicks = [0, 8, 16, 24, 32];

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-secondary)',
      borderRadius: 'var(--radius-xs)',
      padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-quaternary)' }}>
            Conversion bump (%) · trailing 12 weeks
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            +28% as of W12
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 2, background: 'var(--success-600, #10b981)', display: 'inline-block' }} />
            Optimized cohort
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 2, background: 'var(--text-quaternary)', display: 'inline-block', opacity: 0.6 }} />
            Baseline
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block' }}>
        {/* grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--border-tertiary)" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-quaternary)">{t}%</text>
          </g>
        ))}
        {/* baseline */}
        <path d={path(TREND.baseline)} fill="none" stroke="var(--text-quaternary)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        {/* optimized area + line */}
        <path d={area(TREND.optimized)} fill="var(--success-600, #10b981)" opacity="0.08" />
        <path d={path(TREND.optimized)} fill="none" stroke="var(--success-600, #10b981)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* points on optimized */}
        {TREND.optimized.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === n - 1 ? 4 : 2.5} fill="#fff" stroke="var(--success-600, #10b981)" strokeWidth="1.5" />
        ))}
        {/* x labels */}
        {TREND.weeks.map((w, i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-quaternary)">{w}</text>
        ))}
      </svg>
    </div>
  );
};

/* ---------- optimized products table ----------------------------------- */
// Each row is a clickable disclosure. When expanded it reveals:
//   left  → "Carousel" preview strip (shipped assets) + meta grid
//   right → CVR chart with a vertical "shipped" marker; hover the pre-ship
//           region to peek at the ORIGINAL carousel that was live before.
const ROWS = [
  { id: 'p01', sku: 'B07HMRZ9XS', name: 'Hismile v34 Colour Corrector',    brand: 'Pale Blue',        cat: 'Cell Phones & Accessories', retailer: 'Amazon US', shipDateLabel: 'Oct 5, 2025',  liveDays: 102,
    before: 22, after: 98, bump: '+34%', weekly: '$3,420', total: '$148K',
    originalCarousel: ['existing', 'copy-pink', 'stone', 'tile', 'sage', 'plant'],
    shippedCarousel:  ['blue-sparkle', 'mint', 'studio', 'sage', 'hand', 'floral'] },
  { id: 'p02', sku: 'B0BX7K2L9P', name: 'Wonderful Pistachios No Shells',  brand: 'Operator',         cat: 'MP3 & MP4 Players',           retailer: 'Amazon US', shipDateLabel: 'Sep 21, 2025', liveDays: 116,
    before: 41, after: 97, bump: '+22%', weekly: '$2,180', total: '$104K',
    originalCarousel: ['stone', 'existing', 'plant', 'tile', 'studio', 'sage'],
    shippedCarousel:  ['sage', 'plant', 'mint', 'studio', 'hand', 'tile'] },
  { id: 'p03', sku: 'B09T7XYZ41', name: 'Marlowe Body Bar — Cedar',        brand: 'V23',              cat: 'Digital Voice Recorders',    retailer: 'Amazon US', shipDateLabel: 'Sep 8, 2025',  liveDays: 129,
    before: 18, after: 95, bump: '+41%', weekly: '$1,840', total: '$82K',
    originalCarousel: ['existing', 'copy-pink', 'sage', 'tile', 'floral', 'studio'],
    shippedCarousel:  ['studio', 'sage', 'mint', 'stone', 'hand', 'plant'] },
  { id: 'p04', sku: 'B0CMN8H2QR', name: 'Hanni Splash Salve Original',     brand: 'Vessel',           cat: 'Tabletop Synthesizers',    retailer: 'Amazon US', shipDateLabel: 'Aug 25, 2025', liveDays: 143,
    before: 54, after: 93, bump: '+18%', weekly: '$1,260', total: '$58K',
    originalCarousel: ['tile', 'plant', 'stone', 'sage', 'existing', 'studio'],
    shippedCarousel:  ['plant', 'tile', 'sage', 'stone', 'floral', 'studio'] },
  { id: 'p05', sku: 'B0DP4LF1ZK', name: 'Fruity Pebbles Family Pack',      brand: 'No Align',         cat: 'Portable Bluetooth Speakers',           retailer: 'Amazon US', shipDateLabel: 'Aug 11, 2025', liveDays: 157,
    before: 27, after: 91, bump: '+27%', weekly: '$2,710', total: '$122K',
    originalCarousel: ['existing', 'copy-pink', 'studio', 'tile', 'mint', 'sage'],
    shippedCarousel:  ['mint', 'sage', 'studio', 'floral', 'plant', 'tile'] },
  { id: 'p06', sku: 'B0CRX9JMNT', name: 'Olipop Tropical Punch 12-pack',   brand: 'Quiet Room',       cat: 'Cell Phones & Accessories',        retailer: 'Amazon US', shipDateLabel: 'Jul 28, 2025', liveDays: 171,
    before: 33, after: 88, bump: '+31%', weekly: '$1,940', total: '$91K',
    originalCarousel: ['studio', 'existing', 'plant', 'sage', 'tile', 'stone'],
    shippedCarousel:  ['blue-sparkle', 'mint', 'sage', 'tile', 'studio', 'floral'] },
].sort((a, b) => b.after - a.after);

const tierOf = (s) => s < 30 ? 'vlow' : s < 50 ? 'low' : s < 70 ? 'mod' : s < 85 ? 'high' : 'vhigh';

const ScorePill = ({ value }) => {
  const t = tierOf(value);
  const fg = t === 'vlow' || t === 'low' ? 'var(--error-600)'
           : t === 'mod' ? 'var(--warning-500)'
           : t === 'high' ? 'var(--score-high-600)'
           : 'var(--success-600)';
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
      color: fg, letterSpacing: '-0.01em',
    }}>{value}</span>
  );
};

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-quaternary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6h8" />
    <path d="m7 3 3 3-3 3" />
  </svg>
);

/* ---------- CVR chart helpers ------------------------------------------ */
// Deterministic seeded random so each row's chart is stable across renders.
const seedRng = (seed) => {
  let s = seed | 0 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// 180-day window with the ship marker placed proportionally inside it so the
// pre-period is visible on every row. We label only the month boundaries.
const buildSeries = (row) => {
  const rng = seedRng((row.id.charCodeAt(1) || 1) * 131 + (row.id.charCodeAt(2) || 1) * 7);
  const N = 180;
  // ship marker between 50% and 65% across so post-ship lift is the focus
  const shipIdx = Math.round(N * (0.52 + rng() * 0.10));
  const baseline = [];
  const ciLo = [];
  const ciHi = [];
  const product = [];
  for (let i = 0; i < N; i++) {
    const cat = 0.26 + (i / N) * 0.07 + Math.sin(i / 22 + rng() * 0.4) * 0.012 + (rng() - 0.5) * 0.008;
    baseline.push(cat);
    ciLo.push(Math.max(0.10, cat - 0.14 - rng() * 0.03));
    ciHi.push(cat + 0.07 + rng() * 0.02);
    if (i < shipIdx) {
      // pre-ship: noisy mid-range CVR with a couple of dips
      const trend = 0.52 + Math.sin(i / 14) * 0.10 + Math.sin(i / 38) * 0.08 + (rng() - 0.5) * 0.06;
      product.push(Math.max(0.34, Math.min(0.72, trend)));
    } else {
      // post-ship: quick rise to a peak ~15% past ship, then a noisy decay
      const t = (i - shipIdx) / (N - shipIdx);
      const peak = 0.88 - Math.abs(t - 0.18) * 0.55 - t * 0.10;
      product.push(Math.max(0.45, Math.min(0.92, peak + (rng() - 0.5) * 0.045)));
    }
  }
  return { N, shipIdx, baseline, ciLo, ciHi, product };
};

// X-axis: derive month labels from a synthetic 6-month window ending "now".
// We pin the end to Oct 27, 2025 to match the reference visual.
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const buildMonthTicks = (N) => {
  // 180-day window ending Oct 27, 2025; first day is May 1, 2025 → ticks at month starts
  const end = new Date(2025, 9, 27);
  const start = new Date(end);
  start.setDate(end.getDate() - (N - 1));
  const ticks = [];
  for (let i = 0; i < N; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDate() === 1) ticks.push({ i, label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` });
  }
  return ticks;
};

/* ---------- Carousel preview strip ------------------------------------- */
const CarouselStrip = ({ kinds, size = 60, gap = 6, addMore = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap }}>
    {kinds.map((k, i) => (
      <span key={i} style={{
        position: 'relative',
        width: size, height: size, flexShrink: 0,
        overflow: 'hidden',
        background: '#eee',
        border: '1px solid var(--border-tertiary)',
      }}>
        <Thumb kind={k} />
      </span>
    ))}
    {addMore && (
      <span style={{
        width: size, height: size,
        background: 'var(--brand-50, #f3eef7)',
        border: '1px dashed var(--brand-300, #c5a8da)',
        color: 'var(--brand-700, #6b3a9a)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M7 2v10M2 7h10" />
        </svg>
      </span>
    )}
  </div>
);

/* ---------- CVR chart (hover-aware) ------------------------------------ */
const CvrChart = ({ row }) => {
  const series = React.useMemo(() => buildSeries(row), [row.id]);
  const monthTicks = React.useMemo(() => buildMonthTicks(series.N), [series.N]);
  const [hoverX, setHoverX] = React.useState(null); // 0..1 across the inner chart
  const svgRef = React.useRef(null);

  const W = 760, H = 280;
  const padL = 44, padR = 16, padT = 18, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const yMin = 0.1, yMax = 0.95;
  const x = (i) => padL + (innerW * i) / (series.N - 1);
  const y = (v) => padT + innerH - innerH * ((v - yMin) / (yMax - yMin));
  const yTicks = [0.2, 0.4, 0.6, 0.8];

  const linePath = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const bandPath = () => {
    const top = series.ciHi.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const bot = series.ciLo.map((v, i) => `L ${x(series.N - 1 - i).toFixed(1)} ${y(series.ciLo[series.N - 1 - i]).toFixed(1)}`).join(' ');
    return `${top} ${bot} Z`;
  };

  const shipX = x(series.shipIdx);

  const onMove = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const xPx = ((e.clientX - r.left) / r.width) * W;
    if (xPx < padL || xPx > W - padR) { setHoverX(null); return; }
    setHoverX((xPx - padL) / innerW);
  };
  const onLeave = () => setHoverX(null);

  const hoverIdx = hoverX == null ? null : Math.round(hoverX * (series.N - 1));
  const isPreShip = hoverIdx != null && hoverIdx < series.shipIdx;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%" height="auto"
        style={{ display: 'block', cursor: hoverIdx != null ? 'crosshair' : 'default' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* Y grid + labels */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--border-tertiary)" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-quaternary)">{t.toFixed(1)}</text>
          </g>
        ))}
        <text
          x={12} y={padT + innerH / 2}
          fontSize="11" fontFamily="var(--font-mono)" fill="var(--text-quaternary)"
          textAnchor="middle"
          transform={`rotate(-90 12 ${padT + innerH / 2})`}
        >CVR (fraction)</text>

        {/* Confidence band */}
        <path d={bandPath()} fill="#f9d4d4" opacity="0.55" />
        {/* Category baseline */}
        <path d={linePath(series.baseline)} fill="none" stroke="#16a571" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Product line with dots */}
        <path d={linePath(series.product)} fill="none" stroke="#2c5fe1" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        {series.product.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={1.8} fill="#2c5fe1" />
        ))}

        {/* Ship marker */}
        <line x1={shipX} x2={shipX} y1={padT} y2={padT + innerH} stroke="var(--text-primary)" strokeWidth="1.4" strokeDasharray="5 4" />
        <text x={shipX} y={padT - 6} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-primary)">SHIPPED</text>

        {/* Hover vertical */}
        {hoverIdx != null && (
          <>
            <line
              x1={x(hoverIdx)} x2={x(hoverIdx)}
              y1={padT} y2={padT + innerH}
              stroke={isPreShip ? '#b94747' : '#2c5fe1'}
              strokeWidth="1" strokeDasharray="2 3" opacity="0.8"
            />
            <circle
              cx={x(hoverIdx)} cy={y(series.product[hoverIdx])} r={4}
              fill="#fff" stroke={isPreShip ? '#b94747' : '#2c5fe1'} strokeWidth="1.6"
            />
          </>
        )}

        {/* X-axis month ticks */}
        {monthTicks.map((t, i) => (
          <text key={i} x={x(t.i)} y={H - 10} textAnchor="start" fontSize="11" fontFamily="var(--font-mono)" fill="var(--text-quaternary)">{t.label}</text>
        ))}
      </svg>

      {/* Hover tooltip: pre-ship → "Original carousel", post-ship → "Optimized" */}
      {hoverIdx != null && (
        <div
          style={{
            position: 'absolute',
            left: `${((x(hoverIdx) + 16) / W) * 100}%`,
            top: 8,
            transform: x(hoverIdx) > W * 0.6 ? 'translateX(calc(-100% - 32px))' : 'none',
            background: '#fff',
            border: '1px solid var(--border-secondary)',
            boxShadow: 'var(--shadow-md, 0 4px 14px rgba(0,0,0,0.08))',
            padding: '10px 12px',
            borderRadius: 'var(--radius-xs)',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: 8,
            minWidth: 280,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: isPreShip ? '#b94747' : '#2c5fe1',
              fontWeight: 700,
            }}>
              {isPreShip ? 'Original carousel · pre-ship' : 'Optimized carousel · live'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
              CVR {series.product[hoverIdx].toFixed(2)}
            </span>
          </div>
          <CarouselStrip
            kinds={isPreShip ? row.originalCarousel : row.shippedCarousel}
            size={42}
            gap={4}
            addMore={false}
          />
        </div>
      )}
    </div>
  );
};

/* ---------- Expanded row body ------------------------------------------ */
// Left rail = product context: 2×2 metadata grid on top, shipped carousel
// below it. Right = CVR chart filling the rest. The "+ add more" placeholder
// at the end of the strip is suppressed here — this is a reporting view, not
// an editor.
const ExpandedBody = ({ row }) => (
  <div style={{
    padding: '8px 28px 28px',
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2.2fr)',
    columnGap: 48,
    rowGap: 28,
    background: '#fff',
  }}>
    {/* Left: 2×2 metadata + carousel below */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        rowGap: 10, columnGap: 24,
      }}>
        {[
          { label: 'Category',  value: row.cat },
          { label: 'Retailer',  value: row.retailer },
          { label: 'Shipped',   value: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{row.shipDateLabel} <ScoreBadge value={row.after} /></span> },
          { label: 'Live for',  value: `${row.liveDays} days` },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: 'var(--text-quaternary)',
            }}>{m.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: 'var(--text-quaternary)', marginBottom: 8,
        }}>Carousel</div>
        <CarouselStrip kinds={row.shippedCarousel} size={40} gap={5} addMore={false} />
      </div>
    </div>

    {/* Right: chart */}
    <div><CvrChart row={row} /></div>
  </div>
);

const ScoreBadge = ({ value }) => {
  const t = tierOf(value);
  const bg = t === 'vlow' || t === 'low' ? 'var(--error-50, #fef3f2)'
           : t === 'mod' ? 'var(--warning-50, #fffaeb)'
           : t === 'high' ? '#eef7d6'
           : 'var(--success-50, #ecfdf5)';
  const fg = t === 'vlow' || t === 'low' ? 'var(--error-600)'
           : t === 'mod' ? 'var(--warning-500)'
           : t === 'high' ? 'var(--score-high-600)'
           : 'var(--success-600)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 18, padding: '0 6px',
      borderRadius: 3,
      background: bg, color: fg,
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
    }}>{value}</span>
  );
};

/* ---------- Expand chevron --------------------------------------------- */
const ExpandChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
    <path d="m3 5 4 4 4-4" />
  </svg>
);

/* ---------- Impact table ----------------------------------------------- */
function ImpactTable() {
  const [openId, setOpenId] = useStateIR(ROWS[0].id);
  const gridCols = '2.4fr 1fr 1.6fr 1fr 1fr 1fr';
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-secondary)',
      borderRadius: 'var(--radius-xs)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: 12,
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-secondary)',
        background: 'var(--bg-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-quaternary)',
      }}>
        <span>Product</span>
        <span>Brand</span>
        <span>Score · original → optimized</span>
        <span style={{ textAlign: 'right' }}>Conv. lift</span>
        <span style={{ textAlign: 'right' }}>Weekly revenue</span>
        <span style={{ textAlign: 'right' }}>Total revenue</span>
      </div>

      {ROWS.map((r, i) => {
        const isOpen = openId === r.id;
        const last = i === ROWS.length - 1;
        return (
          <div key={r.id} style={{ borderBottom: last ? 'none' : '1px solid var(--border-tertiary)' }}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : r.id)}
              aria-expanded={isOpen}
              style={{
                display: 'grid',
                gridTemplateColumns: gridCols,
                gap: 12,
                padding: '16px 20px',
                width: '100%',
                alignItems: 'center',
                background: isOpen ? 'var(--bg-secondary)' : 'transparent',
                border: 0,
                outline: 'none',
                boxShadow: 'inset 0 0 0 0 var(--text-primary)',
                font: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.12s, box-shadow 0.12s',
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.boxShadow = 'inset 0 0 0 1.5px var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 0 0 var(--text-primary)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span style={{
                  width: 36, height: 36, flexShrink: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-tertiary)',
                  display: 'inline-grid', placeItems: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-quaternary)',
                  overflow: 'hidden', position: 'relative',
                }}>
                  <Thumb kind={r.shippedCarousel[0]} />
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>{r.sku}</span>
                </div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.brand}</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ScorePill value={r.before} />
                <Arrow />
                <ScorePill value={r.after} />
              </div>
              <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--success-600)', fontSize: 14 }}>{r.bump}</span>
              <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{r.weekly}</span>
              <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                {r.total}
                <span style={{ color: 'var(--text-quaternary)' }}><ExpandChevron open={isOpen} /></span>
              </span>
            </button>

            {isOpen && <ExpandedBody row={r} />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- the page ---------------------------------------------------- */
function ImpactReportingPage({ route, onNavigate }) {
  const neutralValue = { '--smc-value-fg': 'var(--text-primary)' };
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          flex: 1,
          padding: '40px 48px 64px',
          display: 'flex', flexDirection: 'column', gap: 32,
          maxWidth: 1440,
        }}>
          {/* Breadcrumb back to /analytics */}
          {/* Title + filter row — title doubles as the breadcrumb back-link */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              <span>Impact Report</span>
            </h1>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-secondary)', maxWidth: 760 }}>
              The <strong style={{ color: 'var(--text-primary)' }}>combined performance</strong> of products optimized and launched on Vizit. Trailing 12 weeks.
            </p>
          </div>

          <FilterRow />

          {/* Headline KPIs — same trio as on the parent page */}
          <MetricGroup columns={3}>
            <ScoreMetricCell
              label="Overall conversion bump (post-optimization)"
              strength={0} totalStrength={0}
              tier="vhigh"
              value="28%"
              denom="vs last month"
              delta="5"
            />
            <div style={neutralValue}>
              <ScoreMetricCell
                label="Avg. weekly revenue"
                strength={0} totalStrength={0}
                tier="na"
                value="$8K"
                denom="vs last month"
                delta="5"
              />
            </div>
            <div style={neutralValue}>
              <ScoreMetricCell
                label="Projected annual revenue"
                strength={0} totalStrength={0}
                tier="na"
                value="$2M"
                denom="vs last month"
                delta="5"
              />
            </div>
          </MetricGroup>

          {/* Trend chart */}
          <TrendChart />

          {/* Optimized products table */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <h2 style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-xs, 24px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
              }}>
                Optimized & launched
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-quaternary)' }}>
                {ROWS.length} products
              </span>
            </div>
            <ImpactTable />
          </section>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ImpactReportingPage });
