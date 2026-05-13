// =========================================================================
// Collections — tags row + inline tag editor
// =========================================================================
// Each asset card has:
//   - A compact meta row:  [avatar] Name · Added 2h ago
//   - A tag row:           [tag][tag][+ Add]
//
// The "+ Add" control reveals a ~180px popover: a small input with a
// live-filtered list of existing tags (from TAG_DICTIONARY + all tags on
// other assets), plus a "Create 'foo'" affordance when the typed value has
// no exact match. Enter / click commits. Esc / outside-click dismisses.
//
// Tags in state live on each asset via useState in the parent; the editor is
// controlled and calls onAddTag / onRemoveTag.

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useMemo: useMemoT } = React;

// Lookup the color a tag was given in the Tag Manager so chips on asset cards
// visually match the taxonomy. Falls back to undefined (→ default gray dot)
// when the tag is ad-hoc and hasn't been saved to the catalog yet.
const tagColor = (name) => {
  const src = window.TAGS || [];
  const hit = src.find(t => t.name === name);
  return hit?.color;
};

/* ---------- Avatar ---------------------------------------------------- */
const Avatar = ({ user, size = 16 }) => {
  if (!user) return null;
  if (user.isBot) {
    return (
      <span
        title={user.name}
        style={{
          width: size, height: size, flexShrink: 0,
          background: 'linear-gradient(109deg, #6941C6 0%, #E31B54 106.38%)',
          color: '#fff', display: 'inline-grid', placeItems: 'center',
          fontSize: Math.round(size * 0.5), fontWeight: 700, letterSpacing: 0,
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1.5l1.6 3.6 3.9.4-2.9 2.7.8 3.8L8 10.1 4.6 12l.8-3.8L2.5 5.5l3.9-.4L8 1.5z"/>
        </svg>
      </span>
    );
  }
  return (
    <span
      title={user.name}
      style={{
        width: size, height: size, flexShrink: 0,
        background: user.color, color: '#fff',
        display: 'inline-grid', placeItems: 'center',
        fontSize: Math.round(size * 0.45), fontWeight: 600, letterSpacing: 0.2,
      }}
    >
      {user.initials}
    </span>
  );
};

/* ---------- Meta row (uploader + date) ------------------------------- */
/* ---------- Meta row (uploader + date) ------------------------------- */
// Reads optional tweak flags from window.__cardTweaks so the Collections
// "Tweaks" panel can toggle the uploader name / timestamp on and off.
const MetaRow = ({ asset }) => {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const handler = () => force();
    window.addEventListener('cardtweakschange', handler);
    return () => window.removeEventListener('cardtweakschange', handler);
  }, []);
  const tweaks = window.__cardTweaks || {};
  const show = tweaks.showCardMeta !== false;
  if (!show) return null;
  const user = USERS[asset.uploader];
  const verbed = asset.origin === 'generated' ? 'Generated' : 'Added';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 11, color: 'var(--text-tertiary)',
      lineHeight: 1.2, minWidth: 0,
    }}>
      <span style={{
        fontWeight: 500, color: 'var(--text-secondary)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{user?.name}</span>
      <span className="text-quaternary" aria-hidden>·</span>
      <span style={{ whiteSpace: 'nowrap' }}>{verbed} {relativeDate(asset.added)}</span>
    </div>
  );
};

