// =========================================================================
// Hero Asset Details — page composition
// =========================================================================
// Pulls together the primitives from hero-details.jsx into the full page:
//   • Top: breadcrumb + meta strip (score tile, type/class/category, syndication chip)
//   • Body: 2-col — preview (with served-resolution tab strip) + Score Breakdown panel
//   • Bottom: footer strip (source asset / pack coverage / OCR detections)
//   • Table: Text Detection & Readability — fragments × APCA / WCAG / Blur / NGS1

const { useState: useStateHP, useMemo: useMemoHP } = React;

/* ---------- Per-fragment readability seed ----------------------- */
// Hand-tuned plausible audit rows for a Fruity Pebbles-style hero. Mirrors
// the screenshot: text fragments with effective px size, OCR confidence,
// and a verdict per standard.
// Each fragment carries the verdict per standard AND the underlying metric
// value used to derive that verdict. The values surface as a hover tooltip
// on each VerdictPill so the table stays scannable but inspectable.
//   apca  → APCA Lc score (target ≥ 60)
//   wcag  → contrast ratio "x.x : 1" (target ≥ 4.5:1 / 3:1)
//   blur  → Cambridge blur "x.xx× σ²" (target ≥ 2.00)
//   ngs1  → GS1 NMRH thumbnail legibility score (0–100)
const HERO_FRAGMENTS = [
  { id: 'f1', text: 'Post',                  band: 'Top band',          eff: 14.2, conf: 0.99,
    verdicts: { apca: 'pass',     wcag: 'pass',     blur: 'pass',     ngs1: 'pass'     },
    metrics:  { apca: 'Lc 88',    wcag: '11.4 : 1', blur: '5.2× σ²',  ngs1: 'NMRH 92' } },
  { id: 'f2', text: 'EBBLES',                band: 'Top band',          eff: 22.6, conf: 0.81, note: '"P" missed by OCR',
    verdicts: { apca: 'pass',     wcag: 'pass',     blur: 'pass',     ngs1: 'pass'     },
    metrics:  { apca: 'Lc 84',    wcag: '9.1 : 1',  blur: '4.6× σ²',  ngs1: 'NMRH 86' } },
  { id: 'f3', text: 'BRAND',                 band: 'Top band · sub-Post', eff: 3.6, conf: 0.24,
    verdicts: { apca: 'fail',     wcag: 'marginal', blur: 'fail',     ngs1: 'fail'     },
    metrics:  { apca: 'Lc 42',    wcag: '3.2 : 1',  blur: '1.8× σ²',  ngs1: 'NMRH 38' } },
  { id: 'f4', text: 'SWEETENED RICE CEREAL', band: 'Subtitle',          eff: 5.0, conf: 0.96,
    verdicts: { apca: 'marginal', wcag: 'marginal', blur: 'pass',     ngs1: 'marginal' },
    metrics:  { apca: 'Lc 56',    wcag: '4.4 : 1',  blur: '2.4× σ²',  ngs1: 'NMRH 58' } },
  { id: 'f5', text: 'with NATURAL AND',      band: 'Regulatory line 1', eff: 4.0, conf: 0.88,
    verdicts: { apca: 'fail',     wcag: 'fail',     blur: 'pass',     ngs1: 'fail'     },
    metrics:  { apca: 'Lc 38',    wcag: '2.9 : 1',  blur: '2.1× σ²',  ngs1: 'NMRH 34' } },
  { id: 'f6', text: 'ARTIFICIALFRUITFLAVOR', band: 'Regulatory line 2', eff: 4.0, conf: 0.69, note: 'word boundaries lost',
    verdicts: { apca: 'fail',     wcag: 'fail',     blur: 'fail',     ngs1: 'fail'     },
    metrics:  { apca: 'Lc 31',    wcag: '2.4 : 1',  blur: '1.6× σ²',  ngs1: 'NMRH 28' } },
  { id: 'f7', text: '11',                    band: 'Net weight badge',  eff: 6.0, conf: 0.99,
    verdicts: { apca: 'pass',     wcag: 'pass',     blur: 'pass',     ngs1: 'pass'     },
    metrics:  { apca: 'Lc 78',    wcag: '7.6 : 1',  blur: '3.8× σ²',  ngs1: 'NMRH 81' } },
  { id: 'f8', text: 'oz',                    band: 'Net weight badge',  eff: 4.6, conf: 0.93,
    verdicts: { apca: 'marginal', wcag: 'pass',     blur: 'pass',     ngs1: 'marginal' },
    metrics:  { apca: 'Lc 62',    wcag: '5.4 : 1',  blur: '2.9× σ²',  ngs1: 'NMRH 60' } }
];

