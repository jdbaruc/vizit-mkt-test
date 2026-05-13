// =========================================================================
// Asset Details page — opens when a tile in the Library Assets tab is clicked
// =========================================================================
// Route: /library/assets/:id
// Layout:
//   - Top bar: breadcrumb (collection → file)
//   - Header strip: score tile, meta fields, right-side tabs
//   - Left: large preview on a dotted canvas, with overlay for analysis variant
//   - Right: stack of analysis cards (list, click to change the left preview)

const { useState: useStateAD, useMemo: useMemoAD, useRef: useRefAD } = React;

// Ordered list of analysis variants shown in the right panel. Each one
// changes which overlay is composited on top of the preview.
const ANALYSIS_VARIANTS = [
{ k: 'original', label: 'Original image', desc: 'The original image without any overlays applied.' },
{ k: 'attention', label: 'Attention map', desc: 'Attention maps reveal what viewers will notice most and least in your content.' },
{ k: 'gaze', label: 'Gaze sequence', desc: 'Gaze sequences reveal where a viewer\u2019s gaze is directed when looking at your content.' },
{ k: 'focal', label: 'Focal points', desc: 'Focal points determine which content elements have the highest probability of standing out.' },
{ k: 'drivers', label: 'Visual appeal drivers', desc: 'Visual appeal drivers show which elements are most appealing to your audience.' },
{ k: 'detractors', label: 'Visual appeal detractors', desc: 'Visual appeal detractors show which elements are least appealing to your audience.' }];


// Risk label + pill style per tier. Tiers come from scoreTier (data.jsx):
//   <20 vlow, <40 low, <60 mod, <80 high, >=80 vhigh.
// Reference screenshot shows 69 = "Moderate risk" (yellow), so 60–79 maps
// to moderate and only 80+ reads as low-risk / green.
const RISK_LABELS = {
  vlow: { label: 'High risk', cls: 'score-pill--vlow' },
  low: { label: 'High risk', cls: 'score-pill--low' },
  mod: { label: 'Moderate risk', cls: 'score-pill--mod' },
  high: { label: 'Moderate risk', cls: 'score-pill--mod' },
  vhigh: { label: 'Low risk', cls: 'score-pill--vhigh' },
  na: { label: 'Unscored', cls: 'score-pill--na' }
};

// Overlay layer rendered on top of whatever image is behind it. Positioned
// absolute so it can composite with the asset's CSS-painted thumbnail.
const AnalysisOverlay = ({ kind }) => {
  if (kind === 'attention') return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 34%, rgba(239,68,68,0.55) 0%, rgba(251,191,36,0.45) 18%, rgba(34,197,94,0.4) 34%, rgba(59,130,246,0.4) 58%, rgba(29,78,216,0.25) 100%)', mixBlendMode: 'screen', pointerEvents: 'none' }} />);

  if (kind === 'gaze') return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {[[120, 120], [230, 115], [210, 200], [170, 280], [280, 260]].map(([x, y], i, arr) =>
      <g key={i}>
          {i > 0 && <line x1={arr[i - 1][0]} y1={arr[i - 1][1]} x2={x} y2={y} stroke="#fff" strokeWidth="2" strokeDasharray="4 4" opacity=".85" />}
          <circle cx={x} cy={y} r="18" fill="rgba(0,0,0,0.6)" stroke="#fff" strokeWidth="2" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">{i + 1}</text>
        </g>
      )}
    </svg>);

  if (kind === 'focal') return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: '44%', top: '28%', width: '14%', aspectRatio: '1', border: '3px solid #22c55e', boxShadow: '0 0 0 6px rgba(34,197,94,0.22)' }} />
      <div style={{ position: 'absolute', left: '30%', top: '54%', width: '18%', aspectRatio: '1', border: '3px solid #22c55e', boxShadow: '0 0 0 6px rgba(34,197,94,0.22)' }} />
    </div>);

  if (kind === 'drivers') return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 55% 55%, rgba(16,185,129,0.55) 0%, rgba(16,185,129,0) 45%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />);

  if (kind === 'detractors') return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 78%, rgba(244,63,94,0.55) 0%, rgba(244,63,94,0) 40%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />);

  return null;
};

