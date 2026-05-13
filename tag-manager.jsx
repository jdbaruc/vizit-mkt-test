// =========================================================================
// Tag Manager — page
// =========================================================================
// Renders at /#/settings/tags. Flat list of tags, split by type:
//   · All  — every tag regardless of source
//   · User — human-created tags (editable, archivable)
//   · System — auto-applied by Vizit; read-only; shown with a carousel hero
//   · Archived — user tags that have been taken out of circulation
// Plus a creator dropdown filter and free-text search.

const { useState: useSt, useMemo: useMe, useEffect: useEf, useRef: useRf } = React;

const CREATORS = [
  { id: 'all', name: 'All creators' },
  { id: 'rob', name: 'Rob McDonald' },
  { id: 'jb',  name: 'Jonathan Baruc' },
  { id: 'ali', name: 'Ali Urbon' },
  { id: 'sg',  name: 'Sean Graham' },
];

// Deterministically assign a creator to each tag so the dropdown filter
// actually changes the set. Avoids adding another field to seed data.
function creatorFor(tag) {
  const ids = ['rob', 'jb', 'ali', 'sg'];
  const hash = [...tag.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return ids[hash % ids.length];
}
function creatorName(id) {
  return CREATORS.find(c => c.id === id)?.name || '—';
}

/* ---------- Settings breadcrumb ------------------------------------- */
const SettingsCrumbs = ({ onBack }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 48, padding: '0 20px', borderBottom: '1px solid var(--border-secondary)' }}>
    <button
      type="button"
      className="breadcrumb-btn"
      onClick={onBack}
      onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}
    >
      <span className="breadcrumb-btn__label">Settings</span>
      <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
    </button>
    <button
      type="button"
      className="breadcrumb-btn breadcrumb-btn--active"
      onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}
    >
      <span className="breadcrumb-btn__label">Tags</span>
    </button>
  </div>
);

