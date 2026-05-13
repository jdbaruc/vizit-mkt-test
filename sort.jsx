// =========================================================================
// Collections — sort control variations & grid
// =========================================================================
const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

/* ------------------------------------------------------------------ */
/* Sort logic                                                          */
/* ------------------------------------------------------------------ */
const SORTS = {
  'date-desc':  { label: 'Date added',       short: 'Newest',     icon: 'clock',  apply: a => [...a].sort((x, y) => new Date(y.added) - new Date(x.added)) },
  'score-desc': { label: 'Score · high → low', short: 'Score ↓',  icon: 'down',   apply: a => [...a].sort((x, y) => y.score - x.score) },
  'score-asc':  { label: 'Score · low → high', short: 'Score ↑',  icon: 'up',     apply: a => [...a].sort((x, y) => x.score - y.score) },
};

const SortIcon = ({ kind, size = 14 }) => {
  const common = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'clock')  return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 1.5"/></svg>;
  if (kind === 'down')   return <svg {...common}><path d="M4 3v10M4 13l-2-2M4 13l2-2"/><path d="M9 5h6M9 9h4M9 13h2"/></svg>;
  if (kind === 'up')     return <svg {...common}><path d="M4 13V3M4 3l-2 2M4 3l2 2"/><path d="M9 5h2M9 9h4M9 13h6"/></svg>;
  return null;
};

/* ------------------------------------------------------------------ */
/* FLIP reorder — slides cards to their new grid slots on sort change  */
/* ------------------------------------------------------------------ */
function useFlip(key) {
  const refs = useRef(new Map());
  const prev = useRef(new Map());
  const register = (id) => (el) => {
    if (el) refs.current.set(id, el); else refs.current.delete(id);
  };

  // Capture positions BEFORE paint each time key changes.
  useLayoutEffect(() => {
    const next = new Map();
    refs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      next.set(id, { x: r.left, y: r.top });
    });
    // Play: translate from old → new, then animate to 0.
    if (prev.current.size) {
      next.forEach((pos, id) => {
        const old = prev.current.get(id);
        const el = refs.current.get(id);
        if (!old || !el) return;
        const dx = old.x - pos.x;
        const dy = old.y - pos.y;
        if (dx === 0 && dy === 0) return;
        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }],
          { duration: 450, easing: 'cubic-bezier(.22,.8,.26,1)', fill: 'both' }
        );
      });
    }
    prev.current = next;
  }, [key]);

  return register;
}

/* ------------------------------------------------------------------ */
/* Asset card                                                          */
/* ------------------------------------------------------------------ */
/* Asset card — thin wrapper around <AssetTile>                        */
/* ------------------------------------------------------------------ */
// AssetTile lives in asset-tile.jsx and renders the canonical
// thumb / score-bar / MetaRow / TagsRow stack. This wrapper just
// forwards the ref so FLIP reordering still works.
const AssetCard = React.forwardRef(({ asset, dim, onAddTag, onRemoveTag, onOpen }, ref) => (
  <AssetTile
    ref={ref}
    asset={asset}
    dim={dim}
    onOpen={onOpen}
    onAddTag={onAddTag}
    onRemoveTag={onRemoveTag}
    dictionary={TAG_DICTIONARY}
  />
));

