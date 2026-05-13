// =========================================================================
// ClassPicker — popover for overriding an asset's auto-detected Class.
// =========================================================================
// Anchors below a small "edit" affordance next to the Class meta field on
// the Asset Details page. Lists every system class from ASSET_CLASSES with
// a search input, a tick on the active row, and a "Reset to auto-detected"
// link when the user has overridden the system value.
//
// Pattern mirrors TagPicker: outside-click + Esc close, ↑/↓ to navigate,
// Enter to commit, focus trapped to the search input.

const { useState: useStateCP, useEffect: useEffectCP, useRef: useRefCP, useMemo: useMemoCP } = React;

// Short, human descriptions for each class. Kept terse (one phrase) so the
// popover stays compact. Source of truth for the list itself is
// ASSET_CLASSES from library.jsx — we just decorate it.
const CLASS_DESCRIPTIONS = {
  'Hero Image':              'Primary marketing shot — usually the listing thumbnail',
  'In-Use':                  'Product being used in context',
  'Lifestyle':               'Aspirational scene, broader context than In-Use',
  'Benefit Highlight':       'Calls out a single product benefit or claim',
  'Before and After':        'Side-by-side outcome comparison',
  'Product Swatch':          'Color, finish, or material samples',
  'Comparison':              'Compares this product to alternatives',
  'Product Range':           'Multiple SKUs from the same family',
  'Multi-Pack':              'Bundle / quantity packaging',
  'Included Items':          'Everything that ships in the box',
  'Feature Callout':         'Annotated detail of a specific feature',
  'Alternate Product Views': 'Side, back, top, or angled product shot',
  'Endorsements':            'Awards, reviews, or third-party validation',
  'Certification Mark':      'Regulatory or compliance badge',
  'Usage Instructions':      'Step-by-step how-to or directions',
  'Size and Scale':          'Dimensions or scale relative to a reference',
  'Product Facts Panel':     'Ingredients, nutrition, or spec sheet',
};

// Pull the canonical class list from library.jsx, decorated with descriptions.
const getSystemClasses = () => {
  const list = typeof ASSET_CLASSES !== 'undefined'
    ? ASSET_CLASSES
    : Object.keys(CLASS_DESCRIPTIONS);
  return list.map((label, i) => ({
    id: `cls-${i}`,
    label,
    desc: CLASS_DESCRIPTIONS[label] || '',
  }));
};

const ClassPicker = ({ anchorRef, value, autoValue, onPick, onReset, onClose }) => {
  const [hoverIdx, setHoverIdx] = useStateCP(0);
  const popRef = useRefCP(null);
  const listRef = useRefCP(null);

  useEffectCP(() => {
    const onDoc = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const all = useMemoCP(() => getSystemClasses(), []);
  const matches = all;

  // Pre-select the active class so ↓ moves *from* the current selection.
  useEffectCP(() => {
    const idx = matches.findIndex((c) => c.label === value);
    setHoverIdx(idx >= 0 ? idx : 0);
  }, [value, matches]);

  const commit = (row) => {
    if (!row) return;
    onPick(row.label);
  };

  // Keyboard nav lives on the list container — focus it on mount.
  useEffectCP(() => { listRef.current?.focus(); }, []);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHoverIdx((i) => Math.min(i + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHoverIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(matches[hoverIdx]); }
  };

  // Keep the hovered row in view as the user navigates with the keyboard.
  useEffectCP(() => {
    const list = listRef.current;
    if (!list) return;
    const row = list.querySelector(`[data-row="${hoverIdx}"]`);
    if (row && typeof row.scrollIntoView !== 'function') return;
    if (row) {
      const r = row.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      if (r.top < l.top) list.scrollTop -= (l.top - r.top);
      else if (r.bottom > l.bottom) list.scrollTop += (r.bottom - l.bottom);
    }
  }, [hoverIdx]);

  const isOverridden = autoValue && value !== autoValue;

  return (
    <div
      ref={popRef}
      role="dialog"
      aria-label="Override asset class"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        width: 320,
        background: '#fff',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header — title only (no search) */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-tertiary)' }}>
        <div className="t-xs-semibold text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>
          Override class
        </div>
      </div>

      {/* List of classes */}
      <div
        ref={listRef}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        style={{ maxHeight: 360, overflowY: 'auto', padding: 4, outline: 'none' }}
      >
        {matches.length === 0 ? (
          <div className="t-caption text-quaternary" style={{ padding: '10px 12px', fontSize: 11 }}>
            No matches.
          </div>
        ) : matches.map((c, i) => {
          const selected = c.label === value;
          const hovered = i === hoverIdx;
          return (
            <div
              key={c.id}
              data-row={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseDown={(e) => { e.preventDefault(); commit(c); }}
              role="option"
              aria-selected={selected}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                background: hovered ? 'var(--bg-secondary)' : 'transparent',
              }}
            >
              {/* Tick column */}
              <div style={{ width: 12, height: 16, flexShrink: 0, color: 'var(--brand-700, #6941C6)', display: 'grid', placeItems: 'center' }}>
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2.5 6.5 5 9l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</div>
                  {c.label === autoValue && (
                    <span className="t-caption" style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9, letterSpacing: '.04em', textTransform: 'uppercase',
                      color: 'var(--text-quaternary)',
                    }}>
                      auto
                    </span>
                  )}
                </div>
                {c.desc && (
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.35 }}>
                    {c.desc}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with reset action when overridden */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid var(--border-tertiary)',
        background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        minHeight: 32,
      }}>
        {isOverridden ? (
          <>
            <span className="t-caption text-tertiary" style={{ fontSize: 11 }}>
              Overridden — auto was <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{autoValue}</span>
            </span>
            <button
              onClick={() => { onReset(); }}
              className="t-caption"
              style={{
                background: 'none', border: 0, padding: 0, cursor: 'pointer',
                color: 'var(--brand-700, #6941C6)', fontWeight: 500, fontSize: 11,
                fontFamily: 'inherit',
              }}
            >
              Reset to auto
            </button>
          </>
        ) : (
          <span className="t-caption text-quaternary" style={{ fontSize: 11 }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: 4 }}>
              <path d="M6 1.5v4M6 8.5v.01" strokeLinecap="round" />
              <circle cx="6" cy="6" r="5" />
            </svg>
            Auto-classified by Vizit
          </span>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { ClassPicker, getSystemClasses, CLASS_DESCRIPTIONS });