/* ---------- Tag row ------------------------------------------------- */
const TagRow = ({ tag, selected, onToggle, onEdit, onMenu, active }) => (
  <tr
    onClick={() => onEdit(tag)}
    style={{
      borderTop: '1px solid var(--border-tertiary)',
      cursor: 'pointer',
      background: active ? 'var(--bg-secondary)' : selected ? 'var(--brand-50)' : undefined,
      borderLeft: active ? '2px solid var(--brand-800)' : '2px solid transparent',
      opacity: tag.archived ? 0.6 : 1,
    }}
    onMouseEnter={(e) => { if (!active && !selected) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
    onMouseLeave={(e) => { if (!active && !selected) e.currentTarget.style.background = ''; }}
  >
    <td style={{ padding: '0 10px 0 14px', width: 32 }} onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={selected} onChange={() => onToggle(tag.id)} />
    </td>
    <td style={{ padding: '12px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{tag.name}</span>
        {tag.archived && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.04em',
            padding: '1px 5px', background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
            color: 'var(--text-quaternary)',
          }}>ARCHIVED</span>
        )}
        {tag.description && (
          <span style={{ fontSize: 12, color: 'var(--text-quaternary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            · {tag.description}
          </span>
        )}
      </div>
    </td>
    <td style={{ padding: '12px 10px', fontSize: 12, color: 'var(--text-tertiary)' }}>
      {tag.source === 'system' ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-800)' }} />
          Vizit (system)
        </span>
      ) : creatorName(tag.__creator)}
    </td>
    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
      {tag.usage.toLocaleString()}
    </td>
    <td style={{ padding: '12px 14px 12px 10px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
      <button className="btn btn--ghost btn--icon btn--xs" onClick={(e) => onMenu(tag, e.currentTarget.getBoundingClientRect())} aria-label="Row actions">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="13" cy="8" r="1.3"/></svg>
      </button>
    </td>
  </tr>
);

/* ---------- Row actions menu popover ------------------------------- */
// Appears anchored to the three-dot button on any tag row.
const RowMenu = ({ tag, anchorRect, onClose, onEdit, onArchive, onDelete }) => {
  const menuRef = React.useRef(null);
  useEf(() => {
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  if (!anchorRect) return null;
  const top = anchorRect.bottom + 4;
  const right = window.innerWidth - anchorRect.right;
  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      role="menu"
      style={{
        position: 'fixed', top, right, zIndex: 50,
        minWidth: 168, background: '#fff',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-lg)', padding: 4,
      }}
    >
      <MenuItem onClick={() => { onEdit(tag); onClose(); }}>Edit tag</MenuItem>
      <MenuItem onClick={() => { onArchive(tag); onClose(); }}>
        {tag.archived ? 'Unarchive' : 'Archive'}
      </MenuItem>
      <div style={{ height: 1, background: 'var(--border-tertiary)', margin: '4px 0' }} />
      <MenuItem danger onClick={() => { onDelete(tag); onClose(); }}>Delete tag</MenuItem>
    </div>,
    document.body
  );
};

const MenuItem = ({ children, onClick, danger }) => (
  <button
    role="menuitem"
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', width: '100%',
      padding: '8px 10px', border: 0, background: 'transparent',
      font: 'inherit', fontSize: 13, textAlign: 'left', cursor: 'pointer',
      color: danger ? '#b42318' : 'var(--text-secondary)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    {children}
  </button>
);

/* ---------- Tag table ---------------------------------------------- */
// `scope` is accepted so future variants (e.g. hide-creator on system tab)
// can read it without prop drilling further.
const TagTable = ({ tags, selectedIds, onToggle, onToggleAll, onEdit, onMenu, activeId, scope }) => {
  const allSelected = tags.length > 0 && tags.every(t => selectedIds.has(t.id));
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ background: 'var(--bg-secondary)' }}>
          <th style={{ padding: '10px 10px 10px 14px', width: 32, textAlign: 'left' }}>
            <input type="checkbox" checked={allSelected} onChange={() => onToggleAll(!allSelected)} />
          </th>
          {['Tag','Creator','Usage',''].map((h, i) => (
            <th key={h || i} style={{
              padding: '10px', textAlign: i === 2 ? 'right' : 'left',
              fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '.04em',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tags.map(t => (
          <TagRow key={t.id} tag={t}
            selected={selectedIds.has(t.id)}
            active={activeId === t.id}
            onToggle={onToggle}
            onEdit={onEdit}
            onMenu={onMenu} />
        ))}
      </tbody>
    </table>
  );
};

/* ---------- Empty state -------------------------------------------- */
const EmptyState = ({ title, subtitle, cta, onCta }) => (
  <div style={{ padding: '80px 24px', textAlign: 'center' }}>
    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 380, margin: '0 auto 16px' }}>{subtitle}</div>
    {cta && <button className="btn btn--primary btn--sm" onClick={onCta}>{cta}</button>}
  </div>
);

/* ---------- Small inline switch (modal-local) --------------------- */
const SwitchTM = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={(e) => { e.preventDefault(); onChange(!checked); }}
    style={{
      width: 34, height: 20, padding: 0, border: 0, cursor: 'pointer',
      background: checked ? 'var(--brand-800)' : 'var(--border-secondary)',
      borderRadius: 999, position: 'relative', transition: 'background .15s',
      flexShrink: 0,
    }}
  >
    <span style={{
      position: 'absolute', top: 2, left: checked ? 16 : 2,
      width: 16, height: 16, background: '#fff', borderRadius: '50%',
      boxShadow: '0 1px 2px rgba(0,0,0,.2)',
      transition: 'left .15s',
    }} />
  </button>
);

/* ---------- Edit modal --------------------------------------------- */
// Centered modal (see design system .dialog) — replaces the right-side
// drawer so tag editing feels like the product's other create/edit flows.
const EditModal = ({ tag, isNew, onClose, onSave, onArchive, onDelete }) => {
  const [draft, setDraft] = useSt(() => tag || {
    name: '', color: TAG_SWATCHES[0].value, description: '', usage: 0, source: 'user',
  });
  // Hidden by default on edit unless the tag already has a description.
  // On create, default to shown so the user can set color up front.
  const [showDetails, setShowDetails] = useSt(() => isNew || !!(tag?.description));

  useEf(() => {
    setDraft(tag || { name: '', color: TAG_SWATCHES[0].value, description: '', usage: 0, source: 'user' });
    setShowDetails(isNew || !!(tag?.description));
  }, [tag?.id, isNew]);

  // Esc to close
  useEf(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return ReactDOM.createPortal(
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="dialog__head">
          <div>
            <h2 className="dialog__title">{isNew ? 'Create new tag' : 'Edit tag'}</h2>
            <p className="dialog__subtitle">
              {isNew
                ? 'Tags help organize your assets and make them searchable across the catalog.'
                : 'Update this tag\u2019s name, color, or description. Changes propagate everywhere it\u2019s applied.'}
            </p>
          </div>
          <button className="btn btn--ghost btn--icon btn--sm" onClick={onClose} aria-label="Close">{Icons.X}</button>
        </div>

        <div className="dialog__body">
          <div className="field">
            <label className="field__label">Name <span style={{ color: 'var(--text-brand-secondary)' }}>*</span></label>
            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* color swatch dot before the name input so the tag still has a visible color cue even when the picker is hidden */}
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: draft.color, flexShrink: 0, marginLeft: 2 }} aria-hidden />
              <input
                value={draft.name}
                onChange={(e) => set('name', e.target.value.slice(0, 40))}
                placeholder="e.g. holiday-2025"
                style={{ flex: 1 }}
              />
            </div>
            <div className="field__hint">{40 - (draft.name?.length || 0)} characters remaining</div>
          </div>

          {/* Toggle row — shows/hides the color picker + description field */}
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-tertiary)',
            cursor: 'pointer', userSelect: 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Color &amp; description</span>
              <span className="t-caption text-quaternary">Add a swatch color and short description to help teammates understand this tag.</span>
            </div>
            <SwitchTM checked={showDetails} onChange={setShowDetails} />
          </label>

          {showDetails && (
            <React.Fragment>
              <div className="field">
                <label className="field__label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TAG_SWATCHES.map(s => {
                    const active = draft.color === s.value;
                    return (
                      <button key={s.name} onClick={() => set('color', s.value)}
                        style={{
                          width: 28, height: 28, padding: 0,
                          background: s.value, border: 0, cursor: 'pointer',
                          outline: active ? '2px solid var(--brand-800)' : '1px solid rgba(0,0,0,.1)',
                          outlineOffset: active ? 2 : 0,
                        }} aria-label={s.name} />
                    );
                  })}
                </div>
              </div>

              <div className="field">
                <label className="field__label">Description</label>
                <textarea value={draft.description || ''} onChange={(e) => set('description', e.target.value)} rows={3}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid var(--border-secondary)', background: '#fff',
                    font: 'inherit', fontSize: 'var(--text-sm)', resize: 'vertical', outline: 'none',
                  }} />
                <div className="field__hint">Shown as a tooltip in tag pickers.</div>
              </div>
            </React.Fragment>
          )}

          {!isNew && (
            <div style={{ padding: '14px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-tertiary)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                {draft.usage.toLocaleString()} assets · {Math.floor((draft.usage || 0) * 0.12)} PDPs · {Math.floor((draft.usage || 0) * 0.03)} collections
              </div>
              <div className="t-caption text-quaternary" style={{ marginTop: 4 }}>
                This tag is applied across your catalog. Renaming will propagate to all uses.
              </div>
            </div>
          )}

          {!isNew && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              paddingTop: 12,
              borderTop: '1px solid var(--border-tertiary)',
            }}>
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => onArchive?.(draft)}
                title={draft.archived ? 'Restore this tag to active use' : "Archived tags stay searchable but don't appear in pickers"}
              >
                {draft.archived ? 'Unarchive tag' : 'Archive tag'}
              </button>
              <button
                className="btn btn--secondary btn--sm"
                onClick={() => onDelete?.(draft)}
                style={{ color: '#b42318', borderColor: 'rgba(180,35,24,0.25)' }}
                title={`Removes this tag from ${draft.usage.toLocaleString()} assets`}
              >
                Delete tag
              </button>
              <span className="t-caption text-quaternary" style={{ marginLeft: 'auto' }}>
                {draft.archived ? 'Archived — hidden from pickers' : `Applied to ${draft.usage.toLocaleString()} assets`}
              </span>
            </div>
          )}
        </div>

        <div className="dialog__foot">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" disabled={!draft.name} onClick={() => onSave(draft)}>
            {isNew ? 'Create tag' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ---------- Bulk action bar ---------------------------------------- */
const BulkBar = ({ count, onClear }) => (
  <div style={{
    position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
    background: 'var(--brand-900)', color: '#fff',
    display: 'flex', alignItems: 'center', gap: 14, padding: '8px 10px 8px 16px',
    boxShadow: 'var(--shadow-lg)', zIndex: 15,
  }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{count} tag{count === 1 ? '' : 's'} selected</span>
    <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,.15)' }} />
    <button className="btn btn--ghost btn--xs" style={{ color: '#fff' }}>Archive</button>
    <button className="btn btn--ghost btn--xs" style={{ color: '#fff' }}>Delete</button>
    <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,.15)' }} />
    <button className="btn btn--ghost btn--xs" style={{ color: '#fff' }} onClick={onClear}>Clear</button>
  </div>
);

