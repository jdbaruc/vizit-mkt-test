// =========================================================================
// Reporting page — /analytics
// =========================================================================
// Reached from the BarChart icon in the LeftRail. Three sections:
//
//   Impact         — combined performance of products optimized + launched
//   Content Health — combined performance of all products in Vizit
//   Opportunity    — untapped revenue/products
//
// Every metric tile is a <ScoreMetricCell> (imported via window) so we keep
// score-card visual language consistent across the app. Tiers map to the
// design-system score tiers (vlow/low/mod/high/vhigh); for non-score
// neutral values (revenue dollars, brand-name groupings) we override
// --smc-value-fg on a wrapper so the value renders in text-primary instead
// of a score color.
// =========================================================================

const { useState: useStateR } = React;

/* ---------- Small bits --------------------------------------------------- */

const ArrowUpRight = () =>
<svg width="18" height="18" viewBox="0 0 16 16" fill="none"
stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
style={{ flexShrink: 0 }}>
    <path d="M5 11 11 5" />
    <path d="M6 5h5v5" />
  </svg>;


const ChevronDown = () =>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3.5 5.5 3.5 3.5 3.5-3.5" />
  </svg>;


const SearchGlyph = () =>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6.25" cy="6.25" r="4.25" />
    <path d="m9.5 9.5 2.5 2.5" />
  </svg>;


/* ---------- Filter dropdown (visual only when no `options`) ------------- */
// Supply `options` (array of strings) to make it a real working select.
// Pass `multi` to switch to a checkbox-list. In multi mode `value` is an
// array of selected option names; the trigger compresses to:
//   - default `label` when nothing is selected
//   - the option name when only one is selected
//   - "Foo, Bar" when exactly two are selected
//   - "N selected" when three or more are selected
// A "Clear" affordance on the trigger lets users wipe selections in one tap
// without opening the menu; the menu footer mirrors it for keyboard users.
const FilterDropdown = ({ label, options, value, onChange, multi = false }) => {
  const [open, setOpen] = useStateR(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const interactive = Array.isArray(options);
  const arr = Array.isArray(value) ? value : [];
  const hasSelection = multi ? arr.length > 0 : !!value;
  const display = !interactive ? label :
  multi ?
  arr.length === 0 ? label :
  arr.length <= 2 ? arr.join(', ') :
  `${arr.length} selected` :
  value || label;

  const toggle = (opt) => {
    if (!onChange) return;
    if (multi) {
      onChange(arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]);
    } else {
      onChange(opt);
      setOpen(false);
    }
  };
  const clear = () => onChange && onChange(multi ? [] : null);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={interactive ? () => setOpen((o) => !o) : undefined}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, height: 38, padding: '0 8px 0 12px',
          width: '100%',
          background: '#fff',
          border: '1px solid var(--border-secondary)',

          font: 'inherit', fontSize: 13,
          color: 'var(--text-primary)',
          cursor: 'pointer', borderRadius: "0px"
        }}>
        
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>{display}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {hasSelection &&
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
            onClick={(e) => {e.stopPropagation();clear();}}
            onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.stopPropagation();clear();}}}
            style={{
              display: 'inline-grid', placeItems: 'center',
              width: 18, height: 18,
              color: 'var(--text-quaternary)',
              cursor: 'pointer',
              borderRadius: 3
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'var(--bg-secondary)';e.currentTarget.style.color = 'var(--text-primary)';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = 'var(--text-quaternary)';}}>
            
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6" /></svg>
            </span>
          }
          <span style={{ color: 'var(--text-quaternary)', display: 'inline-flex' }}>
            <ChevronDown />
          </span>
        </span>
      </button>
      {interactive && open &&
      <div style={{
        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
        background: '#fff',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.10))',
        borderRadius: 'var(--radius-xs)',
        zIndex: 50, padding: 4,
        maxHeight: 360, overflowY: 'auto',
        minWidth: 220
      }}>
          {!multi &&
        <button
          type="button"
          onClick={() => {onChange && onChange(null);setOpen(false);}}
          style={{
            display: 'flex', alignItems: 'center', width: '100%',
            padding: '7px 10px', background: 'transparent', border: 0,
            font: 'inherit', fontSize: 13,
            color: value == null ? 'var(--text-brand-secondary)' : 'var(--text-secondary)',
            cursor: 'pointer', textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          {label}</button>
        }
          {options.map((opt) => {
          const isOn = multi ? arr.includes(opt) : opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '7px 10px',
                background: !multi && isOn ? 'var(--brand-50)' : 'transparent',
                border: 0,
                font: 'inherit', fontSize: 13,
                color: !multi && isOn ? 'var(--text-brand-secondary)' : 'var(--text-primary)',
                cursor: 'pointer', textAlign: 'left'
              }}
              onMouseEnter={(e) => {if (!(!multi && isOn)) e.currentTarget.style.background = 'var(--bg-secondary)';}}
              onMouseLeave={(e) => {if (!(!multi && isOn)) e.currentTarget.style.background = 'transparent';}}>
              
                {multi &&
              <span style={{
                width: 14, height: 14, flexShrink: 0,
                border: '1px solid var(--border-secondary)',
                background: isOn ? 'var(--brand-800)' : '#fff',
                display: 'grid', placeItems: 'center',
                borderRadius: 2
              }}>
                    {isOn && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m3 8 3 3 7-7" /></svg>}
                  </span>
              }
                <span>{opt}</span>
              </button>);

        })}
          {multi && arr.length > 0 &&
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px 4px', marginTop: 4,
          borderTop: '1px solid var(--border-tertiary)'
        }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>{arr.length} selected</span>
              <button
            type="button"
            onClick={clear}
            style={{
              background: 'transparent', border: 0, padding: '2px 6px',
              font: 'inherit', fontSize: 12, color: 'var(--text-brand-secondary)',
              cursor: 'pointer'
            }}>
            Clear</button>
            </div>
        }
        </div>
      }
    </div>);

};

