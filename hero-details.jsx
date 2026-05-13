// =========================================================================
// Hero Asset Details page — opens for any asset whose klass === 'Hero Image'
// =========================================================================
// Route: /library/assets/:id (same as regular AssetDetails); the router
// branches based on the asset's class so the Hero variant gets the richer
// audit layout — score breakdown by component, served-resolution pipeline,
// and the per-fragment Text Detection & Readability table (APCA / WCAG /
// Cambridge Blur / NGS1).
//
// This page is content-heavy by design: heroes are the most-scrutinized
// asset class on a PDP, so reviewers expect to see every legibility
// standard at served resolution, not just the aggregate score.

const { useState: useStateHD, useMemo: useMemoHD } = React;

/* ---------- Risk → label ----------------------------------------- */
// Mirror of the regular AssetDetails mapping so a hero with score 71 reads
// as "Moderate" (yellow) and a 86 reads as "Low risk" (green).
const HERO_RISK = {
  vlow:  { label: 'High risk',     cls: 'score-pill--vlow' },
  low:   { label: 'High risk',     cls: 'score-pill--low' },
  mod:   { label: 'Moderate',      cls: 'score-pill--mod' },
  high:  { label: 'Moderate',      cls: 'score-pill--mod' },
  vhigh: { label: 'Conversion ready', cls: 'score-pill--vhigh' },
  na:    { label: 'Not scored',    cls: 'score-pill--na' }
};

const heroTier = (s) =>
  s == null ? 'na' :
  s < 20 ? 'vlow' :
  s < 40 ? 'low' :
  s < 60 ? 'mod' :
  s < 80 ? 'high' : 'vhigh';

/* ---------- Verdict pill (Pass / Marginal / Fail) ---------------- */
const VERDICT = {
  pass:     { label: 'Pass',     cls: 'badge--success', dot: '#17B26A' },
  marginal: { label: 'Marginal', cls: 'badge--warning', dot: '#F79009' },
  fail:     { label: 'Fail',     cls: 'badge--error',   dot: '#F04438' }
};
const VerdictPill = ({ verdict, metric }) => {
  const v = VERDICT[verdict] || VERDICT.fail;
  const [open, setOpen] = React.useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        className={`badge ${v.cls} badge--sm`}
        style={{ gap: 6, cursor: metric ? 'help' : 'default' }}
        tabIndex={metric ? 0 : -1}
        aria-describedby={metric && open ? `tt-${v.label}` : undefined}
      >
        <span className="badge__dot" style={{ background: v.dot }} />
        {v.label}
      </span>
      {metric && open && (
        <span
          id={`tt-${v.label}`}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 10px',
            background: '#1D2939',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {metric}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1D2939',
            }}
          />
        </span>
      )}
    </span>
  );
};

/* ---------- Section heading (small caps) ------------------------- */
const SectionLabel = ({ children, right }) =>
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    padding: '0 16px', height: 36, borderBottom: '1px solid var(--border-tertiary)',
    background: '#fff'
  }}>
    <span className="t-xs-semibold text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>
      {children}
    </span>
    {right && <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>{right}</span>}
  </div>;

/* ---------- Component score row (HIGH / MED / LOW) -------------- */
// Used by the Score Breakdown panel for Retail Readiness / Visual Impact /
// Distinctiveness — three top-level components rendered with an icon swatch,
// title, description, and a tier-flagged bar underneath.
// Crisp stroked SVGs render far cleaner at 18px than unicode glyphs in a
// monospace font — the original ✓/!/× looked off-balance and pixel-soft
// against the colored chip backgrounds.
const COMPONENT_ICON = {
  pass: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3.5v5" /><circle cx="8" cy="11.75" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  fail: (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4.5 4.5 7 7m0-7-7 7" />
    </svg>
  ),
};
const COMPONENT_SWATCH = {
  pass: { bg: 'var(--success-100, #DCFAE6)', border: '#17B26A' },
  warn: { bg: 'var(--warning-100, #FEF0C7)', border: '#F79009' },
  fail: { bg: 'var(--error-100, #FEE4E2)',   border: '#F04438' },
};
const ComponentRow = ({ status, name, desc, tierLabel, tierCls }) => {
  const sw = COMPONENT_SWATCH[status] || COMPONENT_SWATCH.warn;
  const icon = COMPONENT_ICON[status] || COMPONENT_ICON.warn;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderBottom: '1px solid var(--border-tertiary)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 18, height: 18, flexShrink: 0,
          background: sw.bg, border: `1px solid ${sw.border}`,
          color: sw.border,
          display: 'grid', placeItems: 'center', marginTop: 1
        }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{desc}</div>
        </div>
      </div>
      <div className={`score-bar ${tierCls}`} style={{ background: 'var(--bg-secondary)', padding: '0 8px' }}>
        <div className="score-bar__track">
          <div className="score-bar__fill" style={{ width: tierLabel === 'HIGH' ? '82%' : tierLabel === 'MED' ? '54%' : '24%' }} />
        </div>
        <span className="score-bar__label" style={{ minWidth: 36, textAlign: 'right', fontWeight: 600, color: tierCls.includes('vhigh') ? 'var(--success-700)' : tierCls.includes('mod') ? 'var(--warning-700)' : 'var(--error-700)' }}>
          {tierLabel}
        </span>
      </div>
    </div>
  );
};

/* ---------- Sub-component bar (Mobile-readiness sub-rows) -------- */
const SubBar = ({ name, value, tier }) => {
  const tierCls = `score-bar--${tier}`;
  const labelText = tier === 'vhigh' || tier === 'high' ? 'HIGH' : tier === 'mod' ? 'MED' : 'LOW';
  const labelColor = tier === 'vhigh' || tier === 'high' ? 'var(--success-700)' : tier === 'mod' ? 'var(--warning-700)' : 'var(--error-700)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border-tertiary)' }}>
      <div style={{ minWidth: 110, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{name}</div>
      <div className={`score-bar ${tierCls}`} style={{ flex: 1, background: 'transparent', padding: 0, height: 'auto' }}>
        <div className="score-bar__track" style={{ height: 6 }}>
          <div className="score-bar__fill" style={{ width: `${value}%` }} />
        </div>
      </div>
      <div style={{ minWidth: 38, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: labelColor, letterSpacing: '.04em' }}>{labelText}</span>
      </div>
    </div>
  );
};

Object.assign(window, { HERO_RISK, heroTier, VerdictPill, SectionLabel, ComponentRow, SubBar });