/* ---------- Tabs (left-aligned) ------------------------------------- */
const Tabs = ({ value, onChange, counts }) => {
  const items = [
    { k: 'all',      label: 'All tags', count: counts.all },
    { k: 'user',     label: 'User',     count: counts.user },
    { k: 'system',   label: 'System',   count: counts.system },
    { k: 'archived', label: 'Archived', count: counts.archived },
  ];
  return (
    <div style={{ display: 'inline-flex', gap: 2, borderBottom: '1px solid var(--border-tertiary)', marginBottom: -1 }}>
      {items.map(it => {
        const active = value === it.k;
        return (
          <button key={it.k} onClick={() => onChange(it.k)}
            style={{
              height: 36, padding: '0 12px', background: 'transparent', border: 0,
              borderBottom: active ? '2px solid var(--brand-800)' : '2px solid transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
              font: 'inherit', fontSize: 13, fontWeight: active ? 600 : 500,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: -1,
            }}>
            {it.label}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              padding: '1px 6px',
              background: active ? 'var(--brand-50)' : 'var(--bg-secondary)',
              color: active ? 'var(--text-brand-secondary)' : 'var(--text-quaternary)',
            }}>{it.count}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ---------- Page --------------------------------------------------- */
function TagManagerPage({ onBack, route, onNavigate }) {
  // Seed creator assignment onto every tag record (system tags get 'Vizit'
  // which isn't in the human-creator dropdown \u2014 handled in the row cell).
  const [tags, setTags] = useSt(() =>
    TAGS.map(t => ({ ...t, __creator: t.source === 'system' ? 'vizit' : creatorFor(t) }))
  );
  const [scope, setScope]     = useSt('user');       // tabs: all | user | system | archived
  const [creator, setCreator] = useSt('all');
  const [query, setQuery]     = useSt('');
  const [sort, setSort]       = useSt({ col: 'name', dir: 'asc' });
  const [selected, setSelected] = useSt(() => new Set());
  const [editing, setEditing]   = useSt(null);
  const [rowMenu, setRowMenu]   = useSt(null); // { tag, rect }

  const counts = useMe(() => ({
    all:      tags.filter(t => !t.archived).length,
    user:     tags.filter(t => t.source !== 'system' && !t.archived).length,
    system:   tags.filter(t => t.source === 'system' && !t.archived).length,
    archived: tags.filter(t => t.archived).length,
  }), [tags]);

  const visible = useMe(() => {
    let list = tags.slice();
    if (scope === 'archived') list = list.filter(t => t.archived);
    else if (scope === 'user')    list = list.filter(t => t.source !== 'system' && !t.archived);
    else if (scope === 'system')  list = list.filter(t => t.source === 'system' && !t.archived);
    else                           list = list.filter(t => !t.archived); // 'all'
    if (creator !== 'all') list = list.filter(t => t.__creator === creator);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (sort.col === 'usage') return (b.usage - a.usage) * dir;
      return a.name.localeCompare(b.name) * dir;
    });
    return list;
  }, [tags, scope, creator, query, sort]);

  const toggleOne = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = (on) => setSelected(on ? new Set(visible.map(t => t.id)) : new Set());

  const onSave = (draft) => {
    setTags(ts => {
      if (editing.isNew) {
        const id = 't' + (Math.random() * 1e6 | 0);
        return [{ ...draft, id, __creator: 'jb', updated: '0s', created: '0s' }, ...ts];
      }
      return ts.map(t => t.id === draft.id ? { ...t, ...draft, updated: '0s' } : t);
    });
    setEditing(null);
  };
  const onArchive = (draft) => {
    setTags(ts => ts.map(t => t.id === draft.id ? { ...t, archived: !t.archived } : t));
    setEditing(null);
  };
  const onDelete = (draft) => {
    setTags(ts => ts.filter(t => t.id !== draft.id));
    setEditing(null);
  };

  const isEmpty = visible.length === 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route || '/settings/tags'} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <SettingsCrumbs onBack={onBack} />

        {/* Title + description */}
        <div style={{ padding: '28px 28px 16px' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 32, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-primary)' }}>Tags</h1>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, maxWidth: 560 }}>
            Create, organize, and clean up tags used across your catalog.
          </div>
        </div>

        {/* Toolbar: tabs left · search / creator / new-tag right */}
        <div style={{
          padding: '0 28px',
          borderBottom: '1px solid var(--border-tertiary)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
        }}>
          <Tabs value={scope} onChange={setScope} counts={counts} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-quaternary)', display: 'flex' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5"/><path d="m11 11 3 3"/></svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${tags.length} tags…`}
                style={{ width: 240, height: 32, padding: '0 10px 0 30px', border: '1px solid var(--border-secondary)', background: '#fff', font: 'inherit', fontSize: 13, outline: 'none' }}
              />
            </div>

            {/* Creator dropdown — user/all/archived only; system tags are
                all authored by Vizit so the filter would be a no-op. */}
            {scope !== 'system' && (
              <div style={{ position: 'relative' }}>
              <select
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                style={{
                  height: 32, padding: '0 28px 0 10px',
                  border: '1px solid var(--border-secondary)', background: '#fff',
                  font: 'inherit', fontSize: 13, color: 'var(--text-secondary)',
                  appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                  cursor: 'pointer',
                }}
              >
                {CREATORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-quaternary)', pointerEvents: 'none', display: 'flex' }}>
                <IconAt name="chevron-down.png" size={12} />
              </span>
            </div>
            )}

            <button className="btn btn--primary btn--sm" style={{ gap: 6, visibility: scope === 'system' ? 'hidden' : 'visible' }} onClick={() => setEditing({ tag: null, isNew: true })}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
              New tag
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {isEmpty ? (
              query ? (
                <EmptyState title={`No tags match “${query}”.`} subtitle={scope === 'system' ? 'System tags are auto-applied by Vizit; you can’t create new ones.' : 'Try a different search, or create a new tag with this name.'}
                  cta={scope === 'system' ? null : `Create tag "${query}"`} onCta={() => setEditing({ tag: { name: query }, isNew: true })} />
              ) : scope === 'archived' ? (
                <EmptyState title="No archived tags." subtitle="Tags you archive will show up here. They stay searchable but won't appear in pickers." />
              ) : scope === 'system' ? (
                <EmptyState title="No system tags match this filter." subtitle="System tags are applied automatically by Vizit as assets are ingested." />
              ) : (
                <EmptyState title="No tags yet." subtitle="Tags are how you organize assets across the catalog."
                  cta="Create your first tag" onCta={() => setEditing({ tag: null, isNew: true })} />
              )
            ) : (
              <TagTable tags={visible}
                selectedIds={selected} onToggle={toggleOne} onToggleAll={toggleAll}
                onEdit={(t) => setEditing({ tag: t, isNew: false })}
                onMenu={(tag, rect) => setRowMenu({ tag, rect })}
                activeId={editing && !editing.isNew ? editing.tag?.id : null}
                scope={scope}
              />
            )}
          </div>

          {selected.size > 0 && <BulkBar count={selected.size} onClear={() => setSelected(new Set())} />}

          {editing && (
            <EditModal
              tag={editing.tag}
              isNew={editing.isNew}
              onClose={() => setEditing(null)}
              onSave={onSave}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          )}

          {rowMenu && (
            <RowMenu
              tag={rowMenu.tag}
              anchorRect={rowMenu.rect}
              onClose={() => setRowMenu(null)}
              onEdit={(t) => setEditing({ tag: t, isNew: false })}
              onArchive={(t) => onArchive(t)}
              onDelete={(t) => onDelete(t)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { TagManagerPage });