// Square preview of the asset with an optional analysis overlay. Uses the
// same CSS-painted AssetThumb from the Library so detail view matches tile.
const AssetPreview = ({ thumbKind, overlay }) =>
<div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: '#fff' }}>
    {typeof AssetThumb !== 'undefined' && <AssetThumb kind={thumbKind} />}
    <AnalysisOverlay kind={overlay} />
  </div>;


// Small preview used in each right-panel card — same thumb, scaled down.
const AnalysisThumb = ({ thumbKind, overlay }) =>
<div style={{ width: 74, height: 74, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border-tertiary)', position: 'relative' }}>
    <AssetPreview thumbKind={thumbKind} overlay={overlay} />
  </div>;


/* ---------- Top breadcrumb bar ------------------------------------ */
// Reflects the user's nav path: Library › Assets › <file>. They reached
// this page by clicking a tile in the Library / Assets tab.
const DetailsCrumbs = ({ onNavigate, fileName }) =>
<div style={{
  display: 'flex', alignItems: 'center', gap: 4,
  height: 48, padding: '0 20px',
  borderBottom: '1px solid var(--border-secondary)'
}}>
    <button
      type="button"
      className="breadcrumb-btn"
      onClick={() => onNavigate && onNavigate('/library')}
      onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
      <span className="breadcrumb-btn__icon">{Icons.Folder}</span>
      <span className="breadcrumb-btn__label">Library</span>
      <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
    </button>
    <button
      type="button"
      className="breadcrumb-btn"
      onClick={() => onNavigate && onNavigate('/library/assets')}
      onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
      <span className="breadcrumb-btn__label">Assets</span>
      <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
    </button>
    <button
      type="button"
      className="breadcrumb-btn breadcrumb-btn--active"
      onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
      <span className="breadcrumb-btn__label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{fileName}</span>
    </button>
  </div>;


/* ---------- Header strip (score + meta) --------------------------- */
// Tabs have moved into the right sidebar; header now carries just the
// score tile and meta fields.

// Editable Class field — shows the value with a small pencil affordance
// that opens ClassPicker. Manages popover state and an "overridden" badge.
const ClassMetaField = ({ value, autoValue, onChange, onReset }) => {
  const [open, setOpen] = useStateAD(false);
  const anchorRef = useRefAD(null);
  const isOverridden = autoValue && value !== autoValue;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 110, position: 'relative' }} ref={anchorRef}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>Class</div>
        {isOverridden && (
          <span
            title={`Auto-detected was ${autoValue}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9, letterSpacing: '.04em', textTransform: 'uppercase',
              color: 'var(--brand-700, #6941C6)',
              padding: '0 4px', height: 13, lineHeight: '13px',
              background: 'var(--brand-50, #F4EBFF)',
              border: '1px solid var(--brand-200, #E9D7FE)',
            }}
          >
            manual
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Override class"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 0, padding: 0, cursor: 'pointer',
          font: 'inherit', textAlign: 'left',
          color: 'var(--text-primary)',
          maxWidth: '100%',
        }}
        onMouseEnter={(e) => {
          const pencil = e.currentTarget.querySelector('[data-pencil]');
          if (pencil) pencil.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const pencil = e.currentTarget.querySelector('[data-pencil]');
          if (pencil) pencil.style.opacity = open ? '1' : '0.55';
        }}
      >
        <span style={{
          fontSize: 13, color: 'var(--text-primary)', fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          borderBottom: '1px dashed var(--border-secondary)',
        }}>
          {value}
        </span>
        <span data-pencil style={{
          display: 'inline-grid', placeItems: 'center',
          width: 18, height: 18,
          color: 'var(--text-tertiary)',
          opacity: open ? 1 : 0.55,
          transition: 'opacity 0.12s, background 0.12s',
          background: open ? 'var(--bg-secondary)' : 'transparent',
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 2 10 3.5 4 9.5 2 10l.5-2L8.5 2Z"/>
          </svg>
        </span>
      </button>
      {open && (
        <ClassPicker
          anchorRef={anchorRef}
          value={value}
          autoValue={autoValue}
          onPick={(v) => { onChange(v); setOpen(false); }}
          onReset={() => { onReset(); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

const DetailsHeader = ({ score, meta, klass, autoKlass, onKlassChange, onKlassReset }) => {
  const tier = scoreTier(score);
  const risk = RISK_LABELS[tier];
  // Colour the score chip to match its tier (same palette as score-pill).
  // Score-chip colour per tier. 60–79 stays in the yellow/moderate band to
  // align with the risk label above.
  const tierChip = {
    vlow: { bg: 'var(--error-100, #FEE4E2)', border: 'var(--error-300, #FDA29B)' },
    low: { bg: 'var(--warning-100, #FEF0C7)', border: 'var(--warning-300, #FEC84B)' },
    mod: { bg: 'var(--yellow-100, #FEF6C8)', border: 'var(--yellow-300, #FDE272)' },
    high: { bg: 'var(--yellow-100, #FEF6C8)', border: 'var(--yellow-300, #FDE272)' },
    vhigh: { bg: '#DCFAE6', border: '#47CD89' },
    na: { bg: 'var(--bg-secondary)', border: 'var(--border-secondary)' }
  }[tier] || { bg: 'var(--bg-secondary)', border: 'var(--border-secondary)' };
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '14px 24px',
      borderBottom: '1px solid var(--border-tertiary)',
      flexWrap: 'wrap', width: '100%',
      background: '#fff', flexShrink: 0
    }}>
      {/* Score tile */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 12px',
        border: '1px solid var(--border-tertiary)',
        background: '#fff'
      }}>
        <div style={{
          width: 46, height: 46,
          background: tierChip.bg,
          border: '1px solid ' + tierChip.border,
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600,
          color: 'var(--text-primary)'
        }}>{score}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>Vizit score</span>
            <span className={`score-pill score-pill--sm ${risk.cls}`}>
              <span className="score-pill__inner">{risk.label}</span>
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            This image scores higher than <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{score}% of images</strong> in the category
          </div>
        </div>
      </div>

      {/* Meta fields */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, minWidth: 0, flexWrap: 'wrap' }}>
        {meta.map((m) => {
          if (m.label === 'Class') {
            return (
              <ClassMetaField
                key={m.label}
                value={klass}
                autoValue={autoKlass}
                onChange={onKlassChange}
                onReset={onKlassReset}
              />
            );
          }
          return (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 110 }}>
              <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>{m.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</div>
            </div>
          );
        })}
      </div>
    </div>);

};

// Inline SVGs for the three details tabs (eye / sparkle / image frame).
const DetailsTabIcon = ({ kind }) => {
  const stroke = 'currentColor';
  if (kind === 'eye') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.4">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>);

  if (kind === 'sparkle') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.4">
      <path d="M8 1.5 9.3 6l4.5 1.3L9.3 8.7 8 13.2 6.7 8.7 2.2 7.3 6.7 6Z" />
      <path d="M13 2.5v2M12 3.5h2M3 12v1.6M2.2 12.8h1.6" />
    </svg>);

  if (kind === 'image') return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.4">
      <rect x="2" y="3" width="12" height="10" />
      <circle cx="6" cy="7" r="1" />
      <path d="m2 11 3-3 3 3 2-2 4 4" />
    </svg>);

  return null;
};

/* ---------- Right panel (Analysis list) --------------------------- */
const AnalysisList = ({ thumbKind, active, onSelect }) =>
<div style={{ display: 'flex', flexDirection: 'column' }}>
    {ANALYSIS_VARIANTS.map((v) => {
    const isActive = v.k === active;
    return (
      <button key={v.k} onClick={() => onSelect(v.k)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: 14,
        background: isActive ? 'var(--bg-secondary)' : '#fff',
        border: 'none',
        borderBottom: '1px solid var(--border-tertiary)',
        cursor: 'pointer', textAlign: 'left',
        font: 'inherit'
      }}>
          <AnalysisThumb thumbKind={thumbKind} overlay={v.k} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{v.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{v.desc}</div>
          </div>
        </button>);

  })}
  </div>;


/* ---------- Main page --------------------------------------------- */
function AssetDetailsPage({ route, onNavigate }) {
  // Parse asset id from /library/assets/:id
  const id = (route || '').split('/library/assets/')[1] || '';
  const tiles = typeof ASSET_TILES !== 'undefined' ? ASSET_TILES : [];
  const tile = tiles.find((a) => a.id === id) || tiles[0] || {};

  const asset = {
    id: tile.id || id,
    file: tile.file || (tile.id ? `${tile.id}.jpg` : 'asset.jpg'),
    collection: tile.collection || 'Library',
    score: tile.score != null ? tile.score : 69,
    type: tile.type || 'Carousel',
    klass: tile.klass || 'Asset',
    category: tile.category || '—',
    thumb: tile.thumb
  };

  const [variant, setVariant] = useStateAD('original');
  const [tab, setTab] = useStateAD('analysis');
  // Class override — null means "use auto-detected (asset.klass)".
  const [klassOverride, setKlassOverride] = useStateAD(null);
  const effectiveKlass = klassOverride || asset.klass;

  const activeLabel = useMemoAD(
    () => ANALYSIS_VARIANTS.find((v) => v.k === variant)?.label || 'Original image',
    [variant]
  );

  return (
    <div style={{ display: 'flex', background: '#fff', minHeight: '100vh' }}>
      <LeftRail route={route} onNavigate={onNavigate} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DetailsCrumbs
          onNavigate={onNavigate}
          fileName={asset.file} />

        {/* Body: two columns. Header (score + meta) lives only in the left
            column so the right sidebar runs full height under the crumbs. */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 420px',
          minHeight: 0
        }}>
          {/* Left — score header + dotted canvas + preview, stacked vertically */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            borderRight: '1px solid var(--border-tertiary)',
            minHeight: 0
          }}>
            <DetailsHeader
              score={asset.score}
              klass={effectiveKlass}
              autoKlass={asset.klass}
              onKlassChange={(v) => setKlassOverride(v === asset.klass ? null : v)}
              onKlassReset={() => setKlassOverride(null)}
              meta={[
              { label: 'Type', value: asset.type },
              { label: 'Class', value: effectiveKlass },
              { label: 'Category', value: asset.category }]
              } />
            <div style={{
              flex: 1,
              position: 'relative',
              padding: 32,
              background: '#fff',
              backgroundImage: 'radial-gradient(var(--border-tertiary) 1px, transparent 1px)',
              backgroundSize: '14px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
              overflow: 'auto',
              minHeight: 0
            }}>
            <div style={{
              padding: '8px 16px',
              background: '#fff',
              border: '1px solid var(--border-secondary)',
              boxShadow: 'var(--shadow-xs)',
              fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
              minWidth: 260, textAlign: 'center'
            }}>{activeLabel}</div>
            <div style={{ width: '100%', maxWidth: 560 }}>
              <AssetPreview thumbKind={asset.thumb} overlay={variant} />
            </div>
          </div>
          </div>

          {/* Right — sidebar with tabs at top */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', minHeight: 0 }}>
            {/* Tab bar — uses the design-system `tabs--button` segmented variant. */}
            <div style={{
              padding: 12,
              borderBottom: '1px solid var(--border-secondary)',
              background: '#fff',
              flexShrink: 0
            }}>
              <div className="tabs tabs--button tabs--block">
                {[
                { k: 'analysis', label: 'Analysis', iconKind: 'eye' },
                { k: 'spark-ideas', label: 'Spark ideas', iconKind: 'sparkle' },
                { k: 'spark-images', label: 'Spark images', iconKind: 'image' }].
                map((t) => (
                  <button key={t.k}
                    className="tab"
                    aria-selected={tab === t.k}
                    onClick={() => setTab(t.k)}>
                    <DetailsTabIcon kind={t.iconKind} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab body */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              {tab === 'analysis' &&
              <AnalysisList thumbKind={asset.thumb} active={variant} onSelect={setVariant} />
              }
              {tab === 'spark-ideas' &&
              <div style={{ padding: 40, color: 'var(--text-quaternary)', fontSize: 13, textAlign: 'center' }}>Spark ideas — coming soon.</div>
              }
              {tab === 'spark-images' &&
              <div style={{ padding: 40, color: 'var(--text-quaternary)', fontSize: 13, textAlign: 'center' }}>Spark images — coming soon.</div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>);

}

Object.assign(window, { AssetDetailsPage });