/* ---------- Tag chip -------------------------------------------------- */
// Fixed footprint. The chip's width is driven by its label; it does NOT grow
// when hovered. Instead the × is absolutely positioned over the right edge
// and a short fade mask occludes the last ~14px of label behind it, so long
// labels visually truncate under the × without reflowing the chip.
const TagChip = ({ label, color, onRemove }) => {
  const [hover, setHover] = useStateT(false);
  const bg = hover ? 'var(--brand-50)' : 'var(--bg-secondary)';
  // When a specific tag color is passed, use it for the leading dot so the
  // chip visually matches what the user set in the Tag Manager. Fall back to
  // the old brand/gray hover treatment otherwise.
  const dotColor = color || (hover ? 'var(--brand-500)' : 'var(--gray-400)');
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        height: 22, padding: '0 9px',
        background: bg,
        border: '1px solid',
        borderColor: hover ? 'var(--brand-200)' : 'var(--border-secondary)',
        color: hover ? 'var(--text-brand-secondary)' : 'var(--text-secondary)',
        fontSize: 11, fontWeight: 500, lineHeight: 1, letterSpacing: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        transition: 'background .15s, border-color .15s, color .15s',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6, height: 6, flexShrink: 0,
          background: dotColor,
          borderRadius: '50%',
          transition: 'background .15s',
        }}
      />
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
      {onRemove && (
        <>
          {/* Fade mask — same color as the chip background, covers the
              last ~18px under the × on hover. */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 1, bottom: 1, right: 1, width: 22,
              background: `linear-gradient(90deg, transparent 0%, ${hover ? 'var(--brand-50)' : 'var(--bg-secondary)'} 55%)`,
              opacity: hover ? 1 : 0,
              transition: 'opacity .15s',
              pointerEvents: 'none',
            }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label={`Remove tag ${label}`}
            style={{
              position: 'absolute',
              top: '50%', right: 4,
              transform: 'translateY(-50%)',
              display: 'inline-grid', placeItems: 'center',
              width: 14, height: 14,
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'var(--text-quaternary)',
              opacity: hover ? 1 : 0,
              pointerEvents: hover ? 'auto' : 'none',
              transition: 'opacity .15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-quaternary)'}
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l6 6M9 3l-6 6"/>
            </svg>
          </button>
        </>
      )}
    </span>
  );
};