/* ---------- Top filter row ---------------------------------------------- */
const FilterRow = () => {
  const [q, setQ] = useStateR('');
  const [brands, setBrands] = useStateR([]);
  const [cats, setCats] = useStateR([]);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr)) 280px',
      gap: 16,
      alignItems: 'center'
    }}>
      <FilterDropdown label="All categories" options={window.CATEGORIES || []} value={cats} onChange={setCats} multi />
      <FilterDropdown label="All brands" options={window.BRANDS || []} value={brands} onChange={setBrands} multi />
      <label className="input" style={{ height: 38, borderRadius: "0px" }}>
        <span className="input__icon"><SearchGlyph /></span>
        <input
          type="search"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)} />
        
      </label>
    </div>);

};

/* ---------- Section header ---------------------------------------------- */
// `onClick` makes the title clickable, routing into the section's own
// reporting page; without it, the header renders as static text.
const SectionHeader = ({ title, description, onClick }) => {
  const Title = onClick ? 'button' : 'h2';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
    <Title
        onClick={onClick}
        onMouseEnter={onClick ? (e) => {
          e.currentTarget.style.color = 'var(--brand-700)';
          const a = e.currentTarget.querySelector('[data-arrow]');
          if (a) a.style.color = 'var(--brand-700)';
        } : undefined}
        onMouseLeave={onClick ? (e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          const a = e.currentTarget.querySelector('[data-arrow]');
          if (a) a.style.color = 'var(--text-quaternary)';
        } : undefined}
        style={{
          margin: 0, padding: 0,
          background: 'transparent', border: 0,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--display-sm, 30px)',
          lineHeight: 1.2,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          cursor: onClick ? 'pointer' : 'default',
          textAlign: 'left',
          transition: 'color 0.15s'
        }}>
        
      <span>{title}</span>
      <span data-arrow style={{ color: 'var(--text-quaternary)', display: 'inline-flex', transition: 'color 0.15s' }}>
        <ArrowUpRight />
      </span>
    </Title>
    <p style={{
        margin: 0,
        fontSize: 14,
        lineHeight: 1.5,
        color: 'var(--text-secondary)'
      }}>
      {description}
    </p>
  </div>);

};

/* ---------- Metric card wrapper ----------------------------------------- */
// One score-metric-cell per cell, divided by 1px vertical rules. The first
// column has no left rule; trailing ones get a borderRight. The wrapper
// surface itself is a single rounded white card.
const MetricGroup = ({ columns, children }) => {
  const items = React.Children.toArray(children);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      background: '#fff',
      border: '1px solid var(--border-secondary)',
      borderRadius: 'var(--radius-xs)',
      /* Was overflow:hidden — switched to visible so the Insights tooltip on
         the Revenue-potential cell isn't clipped by the group container. The
         child cells are transparent + only have internal borderRight dividers,
         so the rounded outer corners still read clean. */
      overflow: 'visible'
    }}>
      {items.map((child, i) =>
      <div key={i} style={{
        padding: '20px 24px 22px',
        borderRight: i < items.length - 1 ? '1px solid var(--border-tertiary)' : 'none',
        minHeight: 132,
        display: 'flex', flexDirection: 'column'
      }}>
          {child}
        </div>
      )}
    </div>);

};

/* ---------- "vs last month" trailing line ------------------------------- */
// The denom slot already supports a string, but we want the delta badge to
// sit inline with the trailing "vs last month" caption. Easier: render a
// composite delta as a JSX node that ScoreMetricCell can paint via its
// existing delta slot — but its delta slot is a single span. So we use the
// denom slot with the small caption ("vs last month") and let `delta` carry
// the green pill ("↑5"). Default trailing copy is "vs last month".
const trailing = (text = 'vs last month') => text;

/* ---------- Tiny brand avatar for "Brands in Need" ---------------------- */
const BrandAvatar = ({ bg, fg, letter }) =>
<span aria-hidden style={{
  width: 24, height: 24, borderRadius: '50%',
  background: bg, color: fg,
  display: 'inline-grid', placeItems: 'center',
  fontSize: 11, fontWeight: 700,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 0 0 1px rgba(255,255,255,0.9) inset',
  flexShrink: 0
}}>{letter}</span>;


