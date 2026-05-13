// =========================================================================
// Product Page — detail view for a single retailer product page
// =========================================================================
// Reached from the Library › Product Pages tab → row click. Composes:
//   - Crumb / header strip with product title, retailer, ASIN, brand, category
//   - Product page performance: 6 score-metric-cells side by side
//   - Optimization plan: 3 step-cards with chevron separators
//   - Your hero + carousel: AssetTile grid (current state)
//   - Optimal asset mix: AssetTile grid (target/recommended)
//   - Extra asset types: AssetTile grid (overflow/non-standard)

const { useState: useStatePP, useMemo: useMemoPP } = React;

/* ---------- Strength bolts (3 of 4 etc) -------------------------- */
const Bolt = ({ on }) => (
  <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M5.5 0L0 6.5h3L2 11l5.5-6.5h-3L5.5 0Z" fill="currentColor" />
  </svg>
);
const StrengthBolts = ({ value = 0, total = 4 }) => (
  <span className="score-metric-cell__bolts" aria-label={`Strength ${value} of ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} className={'score-metric-cell__bolt' + (i < value ? ' is-on' : '')}>
        <Bolt />
      </span>
    ))}
  </span>
);

/* ---------- Score Metric Cell ----------------------------------- */
// Single tile composing label + bolts + value + denom/delta. Uses the
// `score-metric-cell` CSS classes from components.css.
const ScoreMetricCell = ({
  label, info = true, tooltip, strength = 0, totalStrength = 4,
  tier = 'na', value, denom, delta,
  state = 'default', // 'default' | 'hover' | 'disabled'
  size = 'md',
  valueSize = 'lg', // 'lg' (36px, short numeric) | 'md' (24px, short text)
}) => {
  const stateCls =
    state === 'hover' ? ' is-hover' :
    state === 'disabled' ? ' is-disabled' : '';
  const sizeCls = size === 'sm' ? ' score-metric-cell--sm' : ' score-metric-cell--md';
  const valueCls = valueSize === 'md' ? ' score-metric-cell__value--md' : ' score-metric-cell__value--lg';
  return (
    <div className={`score-metric-cell score-metric-cell--${tier}${stateCls}${sizeCls}`}>
      <div className="score-metric-cell__head">
        <span className="score-metric-cell__label">
          {label}
          {info && (
            <span
              className={`score-metric-cell__label-info${tooltip ? ' has-tooltip' : ''}`}
              tabIndex={tooltip ? 0 : -1}
              aria-label={tooltip ? 'More info' : undefined}
              aria-hidden={tooltip ? undefined : true}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
                <path d="M6 5.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              {tooltip && (
                <span className="insight-tooltip" role="tooltip">
                  <span className="insight-tooltip__head">
                    <span className="insight-tooltip__icon" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 1.5v1M2.5 4 3.4 4.9M13.5 4l-.9.9M1.5 9h1M13.5 9h1M6 13h4M6.5 11h3" />
                        <path d="M5 9a3 3 0 1 1 6 0c0 1-.5 1.5-1 2H6c-.5-.5-1-1-1-2Z" />
                      </svg>
                    </span>
                    <span className="insight-tooltip__title">Insights</span>
                  </span>
                  <span className="insight-tooltip__body">{tooltip}</span>
                </span>
              )}
            </span>
          )}
        </span>
        {totalStrength > 0 && <StrengthBolts value={strength} total={totalStrength} />}
      </div>
      <div className="score-metric-cell__spacer" />
      <div className="score-metric-cell__value-row">
        <span className={`score-metric-cell__value${valueCls}`}>{value}</span>
        {delta != null && (
          <span className="score-metric-cell__delta">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 1.5v6m0-6L2 4m2.5-2.5L7 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {delta}
          </span>
        )}
      </div>
      {denom && <div className="score-metric-cell__denom">{denom}</div>}
    </div>
  );
};

/* ---------- Step Card -------------------------------------------- */
const StepCard = ({ index, title, subtitle, state = 'default' }) => {
  const stateCls =
    state === 'hover' ? ' is-hover' :
    state === 'disabled' ? ' is-disabled' : '';
  return (
    <div className={`step-card${stateCls}`}>
      <div className="step-card__badge">{index}</div>
      <div className="step-card__body">
        <div className="step-card__title">{title}</div>
        <div className="step-card__subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

/* ---------- Top crumb / chrome ---------------------------------- */
const ProductCrumbs = ({ onNavigate, assetsOpen, onToggleAssets }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    height: 44, padding: '0 16px',
    borderBottom: '1px solid var(--border-secondary)',
    background: 'var(--bg-primary)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button
        type="button"
        className="breadcrumb-btn"
        onClick={() => onNavigate && onNavigate('/library/product-pages')}
        aria-label="Back to product pages"
        onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
        onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}
      >
        <span className="breadcrumb-btn__icon">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="10" rx="1"/>
            <path d="M6 3v10"/>
          </svg>
        </span>
        <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
      </button>
      <button
        type="button"
        className="breadcrumb-btn breadcrumb-btn--active"
        onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
        onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}
      >
        <span className="breadcrumb-btn__label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>
          L'Oreal Paris Makeup Infallible Up to 32 Hour Fresh Wear Li…
        </span>
      </button>
    </div>
    <div style={{ flex: 1 }} />
    <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 1v7M8 8 5.5 5.5M8 8l2.5-2.5M2 11v3h12v-3"/>
      </svg>
      Show original
    </button>
    <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
      <span style={{
        display: 'inline-grid', placeItems: 'center',
        width: 16, height: 16, borderRadius: '50%',
        background: '#000', color: '#fff', fontSize: 9, fontWeight: 700,
      }}>a</span>
      Open live listing
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 3h7v7M13 3 6 10M3 6v7h7"/>
      </svg>
    </button>
    <button
      type="button"
      className="btn btn--ghost btn--sm"
      onClick={onToggleAssets}
      aria-pressed={!!assetsOpen}
      aria-label={assetsOpen ? 'Collapse assets sidebar' : 'Open assets sidebar'}
      title={assetsOpen ? 'Collapse assets' : 'Open assets'}
      style={{
        gap: 6,
        color: assetsOpen ? 'var(--text-primary)' : 'var(--text-tertiary)',
        background: assetsOpen ? 'var(--bg-secondary)' : undefined,
      }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        {assetsOpen
          ? <path d="m4 3 5 5-5 5M9 3l5 5-5 5" />
          : <path d="M9 3 4 8l5 5M14 3l-5 5 5 5" />}
      </svg>
      {!assetsOpen && <span>Assets</span>}
    </button>
  </div>
);

/* ---------- Product Header (thumb + title + meta) --------------- */
const ProductHeader = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '72px 1fr auto',
    alignItems: 'flex-start', gap: 20,
    padding: '18px 24px',
    borderBottom: '1px solid var(--border-tertiary)',
    background: 'var(--bg-primary)',
  }}>
    {/* Product thumb */}
    <div style={{
      width: 64, height: 64, position: 'relative', overflow: 'hidden',
      background: '#fff', border: '1px solid var(--border-tertiary)',
    }}>
      <img
        src="assets/fruity-pebbles-hero.jpeg"
        alt="Fruity Pebbles cereal box"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>

    {/* Title block */}
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, letterSpacing: '-0.005em' }}>
        Post Fruity Pebbles Gluten Free Breakfast Cereal, Sweetened Rice Cereal with Fruity Flavor, 11 OZ Box
      </div>
    </div>

    {/* Meta cluster */}
    <div style={{ display: 'flex', gap: 32, paddingTop: 4 }}>
      {[
        { label: 'Retailer', value: 'Amazon US' },
        { label: 'ASIN',     value: 'B00DPZTJUI', mono: true },
        { label: 'Brand',    value: 'Post' },
        { label: 'Category', value: 'Tabletop Synthesizers' },
      ].map(m => (
        <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 80 }}>
          <span style={{
            fontSize: 11, color: 'var(--text-quaternary)',
            letterSpacing: '0.04em',
          }}>{m.label}</span>
          <span style={{
            fontSize: 13, color: 'var(--text-primary)', fontWeight: 500,
            fontFamily: m.mono ? 'var(--font-mono)' : 'var(--font-sans)',
            whiteSpace: 'nowrap',
          }}>{m.value}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Performance metrics row ----------------------------- */
const PerformanceMetrics = () => (
  <div style={{
    padding: '20px 24px 12px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-tertiary)',
  }}>
    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 22, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.005em' }}>
      Product page performance
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gap: 0,
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-tertiary)',
    }}>
      {/* Product page score — Score sticker (large) from the design system */}
      <div style={{ borderRight: '1px solid var(--border-tertiary)', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="score-metric-cell__label" style={{ fontSize: 12 }}>
            Product page score
            <span className="score-metric-cell__label-info" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
                <path d="M6 5.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
          </span>
          <div className="score-sticker score-sticker--lg score-sticker--vlow" aria-label="Product page score 23, up 11">
            <span className="score-sticker__num">23</span>
            <span className="score-sticker__delta">
              <svg viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              11
            </span>
          </div>
        </div>
      </div>
      <div style={{ borderRight: '1px solid var(--border-tertiary)' }}>
        <ScoreMetricCell
          label="Carousel asset score"
          strength={4} totalStrength={4}
          tier="mod"
          value="46"
          denom="/100"
        />
      </div>
      <div style={{ borderRight: '1px solid var(--border-tertiary)' }}>
        <ScoreMetricCell
          label="Hero asset score"
          strength={3} totalStrength={4}
          tier="vlow"
          value="32"
          denom="/100"
          delta="↑ 5"
        />
      </div>
      <div style={{ borderRight: '1px solid var(--border-tertiary)' }}>
        <ScoreMetricCell
          label="Asset mix"
          strength={3} totalStrength={4}
          tier="mod"
          value="2 missing"
          denom="of 7 required types"
          valueSize="md"
        />
      </div>
      <div style={{ borderRight: '1px solid var(--border-tertiary)' }}>
        <ScoreMetricCell
          label="Asset count"
          strength={2} totalStrength={4}
          tier="vhigh"
          value="8"
          denom="// 7 is ideal"
        />
      </div>
      <div>
        <ScoreMetricCell
          label="Asset order"
          strength={1} totalStrength={4}
          tier="mod"
          value="!"
          denom="Sort high to low"
          valueSize="md"
        />
      </div>
    </div>
  </div>
);

/* ---------- Optimization plan ----------------------------------- */
const StepChevron = () => (
  <div style={{ display: 'grid', placeItems: 'center', color: 'var(--text-quaternary)', flexShrink: 0 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m6 3 5 5-5 5" />
    </svg>
  </div>
);

const OptimizationPlan = () => (
  <div style={{
    padding: '20px 24px 24px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-tertiary)',
  }}>
    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 22, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.005em' }}>
      Optimization Plan
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 24px 1fr 24px 1fr',
      alignItems: 'center', gap: 0,
    }}>
      <StepCard index="1" title="Increase carousel asset scores" subtitle="Click an asset to Spark ideas and images" state="hover" />
      <StepChevron />
      <StepCard index="2" title="Improve hero image score" subtitle="Click hero asset to see strengths and weaknesses" state="hover" />
      <StepChevron />
      <StepCard index="3" title="Achieve an optimal asset mix" subtitle="Match all recommended types" state="hover" />
    </div>
  </div>
);

/* ---------- Asset thumb painters (CSS placeholders) ------------- */
const PA = {
  hero: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <img
        src="assets/fruity-pebbles-hero.jpeg"
        alt="Fruity Pebbles cereal box"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  ),
  feature: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <div style={{ position: 'absolute', left: '8%', top: '14%', width: '40%', height: '72%',
        background: 'linear-gradient(180deg, #d8a37b 0%, #b67c50 60%, #5b3722 100%)' }} />
      <div style={{ position: 'absolute', left: '8%', top: '14%', width: '40%', height: '14%',
        background: 'linear-gradient(90deg, #b91d6a 0%, #ec4899 100%)' }} />
      <div style={{ position: 'absolute', left: '54%', top: '20%', right: '6%', display: 'grid', gap: 4, fontSize: 7, color: '#222', lineHeight: 1.3, fontWeight: 700 }}>
        <div>✓ UP TO 32H WEAR</div>
        <div>✓ BUILDABLE COVERAGE</div>
        <div>✓ LIGHTWEIGHT, BREATHABLE</div>
        <div>✓ NATURAL FINISH</div>
      </div>
    </div>
  ),
  benefit1: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #efe1d4 0%, #c8a98c 100%)' }}>
      <div style={{ position: 'absolute', left: '14%', top: '14%', right: '14%', height: '12%',
        background: '#fff', display: 'grid', placeItems: 'center', fontSize: 6, fontWeight: 800, color: '#5d2a64' }}>
        DERMATOLOGISCHE KONTROLLE
      </div>
      <div style={{ position: 'absolute', left: '24%', top: '36%', width: '48%', height: '54%',
        background: 'radial-gradient(ellipse at 50% 30%, #f4d0c0 0%, #b97a5e 80%)' }} />
    </div>
  ),
  benefit2: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f4d0c5 0%, #c08475 60%, #5e2c2c 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '24%', width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, #f0c8b6 0%, #8d4f3f 80%)' }} />
    </div>
  ),
  beforeAfter: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f4d6c8', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: 'linear-gradient(180deg, #c89580 0%, #6e3a2c 100%)' }} />
      <div style={{ background: 'linear-gradient(180deg, #f1c5ad 0%, #b3735c 100%)' }} />
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#fff' }} />
    </div>
  ),
  swatch: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
      <div style={{ position: 'absolute', left: '6%', top: '8%', right: '6%', height: '18%',
        background: 'linear-gradient(90deg, #b91d6a 0%, #ec4899 100%)', display: 'grid', placeItems: 'center',
        color: '#fff', fontSize: 7, fontWeight: 800 }}>INFALLIBLE</div>
      <div style={{ position: 'absolute', left: '6%', top: '32%', right: '6%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
        {['#f5d8b0','#ecbf90','#dba374','#c98a5b','#b06d44',
          '#985a36','#7d4626','#623416','#46220a','#2a1505',
          '#f5d8b0','#ecbf90','#dba374','#c98a5b','#b06d44'].map((c, i) => (
          <div key={i} style={{ paddingBottom: '100%', background: c, borderRadius: '50%' }} />
        ))}
      </div>
    </div>
  ),
  benefit3: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #efe1d4 0%, #b8967e 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 45%, #f4d0c0 0%, #8b5d44 70%)' }} />
      <div style={{ position: 'absolute', left: '8%', bottom: '8%', right: '8%', fontSize: 7, color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>
        12H FRESH WEAR<br/>LANGANHALTENDE<br/>FOUNDATION
      </div>
    </div>
  ),
  inUse: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f7e7d8 0%, #c89e80 60%, #5b3024 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '18%', width: '60%', height: '64%',
        background: 'radial-gradient(ellipse at 40% 30%, #f1c8af 0%, #8d4e35 80%)' }} />
      <div style={{ position: 'absolute', right: '8%', top: '14%', fontSize: 8, color: '#fff', fontWeight: 800 }}>24H LANGER HALT</div>
    </div>
  ),
  sizeScale: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f1ddc7 0%, #d6b08c 100%)' }}>
      <div style={{ position: 'absolute', left: '20%', top: '16%', width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, #fff 0%, #c89a78 80%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: '36%', top: '34%', width: '28%', height: '28%',
        background: 'linear-gradient(180deg, #d8a37b 0%, #5b3722 100%)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: '8%', bottom: '10%', right: '8%', fontSize: 6, color: '#3a2615', fontWeight: 800 }}>REPETETIVES BEDÜRFNIS</div>
    </div>
  ),
  empty: () => (
    <div style={{ position: 'absolute', inset: 0, background: '#f8f6f3' }}>
      <svg width="100%" height="100%" viewBox="0 0 80 80" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="80" y2="80" stroke="#d8d3cb" strokeWidth="1" />
        <line x1="80" y1="0" x2="0" y2="80" stroke="#d8d3cb" strokeWidth="1" />
        <rect x="0.5" y="0.5" width="79" height="79" fill="none" stroke="#d8d3cb" strokeWidth="1" />
      </svg>
    </div>
  ),
};
const PAThumb = ({ kind }) => {
  const T = PA[kind] || PA.empty;
  return <T />;
};

/* ---------- Asset row -------------------------------------------- */
// Re-uses the styles from AssetTile but tightened for inline product-page
// rows: title above thumb, score-bar below. We render directly here so we
// can also show the small "Informational" sub-label and the column ordering
// from the screenshot.

const ProductAssetTile = ({ asset, onNavigate }) => {
  const tier = (typeof scoreTier === 'function') ? scoreTier(asset.score) : 'mod';
  const isHero = asset.thumb === 'hero';
  const handleOpen = () => {
    if (asset.empty) return;
    if (isHero && onNavigate) onNavigate(`/library/assets/${asset.heroId || 'at01'}`);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {asset.label}
      </div>
      <div
        onClick={handleOpen}
        role={isHero && !asset.empty ? 'button' : undefined}
        tabIndex={isHero && !asset.empty ? 0 : undefined}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && isHero && !asset.empty) { e.preventDefault(); handleOpen(); } }}
        style={{
          position: 'relative', aspectRatio: '1 / 1',
          background: 'var(--bg-secondary)',
          border: asset.empty ? '1px dashed var(--border-secondary)' : '1px solid var(--border-tertiary)',
          overflow: 'hidden',
          cursor: asset.empty ? 'default' : 'pointer',
        }}
      >
        <PAThumb kind={asset.thumb} />
      </div>
      {!asset.empty && asset.score != null ? (
        <div className={`score-bar score-bar--${tier}`}>
          <span className="score-bar__label">{asset.score}</span>
          <div className="score-bar__track">
            <div className="score-bar__fill" style={{ width: `${asset.score}%` }} />
          </div>
        </div>
      ) : (
        <div style={{ height: 29 }} />
      )}
      {asset.subLabel && (
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: -4 }}>
          {asset.subLabel}
        </div>
      )}
    </div>
  );
};

/* ---------- Assets grids ----------------------------------------- */
const HERO_CAROUSEL = [
  { id: 'h1', label: 'Hero',             thumb: 'hero',         score: 32 },
  { id: 'c1', label: 'Feature Callout',  thumb: 'feature',      score: null, subLabel: 'Informational' },
  { id: 'c2', label: 'Benefit highlight',thumb: 'benefit1',     score: 21 },
  { id: 'c3', label: 'Benefit highlight',thumb: 'benefit2',     score: 45 },
  { id: 'c4', label: 'Before & After',   thumb: 'beforeAfter',  score: 79 },
  { id: 'c5', label: 'Swatch',           thumb: 'swatch',       score: 13 },
  { id: 'c6', label: 'Benefit highlight',thumb: 'benefit3',     score: 81 },
  { id: 'c7', label: 'In-use',           thumb: 'inUse',        score: 67 },
  { id: 'c8', label: 'Size & scale',     thumb: 'sizeScale',    score: 34 },
];

const OPTIMAL_MIX = [
  { id: 'o1', label: 'Hero',              thumb: 'hero',         score: 32 },
  { id: 'o2', label: 'Feature Callout',   thumb: 'feature',      score: null, subLabel: 'Informational' },
  { id: 'o3', label: 'Before & After',    thumb: 'beforeAfter',  score: 79 },
  { id: 'o4', label: 'Benefit highlight', thumb: 'benefit2',     score: 81 },
  { id: 'o5', label: 'Swatch',            thumb: 'swatch',       score: 13 },
  { id: 'o6', label: 'In-use',            thumb: 'inUse',        score: 67 },
  { id: 'o7', label: 'Lifestyle',         thumb: 'empty',        empty: true },
  { id: 'o8', label: 'Product Facts Pa…', thumb: 'empty',        empty: true },
];

const EXTRA = [
  { id: 'e1', label: 'Benefit highlight (2)', thumb: 'benefit1', score: 21 },
  { id: 'e2', label: 'Benefit highlight',     thumb: 'benefit2', score: 45 },
  { id: 'e3', label: 'Size & scale',          thumb: 'sizeScale', score: 34 },
];

const SectionKicker = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 600, color: 'var(--text-quaternary)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '20px 24px 10px',
  }}>
    {children}
  </div>
);

const HeroCarouselSection = ({ onNavigate }) => (
  <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-tertiary)' }}>
    <SectionKicker>Your hero + carousel</SectionKicker>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
      gap: 16,
      padding: '0 24px 28px',
    }}>
      {HERO_CAROUSEL.map(a => <ProductAssetTile key={a.id} asset={a} onNavigate={onNavigate} />)}
    </div>
  </div>
);

const OptimalMixSection = () => (
  <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-tertiary)' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '20px 24px 6px',
    }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.005em' }}>
        Optimal asset mix
      </div>
      <button className="btn btn--ghost btn--sm" style={{ gap: 4, color: 'var(--text-brand-secondary)' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"/><circle cx="8" cy="8" r="2.2"/>
        </svg>
        View only
      </button>
      <button className="btn btn--ghost btn--sm" style={{ gap: 4, color: 'var(--text-tertiary)' }}>
        Show assets
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="m4 3 5 5-5 5M9 3l5 5-5 5"/>
        </svg>
      </button>
    </div>
    <div style={{ padding: '0 24px 8px', fontSize: 13, color: 'var(--text-tertiary)' }}>
      Match your carousel assets to the optimal mix for Makeup Foundation shown below. Add any missing asset classes.
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
      gap: 16,
      padding: '14px 24px 28px',
    }}>
      {OPTIMAL_MIX.map(a => <ProductAssetTile key={a.id} asset={a} />)}
    </div>
  </div>
);

const ExtraSection = () => (
  <div style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-tertiary)' }}>
    <SectionKicker>Extra asset types</SectionKicker>
    <div style={{ padding: '0 24px 8px', fontSize: 13, color: 'var(--text-tertiary)' }}>
      These assets are not part of the Vizit Standard for this category. Remove or move to end of carousel.
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
      gap: 16,
      padding: '14px 24px 60px',
    }}>
      {EXTRA.map(a => <ProductAssetTile key={a.id} asset={a} />)}
    </div>
  </div>
);

/* ---------- Page shell ------------------------------------------- */
/* ---------- Assets sidebar -------------------------------------- */
// Right-edge drawer triggered from the Assets button in the ProductCrumbs.
// Tabs: Hero (just the hero image) | Carousel (everything after it).
// Source filter: Imported / Spark / + Upload — Imported is the only one with
// real fixtures behind it for the prototype.
const SIDEBAR_W = 360;

const SidebarAssetTile = ({ asset }) => {
  const tier = (typeof scoreTier === 'function') ? scoreTier(asset.score) : 'mod';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {asset.label}
      </div>
      <div style={{
        position: 'relative', aspectRatio: '1 / 1',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-tertiary)',
        overflow: 'hidden',
      }}>
        <PAThumb kind={asset.thumb} />
      </div>
      {asset.score != null ? (
        <div className={`score-bar score-bar--${tier}`}>
          <span className="score-bar__label">{asset.score}</span>
          <div className="score-bar__track">
            <div className="score-bar__fill" style={{ width: `${asset.score}%` }} />
          </div>
        </div>
      ) : (
        <div style={{ height: 12 }} />
      )}
    </div>
  );
};

const AssetsSidebar = ({ onClose }) => {
  const [tab, setTab] = React.useState('carousel');
  const [source, setSource] = React.useState('imported');

  const hero = HERO_CAROUSEL.filter(a => a.thumb === 'hero');
  const carousel = HERO_CAROUSEL.filter(a => a.thumb !== 'hero');
  // Spark/Upload are empty in this prototype — keep filter state visible.
  const visible = source === 'imported' ? (tab === 'hero' ? hero : carousel) : [];

  return (
    <aside style={{
      width: SIDEBAR_W, flexShrink: 0,
      background: 'var(--bg-primary)',
      borderLeft: '1px solid var(--border-secondary)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0,
      alignSelf: 'flex-start',
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 16px',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-tertiary)',
        }}>Assets</div>
        <button
          type="button"
          className="btn btn--ghost btn--icon btn--sm"
          onClick={onClose}
          aria-label="Close assets sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="m4 4 8 8M12 4l-8 8"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs--underline" role="tablist" style={{ padding: '0 20px' }}>
        {[
          { k: 'hero', label: 'Hero' },
          { k: 'carousel', label: 'Carousel' },
        ].map(t => (
          <button
            key={t.k}
            role="tab"
            aria-selected={tab === t.k}
            className="tab"
            onClick={() => setTab(t.k)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Source toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '20px 20px 16px',
      }}>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => setSource('imported')}
          style={{
            borderColor: source === 'imported' ? 'var(--text-primary)' : 'var(--border-secondary)',
            color: source === 'imported' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: source === 'imported' ? 600 : 500,
          }}>
          Imported
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setSource('spark')}
          style={{
            color: source === 'spark' ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontWeight: source === 'spark' ? 600 : 500,
          }}>
          Spark
        </button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          style={{ gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M3 8h10"/>
          </svg>
          Upload
        </button>
      </div>

      {/* Asset grid */}
      <div style={{
        padding: '4px 20px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: 14, rowGap: 22,
      }}>
        {visible.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '36px 0',
            textAlign: 'center',
            color: 'var(--text-quaternary)',
            fontSize: 13,
          }}>
            {source === 'spark' ? 'No Spark generations yet.' : 'No assets uploaded yet.'}
          </div>
        ) : (
          visible.map(a => <SidebarAssetTile key={a.id} asset={a} />)
        )}
      </div>
    </aside>
  );
};

function ProductPage({ route, onNavigate }) {
  const [assetsOpen, setAssetsOpen] = React.useState(true);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }} data-screen-label="Product Page">
      <LeftRail route={route || '/library/product-pages'} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ProductCrumbs
          onNavigate={onNavigate}
          assetsOpen={assetsOpen}
          onToggleAssets={() => setAssetsOpen(o => !o)} />
        <ProductHeader />
        <PerformanceMetrics />
        <OptimizationPlan />
        <HeroCarouselSection onNavigate={onNavigate} />
        <OptimalMixSection />
        <ExtraSection />
      </main>
      {assetsOpen && <AssetsSidebar onClose={() => setAssetsOpen(false)} />}
    </div>
  );
}

Object.assign(window, { ProductPage, ScoreMetricCell, StrengthBolts });
