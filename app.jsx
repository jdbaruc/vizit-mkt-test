/* eslint-disable */
const { useState, useMemo, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable"
}/*EDITMODE-END*/;

// Score-band thresholds: 0–39 LOW (red) · 40–59 MED (yellow) · 60–100 HIGH (green)
function bandFromPct(pct) {
  if (pct >= 60) return 'high';
  if (pct >= 40) return 'med';
  return 'low';
}

function Bar({ pct }) {
  const band = bandFromPct(pct);
  return (
    <div className="bar-track">
      <div className={`bar-fill ${band}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const MR_LABELS = [
  ['brand',       'Brand'],
  ['productType', 'Product Type'],
  ['variant',     'Variant'],
  ['count',       'Count'],
  ['size',        'Size'],
];

function tierTag(tier) {
  return tier === 'high' ? 'High' : tier === 'med' ? 'Med' : 'Low';
}

function tierPill(tier) {
  // matches source UI: Low / Moderate / High pill next to Hero Score
  if (tier === 'low')      return { label: 'Low',      cls: 'pill-low' };
  if (tier === 'moderate') return { label: 'Moderate', cls: 'pill-mod' };
  if (tier === 'high')     return { label: 'High',     cls: 'pill-high' };
  if (tier === 'pending')  return { label: 'Not scored', cls: 'pill-pending' };
  return { label: tier, cls: '' };
}

// Drives the hero/visual-score pill off the actual number using the same band thresholds.
function heroTier(score) {
  if (score == null) return 'pending';
  if (score >= 60) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

function badgeKind(b) {
  switch (b) {
    case 'Live':         return 'live';
    case 'Top pick':     return 'rec';
    case 'Candidate':    return 'test';
    case 'Off-variant':  return 'exp';
    default:             return 'test';
  }
}

function Row({ it }) {
  const isPending = it.mr === 'pending';
  const hero = tierPill(it.score == null ? 'pending' : heroTier(it.score));

  return (
    <article className="row" data-screen-label={it.filename}>
      <div className="img-cell">
        <div className="product-img">
          <ProductSVG kind={it.image} />
        </div>
      </div>

      <div className="body-cell">
        <div className="title-line">
          {(it.badge === 'Live' || it.badge === 'Top pick') && (
            <span className={`it-badge ${badgeKind(it.badge)}`}>{it.badge}</span>
          )}
          <span className="filename">{it.filename}</span>
          <span className="title-note">{it.note}</span>
        </div>

        <div className="mr-grid">
          {MR_LABELS.map(([key, lbl]) => {
            if (isPending) {
              return (
                <div className="mr-cell pending" key={key}>
                  <span className="mr-cell-label">{lbl}</span>
                  <div className="bar-track"><div className="bar-fill pending" /></div>
                  <span className="mr-cell-value">—</span>
                </div>
              );
            }
            const m = it.mr[key];
            const band = bandFromPct(m.pct);
            return (
              <div className="mr-cell" key={key}>
                <span className="mr-cell-label">{lbl}</span>
                <Bar pct={m.pct} />
                <span className={`mr-cell-value ${band}`}>{m.pct}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="scores-cell">
        <div className="hero-score">
          <div className="hs-name">Visual Score</div>
          <div className="hs-line">
            <span className={`hs-number ${hero.cls}`}>{it.score == null ? '—' : it.score}</span>
            <span className={`hs-pill ${hero.cls}`}>{hero.label}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductTabs({ tabs, active, onSelect }) {
  return (
    <nav className="product-tabs" aria-label="Products">
      <div className="product-tabs-scroll">
        {tabs.map(t => {
          const count = (ITERATIONS_BY_ASIN[t.asin] || []).length;
          return (
            <button
              key={t.asin}
              className={`ptab ${t.asin === active ? 'active' : ''}`}
              onClick={() => onSelect(t.asin)}
              type="button"
            >
              <span className="ptab-asin">{t.asin}</span>
              <span className="ptab-name">{t.short}</span>
              <span className={`ptab-count ${count === 0 ? 'empty' : ''}`}>{count === 0 ? '—' : count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ───────── app shell ───────── */

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeAsin, setActiveAsin] = useState('B0GQWVCGY4');

  useEffect(() => {
    document.body.classList.toggle('compact', t.density === 'compact');
  }, [t.density]);

  const activeTab = PRODUCT_TABS.find(p => p.asin === activeAsin) || PRODUCT_TABS[0];
  const items = ITERATIONS_BY_ASIN[activeAsin] || [];

  const list = useMemo(() => {
    // sort by visual score desc; if any are pending, fall back to avg of MR signals
    const avgMr = (it) => {
      if (it.mr === 'pending' || !it.mr) return -1;
      const vals = Object.values(it.mr).map(m => m.pct);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };
    const allPending = items.every(i => i.score == null);
    if (allPending) {
      return [...items].sort((a, b) => avgMr(b) - avgMr(a));
    }
    return [...items].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  }, [items]);

  return (
    <>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <img src="assets/logo-black.svg" alt="Vizit" />
            <span className="divider"></span>
            <span className="crumb">Library · {PRODUCT.brand} · Hero Score</span>
          </div>
          <div className="actions">
            <button className="btn btn-ghost">Export CSV</button>
            <button className="btn btn-secondary">Upload hero</button>
            <button className="btn btn-primary">Run new scan</button>
          </div>
        </header>

        <ProductTabs tabs={PRODUCT_TABS} active={activeAsin} onSelect={setActiveAsin} />

        <section className="product-header">
          <div className="ph-eyebrow">
            <span className="cat">{activeTab.category}</span>
            <span className="dot" />
            <span>ASIN {activeTab.asin}</span>
            <span className="dot" />
            <span>{list.length} {list.length === 1 ? 'asset' : 'assets'}</span>
          </div>
          <h1 className="ph-title">{activeTab.title}</h1>
        </section>

        <div className="list">
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-asin">{activeTab.asin}</div>
              <div className="empty-title">No hero assets scored yet</div>
              <div className="empty-copy">Upload a hero image or run a fresh scan to populate this product's library.</div>
              <div className="empty-actions">
                <button className="btn btn-secondary">Upload hero</button>
                <button className="btn btn-primary">Run new scan</button>
              </div>
            </div>
          ) : (
            list.map(it => <Row key={it.id} it={it} />)
          )}
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="List">
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={v => setTweak('density', v)}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact',     label: 'Compact'     },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