/* ---------- The page ---------------------------------------------------- */
function ReportingPage({ route, onNavigate }) {
  // Neutral (black) value override — wrap a cell when we want the value
  // rendered in text-primary instead of a tier color (used for revenue
  // dollars and brand-cluster cells).
  const neutralValue = { '--smc-value-fg': 'var(--text-primary)' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          flex: 1,
          padding: '40px 48px 64px',
          display: 'flex', flexDirection: 'column', gap: 36,
          maxWidth: 1440
        }}>
          {/* Title */}
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--display-md, 36px)',
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            Reporting
          </h1>

          {/* Filters */}
          <FilterRow />

          {/* ----- Section 1: Content Health ----- */}
          <section>
            <SectionHeader
              title="Content Health"
              description={
              <>
                  Here's the <strong style={{ color: 'var(--text-primary)' }}>combined performance</strong> of products in Vizit.
                </>
              } />
            
            <MetricGroup columns={3}>
              <ScoreMetricCell
                label="Avg. product score"
                strength={0} totalStrength={0}
                tier="high"
                value="67"
                denom="vs last month"
                delta="5" />
              
              <ScoreMetricCell
                label="Optimized products"
                strength={0} totalStrength={0}
                tier="mod"
                value="83"
                denom="/ 856   ·   vs last month"
                delta="5" />
              
              <ScoreMetricCell
                label="Optimized assets"
                strength={0} totalStrength={0}
                tier="mod"
                value="264"
                denom="/ 542   ·   since last month"
                delta="3.2%" />
              
            </MetricGroup>
          </section>

          {/* ----- Section 2: Opportunity ----- */}
          <section>
            <SectionHeader
              title="Opportunity"
              onClick={() => onNavigate && onNavigate('/analytics/opportunity')}
              description={
              <>
                  Here's the <strong style={{ color: 'var(--text-primary)' }}>key areas of untapped opportunity</strong>{' '}
                  of your products in Vizit.
                </>
              } />
            
            <MetricGroup columns={4}>
              <ScoreMetricCell
                label="Unoptimized products"
                strength={0} totalStrength={0}
                tier="mod"
                value="75"
                denom="vs last month"
                delta="5" />
              
              <ScoreMetricCell
                label="Products scoring below 20"
                strength={0} totalStrength={0}
                tier="vlow"
                value="102"
                denom="vs last month"
                delta="5" />
              
              <div style={neutralValue}>
                <ScoreMetricCell
                  label="Brands in need"
                  strength={0} totalStrength={0}
                  tier="na"
                  valueSize="md"
                  value={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex' }}>
                        <BrandAvatar bg="#e3edf7" fg="#1f5fa3" letter="P" />
                        <span style={{ marginLeft: -8 }}>
                          <BrandAvatar bg="#f1ece4" fg="#7a5a2c" letter="O" />
                        </span>
                      </span>
                      <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{window.BRANDS && window.BRANDS.slice(0, 2).join(', ') || 'Pale Blue, Operator'}</span>
                    </span>
                  } />
                
              </div>
              <div style={neutralValue}>
                <ScoreMetricCell
                  label="Revenue potential"
                  tooltip="If these products had syndicated optimized imagery (80+ conversion score), this would have been the dollar amount of revenue."
                  strength={0} totalStrength={0}
                  tier="na"
                  value="$7M"
                  denom="vs last month"
                  delta="5" />
                
              </div>
            </MetricGroup>
          </section>
          {/* ----- Section 3: Impact ----- */}
          <section>
            <SectionHeader
              title="Impact"
              onClick={() => onNavigate && onNavigate('/analytics/impact')}
              description={
              <>
                  Here's the <strong style={{ color: 'var(--text-primary)' }}>combined performance</strong> of products{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>optimized and launched</strong>.
                </>
              } />
            
            <MetricGroup columns={3}>
              <ScoreMetricCell
                label="Overall conversion bump (post-optimization)"
                strength={0} totalStrength={0}
                tier="vhigh"
                value="28%"
                denom="vs last month"
                delta="5" />
              
              <div style={neutralValue}>
                <ScoreMetricCell
                  label="Avg. weekly revenue"
                  strength={0} totalStrength={0}
                  tier="na"
                  value="$8K"
                  denom="vs last month"
                  delta="5" />
                
              </div>
              <div style={neutralValue}>
                <ScoreMetricCell
                  label="Projected annual revenue"
                  strength={0} totalStrength={0}
                  tier="na"
                  value="$2M"
                  denom="vs last month"
                  delta="5" />
                
              </div>
            </MetricGroup>
          </section>

        </div>
      </main>
    </div>);

}

Object.assign(window, { ReportingPage, ImpactReportingPage: null, SectionHeader, FilterRow, MetricGroup });