/* ---------- Preview tab strip (Original / OCR / 4 Ws / Blur) ---- */
const PreviewTabs = ({ value, onChange }) => {
  const items = ['Original', 'OCR', '4 Ws', 'Blur'];
  return (
    <div className="tabs tabs--button" style={{ alignSelf: 'center' }}>
      {items.map((it) =>
        <button key={it} className="tab"
          aria-selected={value === it}
          onClick={() => onChange(it)}
          style={{ padding: '0 14px', height: 30, fontSize: 12 }}>
          {it}
        </button>
      )}
    </div>
  );
};

/* ---------- Header strip (score sticker + meta) -------- */
const HeroHeader = ({ asset }) => {
  const tier = heroTier(asset.score);
  const risk = HERO_RISK[tier];
  // Sticker tier — collapses 5 score bands → sticker's 3 swatches.
  const stickerTier =
    tier === 'vlow' || tier === 'low'  ? 'vlow' :
    tier === 'mod'                     ? 'mod'  :
    tier === 'high' || tier === 'vhigh' ? 'high' : 'vlow';
  // Badge color — Pass for Low risk, Warning for Moderate, Error for High risk.
  const badgeCls =
    tier === 'vhigh'                   ? 'badge--success' :
    tier === 'mod' || tier === 'high'  ? 'badge--warning' :
    tier === 'na'                      ? 'badge--default' : 'badge--error';
  const badgeDot =
    tier === 'vhigh'                   ? '#17B26A' :
    tier === 'mod' || tier === 'high'  ? '#F79009' :
    tier === 'na'                      ? 'var(--gray-400)' : '#F04438';

  const meta = [
    { label: 'CLASS',    value: 'Hero' },
    { label: 'CATEGORY', value: asset.category || 'Tabletop Synthesizers' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center', gap: 24,
      padding: '14px 24px',
      borderBottom: '1px solid var(--border-tertiary)',
      background: '#fff'
    }}>
      {/* Score sticker + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className={`score-sticker score-sticker--lg score-sticker--${stickerTier}`} aria-label={`Vizit score ${asset.score}`}>
          <span className="score-sticker__num">{asset.score}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>Vizit score</span>
            <span className={`badge ${badgeCls} badge--box badge--sm`}>
              {risk.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', maxWidth: 320, lineHeight: 1.4 }}>
            This image scores higher than <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>82% of images</strong> in the Tabletop Synthesizers category.
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, minWidth: 0, flexWrap: 'wrap' }}>
        {meta.map((m) =>
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 90 }}>
            <span className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 10 }}>{m.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Score Breakdown panel -------------------------------
   No outer border: lives in the right column of the body grid; the column's
   parent provides the left divider. */
/* ---------- Score Breakdown panel -------------------------------
   No outer border: lives in the right column of the body grid; the column's
   parent provides the left divider. Header is a tab strip (Hero score is
   the only populated tab; the other three are placeholders for future
   AI surfaces). */
const HERO_TAB_ICONS = {
  // Inline SVG glyphs render crisper than PNGs at 14px; matches reference.
  score: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2.5 11A5.5 5.5 0 0 1 13.5 11" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M8 10 11 6" />
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ),
  sparkles: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2.5 10.5 5l2.5 1-2.5 1-1 2.5-1-2.5L6 6l2.5-1 1-2.5Z" />
      <path d="M4 9.5 4.6 11l1.4.6L4.6 12.2 4 13.6l-.6-1.4L2 11.6l1.4-.6.6-1.5Z" />
    </svg>
  ),
  imageSpark: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <rect x="2" y="3" width="10" height="9" />
      <path d="m2 10 2.5-2.5 2 2 2.5-2.5 3 3" />
      <path d="m12.5 2 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L10.5 4l1.5-.5.5-1.5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const ScoreBreakdownTabs = ({ value, onChange }) => {
  const tabs = [
    { k: 'score', label: 'Hero score', icon: HERO_TAB_ICONS.score },
    { k: 'analysis', label: 'Analysis', icon: HERO_TAB_ICONS.eye },
    { k: 'ideas', label: 'Spark ideas', icon: HERO_TAB_ICONS.sparkles },
    { k: 'images', label: 'Spark images', icon: HERO_TAB_ICONS.imageSpark },
  ];
  return (
    <div className="tabs tabs--button tabs--block" role="tablist" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
      {tabs.map(t => (
        <button
          key={t.k}
          role="tab"
          aria-selected={value === t.k}
          className="tab"
          onClick={() => onChange?.(t.k)}
          style={{ gap: 8, fontSize: 13 }}
        >
          <span style={{ display: 'inline-flex' }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

const ScoreBreakdown = () => {
  const [tab, setTab] = React.useState('score');
  return (
    <div style={{ background: '#fff' }}>
      <ScoreBreakdownTabs value={tab} onChange={setTab} />
      {tab === 'score' && (
        <>
          <ComponentRow status="pass" name="Retail Readiness" desc="Meets basic retailer image specs." tierLabel="HIGH" tierCls="score-bar--vhigh" />
          <ComponentRow status="warn" name="Visual Impact"    desc="Color, lighting, and composition relative to category benchmarks." tierLabel="MED" tierCls="score-bar--mod" />
          <ComponentRow status="fail" name="Distinctiveness"  desc="Visual separation from similarly searched competitors." tierLabel="LOW" tierCls="score-bar--low" />

          {/* Hashed-out divider — Mobile-readiness is diagnostic only,
              does not contribute to the overall Vizit score. */}
          <div
            aria-hidden="true"
            style={{
              height: 28,
              backgroundImage: 'repeating-linear-gradient(135deg, var(--border-secondary) 0, var(--border-secondary) 1px, transparent 1px, transparent 8px)',
              backgroundColor: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-secondary)',
              borderBottom: '1px solid var(--border-secondary)',
            }}
          />

          {/* Mobile-Readiness sub-component */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-tertiary)' }}>
            <span className="t-xs-semibold text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>Mobile-readiness</span>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4, marginTop: 4 }}>Clarity and legibility of the 5 shopper questions at mobile thumbnail size.</div>
          </div>
          <SubBar name="Brand"        value={86} tier="vhigh" />
          <SubBar name="Product Type" value={78} tier="high" />
          <SubBar name="Variety"      value={42} tier="low" />
          <SubBar name="Count"        value={91} tier="vhigh" />
          <SubBar name="Size"         value={18} tier="vlow" />

          <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-quaternary)', fontStyle: 'italic', borderBottom: '1px solid var(--border-tertiary)' }}>
            Diagnostically — does not affect your aero Vizit score
          </div>
        </>
      )}
      {tab !== 'score' && (
        <div style={{ padding: '40px 24px', textAlign: 'center', fontSize: 12, color: 'var(--text-quaternary)' }}>
          Coming soon
        </div>
      )}
    </div>
  );
};

/* ---------- Footer strip (Source / Coverage / Detections) ------- */
const HeroFooter = ({ asset }) =>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 24,
    padding: '14px 20px',
    background: '#fff',
    borderTop: '1px solid var(--border-tertiary)'
  }}>
    <div>
      <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 10, marginBottom: 4 }}>Source asset</div>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>2400 × 2400 px</div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>PNG · Walmart, Amazon, Target</div>
    </div>
    <div>
      <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 10, marginBottom: 4 }}>Pack coverage</div>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>64.1 %</div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>GS1 target ≥ 70%</div>
    </div>
    <div>
      <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em', fontSize: 10, marginBottom: 4 }}>OCR detections</div>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>8 fragments</div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>1 partial · 1 merged</div>
    </div>
  </div>;