/* ------------------------------------------------------------------ */
/* Variation A — segmented bar inline with filters                     */
/* ------------------------------------------------------------------ */
const SortSegmented = ({ value, onChange }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <span className="t-xs-medium text-tertiary" style={{ textTransform: 'uppercase', letterSpacing: '.06em' }}>Sort</span>
    <div style={{
      display: 'inline-flex', padding: 2,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-secondary)',
    }}>
      {Object.entries(SORTS).map(([k, s]) => {
        const active = value === k;
        return (
          <button key={k} onClick={() => onChange(k)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 10px',
              background: active ? '#fff' : 'transparent',
              border: active ? '1px solid var(--border-secondary)' : '1px solid transparent',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              color: active ? 'var(--text-secondary)' : 'var(--text-quaternary)',
              font: 'inherit', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}>
            <SortIcon kind={s.icon} />
            {s.short}
          </button>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Variation B — dropdown menu                                         */
/* ------------------------------------------------------------------ */
const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const active = SORTS[value];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn btn--secondary btn--sm" onClick={() => setOpen(o => !o)}
        style={{ gap: 8, minWidth: 168, justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <SortIcon kind={active.icon} />
          <span className="text-quaternary" style={{ fontWeight: 500 }}>Sort:</span>
          <span>{active.short}</span>
        </span>
        <IconAt name="chevron-down.png" size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: 220,
          background: '#fff', border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 20,
        }}>
          {Object.entries(SORTS).map(([k, s]) => {
            const active = value === k;
            return (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '8px 10px', background: active ? 'var(--brand-50)' : 'transparent',
                  border: 0, color: active ? 'var(--text-brand-secondary)' : 'var(--text-secondary)',
                  font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <SortIcon kind={s.icon} size={15} />
                <span style={{ flex: 1 }}>{s.label}</span>
                {active && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 8 3.5 3.5L13 4"/></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Variation C — score ramp / timeline chrome                          */
/* ------------------------------------------------------------------ */
const SortChromePill = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const active = SORTS[value];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 32, padding: '0 12px',
          background: '#fff', border: '1px solid var(--border-primary)', borderRadius: 9999,
          boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
          font: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
        }}>
        <SortIcon kind={active.icon} />
        <span>{active.label}</span>
        <IconAt name="chevron-down.png" size={13} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 240,
          background: '#fff', border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 20,
        }}>
          {Object.entries(SORTS).map(([k, s]) => {
            const active = value === k;
            return (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '8px 10px', background: active ? 'var(--brand-50)' : 'transparent',
                  border: 0, color: active ? 'var(--text-brand-secondary)' : 'var(--text-secondary)',
                  font: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <SortIcon kind={s.icon} size={15} />
                <span style={{ flex: 1 }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Score ramp bar with histogram dots, shown above the grid when sorted by score.
const ScoreRamp = ({ assets, direction }) => {
  // Tier counts for the mini-histogram.
  const tiers = ['vlow', 'low', 'mod', 'high', 'vhigh'];
  const counts = tiers.reduce((a, t) => (a[t] = 0, a), {});
  assets.forEach(a => { counts[scoreTier(a.score)]++; });
  const max = Math.max(...Object.values(counts), 1);
  const ramp = direction === 'asc'
    ? 'linear-gradient(90deg, #D92D20 0%, #F79009 35%, #FAC515 55%, #ACE13A 75%, #17B26A 100%)'
    : 'linear-gradient(90deg, #17B26A 0%, #ACE13A 25%, #FAC515 45%, #F79009 65%, #D92D20 100%)';
  const tierLabels = direction === 'asc'
    ? ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    : ['Very High', 'High', 'Moderate', 'Low', 'Very Low'];
  const countOrder = direction === 'asc' ? tiers : [...tiers].reverse();

  return (
    <div style={{ padding: '16px 0 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* histogram dots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'end', height: 28, gap: 1 }}>
        {countOrder.map(t => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end', height: '100%' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
              {[...Array(counts[t])].map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gray-700)' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* ramp */}
      <div style={{ height: 6, background: ramp, borderRadius: 999 }} />
      {/* labels + counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 2 }}>
        {tierLabels.map((l, i) => {
          const t = countOrder[i];
          const c = counts[t];
          return (
            <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div className="t-caption text-tertiary" style={{ fontSize: 10 }}>{l}</div>
              <div className="t-caption" style={{ fontSize: 10, color: c ? 'var(--text-secondary)' : 'var(--text-disabled)', fontWeight: c ? 500 : 400 }}>{c} {c === 1 ? 'asset' : 'assets'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The grid                                                            */
/* ------------------------------------------------------------------ */
const Grid = ({ assets, sortKey, register, highlightId, onAddTag, onRemoveTag }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '32px 16px' }}>
      {assets.map(a => (
        <AssetCard key={a.id} asset={a} ref={register(a.id)}
          dim={highlightId && highlightId !== a.id}
          onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
      ))}
    </div>
  );
};

// Timeline-chrome grid (only used for Variation C, date sort).
const TimelineGrid = ({ assets, register, onAddTag, onRemoveTag }) => {
  // Bucket into groups, preserving sorted order.
  const groups = [];
  const seen = new Map();
  for (const a of assets) {
    const b = dateBucket(a.added);
    if (!seen.has(b.key)) { seen.set(b.key, { ...b, assets: [] }); groups.push(seen.get(b.key)); }
    seen.get(b.key).assets.push(a);
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {groups.map((g, gi) => (
        <div key={g.key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <div className="t-xs-semibold text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontSize: 11 }}>{g.label}</div>
            <div className="t-caption text-quaternary" style={{ marginTop: 4 }}>{g.assets.length} {g.assets.length === 1 ? 'asset' : 'assets'}</div>
            {/* vertical rail */}
            <div style={{ position: 'absolute', top: 24, right: 12, bottom: -28, width: 1, background: 'var(--border-secondary)', display: gi === groups.length - 1 ? 'none' : 'block' }} />
            <div style={{ position: 'absolute', top: 6, right: 8, width: 9, height: 9, borderRadius: '50%', background: '#fff', border: '2px solid var(--brand-800)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '28px 14px' }}>
            {g.assets.map(a => (
              <AssetCard key={a.id} asset={a} ref={register(a.id)}
                onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, {
  SORTS, SortIcon, useFlip, AssetCard, Grid, TimelineGrid,
  SortSegmented, SortDropdown, SortChromePill, ScoreRamp,
});