/* ---------- "+ Add" control (icon only, quiet) ----------------------- */
const AddPill = React.forwardRef(({ onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    aria-label="Add tag"
    title="Add tag"
    style={{
      display: 'inline-grid', placeItems: 'center',
      width: 22, height: 22, flexShrink: 0,
      background: 'transparent',
      border: '1px solid transparent',
      color: 'var(--text-quaternary)',
      cursor: 'pointer', font: 'inherit',
      transition: 'color .12s, background .12s, border-color .12s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--text-brand-secondary)';
      e.currentTarget.style.background = 'var(--brand-50)';
      e.currentTarget.style.borderColor = 'var(--brand-200)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--text-quaternary)';
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'transparent';
    }}
  >
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 2v8M2 6h8"/>
    </svg>
  </button>
));

/* ---------- Inline Tag Picker ---------------------------------------- */
// Positioned relative to the button that opens it. Shows an input + filtered
// list of suggestions; Up/Down to navigate, Enter to pick, Esc to close.
const TagPicker = ({ anchorRef, existingTags, dictionary, onPick, onClose }) => {
  const [query, setQuery] = useStateT('');
  const [hoverIdx, setHoverIdx] = useStateT(0);
  const inputRef = useRefT(null);
  const popRef = useRefT(null);

  useEffectT(() => { inputRef.current?.focus(); }, []);

  useEffectT(() => {
    const onDoc = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (anchorRef.current?.contains(e.target)) return;
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

  // Compose the suggestion list: dictionary ∪ tags used elsewhere, minus any
  // already on this asset, filtered by query, capped at 6 rows.
  const suggestions = useMemoT(() => {
    const existing = new Set(existingTags.map(t => t.toLowerCase()));
    const pool = new Set([...(dictionary || []), ...(window.__allCollectionTags || [])]);
    const q = query.trim().toLowerCase();
    const list = [...pool]
      .filter(t => !existing.has(t.toLowerCase()))
      .filter(t => !q || t.toLowerCase().includes(q))
      .sort((a, b) => {
        if (!q) return a.localeCompare(b);
        const aS = a.toLowerCase().startsWith(q) ? 0 : 1;
        const bS = b.toLowerCase().startsWith(q) ? 0 : 1;
        return aS - bS || a.localeCompare(b);
      })
      .slice(0, 6);
    return list;
  }, [query, existingTags, dictionary]);

  const qTrim = query.trim();
  const exactInPool = suggestions.some(t => t.toLowerCase() === qTrim.toLowerCase());
  const alreadyHas  = existingTags.some(t => t.toLowerCase() === qTrim.toLowerCase());
  const canCreate   = qTrim.length > 0 && !exactInPool && !alreadyHas;

  // Combined row list: suggestions + an optional "Create" row.
  const rows = [
    ...suggestions.map(t => ({ type: 'existing', value: t })),
    ...(canCreate ? [{ type: 'create', value: qTrim }] : []),
  ];

  useEffectT(() => { setHoverIdx(0); }, [query]);

  const commit = (row) => {
    if (!row) return;
    onPick(row.value);
    setQuery('');
    // keep open so the user can add several in a row
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHoverIdx(i => Math.min(i + 1, rows.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHoverIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = rows[hoverIdx] || (qTrim && canCreate ? { type: 'create', value: qTrim } : null);
      commit(pick);
    } else if (e.key === 'Backspace' && query === '' && existingTags.length) {
      // fast remove: backspace on empty input removes the last tag
      e.preventDefault();
      onPick({ __remove: existingTags[existingTags.length - 1] });
    } else if (e.key === ',' || (e.key === 'Tab' && qTrim)) {
      if (canCreate || exactInPool) {
        e.preventDefault();
        const match = suggestions.find(t => t.toLowerCase() === qTrim.toLowerCase());
        commit(match ? { type: 'existing', value: match } : { type: 'create', value: qTrim });
      }
    }
  };

  return (
    <div
      ref={popRef}
      role="dialog"
      aria-label="Add tag"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)', left: 0,
        minWidth: 200, maxWidth: 240,
        background: '#fff',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 40,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: 6, borderBottom: '1px solid var(--border-tertiary)' }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value.replace(/\s+/g, '-'))}
          onKeyDown={onKeyDown}
          placeholder="Search or create tag…"
          style={{
            width: '100%', height: 28, padding: '0 8px',
            border: '1px solid var(--border-secondary)', background: '#fff',
            font: 'inherit', fontSize: 12, color: 'var(--text-primary)',
            outline: 'none',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-brand)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
        />
      </div>
      <div style={{ padding: 4, maxHeight: 220, overflow: 'auto' }}>
        {rows.length === 0 && (
          <div className="t-caption text-quaternary" style={{ padding: '8px 10px', fontSize: 11 }}>
            {qTrim ? 'Already on this asset' : 'Type to search or create'}
          </div>
        )}
        {rows.map((row, i) => {
          const active = i === hoverIdx;
          if (row.type === 'existing') {
            return (
              <button
                key={`ex-${row.value}`}
                type="button"
                onMouseEnter={() => setHoverIdx(i)}
                onClick={() => commit(row)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '6px 8px', border: 0,
                  background: active ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-secondary)',
                  font: 'inherit', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 1H2v10h8V4zM7 1v3h3"/>
                </svg>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.value}</span>
              </button>
            );
          }
          return (
            <button
              key="create"
              type="button"
              onMouseEnter={() => setHoverIdx(i)}
              onClick={() => commit(row)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '6px 8px', border: 0,
                background: active ? 'var(--brand-50)' : 'transparent',
                color: 'var(--text-brand-secondary)',
                font: 'inherit', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 2v8M2 6h8"/>
              </svg>
              <span style={{ flex: 1 }}>
                Create <span style={{ color: 'var(--brand-900)' }}>“{row.value}”</span>
              </span>
            </button>
          );
        })}
      </div>
      <div style={{
        padding: '6px 10px', borderTop: '1px solid var(--border-tertiary)',
        display: 'flex', gap: 10, fontSize: 10, color: 'var(--text-quaternary)',
        fontFamily: 'var(--font-mono)',
      }}>
        <span><kbd style={kbdStyle}>↵</kbd> add</span>
        <span><kbd style={kbdStyle}>esc</kbd> close</span>
      </div>
    </div>
  );
};

const kbdStyle = {
  display: 'inline-block',
  padding: '1px 4px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-secondary)',
  fontFamily: 'inherit', fontSize: 10,
  color: 'var(--text-tertiary)',
};

/* ---------- Tags row (the thing the user sees on the card) ----------- */
const TagsRow = ({ tags, onAdd, onRemove, dictionary }) => {
  const [open, setOpen] = useStateT(false);
  const anchorRef = useRefT(null);

  const handlePick = (value) => {
    if (value && typeof value === 'object' && value.__remove) {
      onRemove(value.__remove);
      return;
    }
    if (value) onAdd(value);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', minHeight: 22 }}>
        {tags.map(t => (
          <TagChip key={t} label={t} color={tagColor(t)} onRemove={() => onRemove(t)} />
        ))}
        <AddPill ref={anchorRef} onClick={() => setOpen(v => !v)} />
      </div>
      {open && (
        <TagPicker
          anchorRef={anchorRef}
          existingTags={tags}
          dictionary={dictionary}
          onPick={handlePick}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

Object.assign(window, { Avatar, MetaRow, TagChip, AddPill, TagPicker, TagsRow });