/* ---------- Readability table -----------------------------------
   No outer border: parent body grid contributes the top divider line. */
const ReadabilityTable = ({ rows, hoverId, onHover }) =>
  <div style={{ background: '#fff' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 16px 12px' }}>
      <div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Text Detection & Readability</span>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 12 }}>Per-fragment audit · all standards measured at served resolution</span>
      </div>
      <span className="badge badge--default badge--sm" style={{ gap: 6 }}>
        <span style={{ width: 8, height: 8, background: 'var(--brand-500, #D97757)' }} />
        Easy OCR · 3-pass · keyword reconcile
      </span>
    </div>
    <table className="table" style={{ width: '100%' }}>
      <thead>
        <tr style={{ background: '#1D2939', color: '#fff' }}>
          <th style={{ color: '#fff', padding: '12px 16px', borderBottom: 0, background: '#1D2939' }}>Detected text</th>
          <th style={{ color: '#fff', padding: '12px 16px', borderBottom: 0, background: '#1D2939' }}>
            APCA<br />
            <span style={{ fontWeight: 400, fontSize: 10, color: '#B0B7C3', textTransform: 'none', letterSpacing: 0 }}>Lc target ≥ 60</span>
          </th>
          <th style={{ color: '#fff', padding: '12px 16px', borderBottom: 0, background: '#1D2939' }}>
            WCAG 2.1<br />
            <span style={{ fontWeight: 400, fontSize: 10, color: '#B0B7C3', textTransform: 'none', letterSpacing: 0 }}>≥ 4.5:1 / 3:1</span>
          </th>
          <th style={{ color: '#fff', padding: '12px 16px', borderBottom: 0, background: '#1D2939' }}>
            CAMBRIDGE BLUR<br />
            <span style={{ fontWeight: 400, fontSize: 10, color: '#B0B7C3', textTransform: 'none', letterSpacing: 0 }}>0–10 · target ≥ 2.00</span>
          </th>
          <th style={{ color: '#fff', padding: '12px 16px', borderBottom: 0, background: '#1D2939' }}>
            GS1 NMRH<br />
            <span style={{ fontWeight: 400, fontSize: 10, color: '#B0B7C3', textTransform: 'none', letterSpacing: 0 }}>thumbnail legibility</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const isHover = hoverId === r.id;
          return (
            <tr key={r.id}
              onMouseEnter={() => onHover && onHover(r.id)}
              onMouseLeave={() => onHover && onHover(null)}
              style={{ background: isHover ? 'var(--bg-secondary)' : '#fff' }}>
              <td style={{ verticalAlign: 'top', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', background: r.note ? '#FEF6C8' : 'transparent', padding: r.note ? '2px 4px' : 0, display: 'inline-block', marginBottom: 4 }}>
                  {r.text}
                </div>
                {r.note &&
                  <div style={{ fontSize: 11, color: '#B54708', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#F79009' }}>⚠</span> {r.note}
                  </div>
                }
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {r.band} · <span style={{ fontFamily: 'var(--font-mono)' }}>{r.eff} px eff</span> · <span style={{ fontFamily: 'var(--font-mono)' }}>Conf {r.conf.toFixed(2)}</span>
                </div>
              </td>
              <td style={{ verticalAlign: 'top' }}><VerdictPill verdict={r.verdicts.apca} metric={r.metrics?.apca} /></td>
              <td style={{ verticalAlign: 'top' }}><VerdictPill verdict={r.verdicts.wcag} metric={r.metrics?.wcag} /></td>
              <td style={{ verticalAlign: 'top' }}><VerdictPill verdict={r.verdicts.blur} metric={r.metrics?.blur} /></td>
              <td style={{ verticalAlign: 'top' }}><VerdictPill verdict={r.verdicts.ngs1} metric={r.metrics?.ngs1} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--border-tertiary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <span><strong style={{ color: 'var(--text-secondary)' }}>{rows.length}</strong> fragments detected</span>
        <span><strong style={{ color: '#17B26A' }}>{rows.filter(r => Object.values(r.verdicts).every(v => v === 'pass')).length}</strong> pass all standards</span>
        <span><strong style={{ color: '#F79009' }}>{rows.filter(r => Object.values(r.verdicts).includes('marginal') && !Object.values(r.verdicts).includes('fail')).length}</strong> marginal</span>
        <span><strong style={{ color: '#F04438' }}>{rows.filter(r => Object.values(r.verdicts).includes('fail')).length}</strong> fail one or more</span>
      </div>
      <span>Hover a row to highlight on master</span>
    </div>
  </div>;

Object.assign(window, { HERO_FRAGMENTS, PreviewTabs, HeroHeader, ScoreBreakdown, HeroFooter, ReadabilityTable });
