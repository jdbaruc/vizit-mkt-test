// =========================================================================
// Collections page — app shell, sort wiring, tweaks
// =========================================================================
const { useState: useState_, useEffect: useEffect_, useMemo: useMemo_ } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "sortVariant": "dropdown",
  "animate": true,
  "showAIBadge": true,
  "showCardMeta": true
}/*EDITMODE-END*/;

/* ---------- Left rail ------------------------------------------------ */
const LeftRail = ({ route = '/collections', onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState_(false);
  const avatarRef = React.useRef(null);

  useEffect_(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (!avatarRef.current?.parentNode.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const navItems = [
    { icon: Icons.Home,   route: '/home' },
    { icon: Icons.Folder, route: '/library' },
    { icon: Icons.Compass,route: '/compass' },
    { icon: Icons.BarChart,route: '/analytics' },
  ];

  return (
    <aside style={{
      width: 52, background: '#fff', borderRight: '1px solid var(--border-secondary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 0', gap: 6, flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh', alignSelf: 'flex-start',
    }}>
      <div style={{ width: 28, height: 28, display: 'grid', placeItems: 'center' }}>
        <img src="assets/vizit-logo.png" alt="Vizit" style={{ width: 20, height: 'auto', display: 'block' }} />
      </div>
      <div style={{ height: 12 }} />
      <div style={{ width: 28, height: 28, background: '#e9d5f5', color: '#6b3a9a', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>Ma</div>
      <div style={{ height: 6 }} />
      {navItems.map((it, i) => {
        const active = route.startsWith(it.route);
        return (
          <button key={i} className="btn btn--ghost btn--icon btn--sm"
            onClick={() => onNavigate?.(it.route)}
            style={{ color: active ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>
            {it.icon}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative' }}>
        <button
          ref={avatarRef}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Account"
          style={{
            width: 28, height: 28, background: 'var(--brand-800)', color: '#fff',
            display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
            border: 0, cursor: 'pointer', padding: 0,
            outline: menuOpen ? '2px solid var(--brand-300)' : 'none', outlineOffset: 1,
          }}
        >J</button>
        {menuOpen && (
          <div style={{
            position: 'absolute', bottom: 0, left: 40, width: 200,
            background: '#fff', border: '1px solid var(--border-secondary)',
            boxShadow: 'var(--shadow-lg)', zIndex: 100, padding: 4,
          }}>
            <div style={{ padding: '8px 10px 6px', borderBottom: '1px solid var(--border-tertiary)', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Jordan Baruc</div>
              <div style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>jordan@hanni.co</div>
            </div>
            {[
              { label: 'Profile',  action: () => {} },
              { label: 'Settings', action: () => { onNavigate?.('/settings/tags'); setMenuOpen(false); } },
              { label: 'Help',     action: () => {} },
              { label: 'Sign out', action: () => {}, danger: true },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '7px 10px', background: 'transparent', border: 0,
                  font: 'inherit', fontSize: 13,
                  color: item.danger ? 'var(--text-error-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >{item.label}</button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

Object.assign(window, { LeftRail });

/* ---------- Header crumbs + filters ---------------------------------- */
const Crumbs = ({ onNavigate }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 24px', borderBottom: '1px solid var(--border-secondary)', fontSize: 13 }}>
    <button
      onClick={() => onNavigate && onNavigate('/library')}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        color: 'var(--text-tertiary)', font: 'inherit', fontSize: 13,
        transition: 'color .12s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
    >
      <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{Icons.Layers}</span>
      Collections
    </button>
    <span className="text-quaternary">›</span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontWeight: 500 }}>
      <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{Icons.Folder}</span>
      Test — shaving pillow shots
    </span>
  </div>
);

const FilterChip = ({ label, value }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
    <span className="text-quaternary">{label}:</span>
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 8px', background: 'var(--brand-50)',
      border: '1px solid var(--brand-200)', color: 'var(--text-brand-secondary)',
      fontWeight: 500,
    }}>
      {value}
    </span>
  </div>
);

/* ---------- Tag filter --------------------------------------------- */
// Dropdown multi-select for filtering the asset grid by tag. Mirrors the
// Tag Manager's visual language: small color dot + tag name. Selected tags
// show as removable pills on the trigger; popover lists the rest with a
// quick search input.
const TagFilter = ({ selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const allTags = (window.TAGS || []).filter(t => !t.archived);
  const filtered = allTags.filter(t => t.name.toLowerCase().includes(query.trim().toLowerCase()));
  const toggle = (name) =>
    onChange(selected.includes(name) ? selected.filter(n => n !== name) : [...selected, name]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span className="text-quaternary">Tags:</span>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 8px', background: '#fff',
          border: '1px solid var(--border-secondary)',
          color: 'var(--text-secondary)',
          font: 'inherit', fontSize: 13, cursor: 'pointer',
        }}
      >
        {selected.length === 0 ? (
          <span className="text-tertiary">Any tag</span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {selected.slice(0, 2).map(name => {
              const tag = allTags.find(t => t.name === name);
              return (
                <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: tag?.color || 'var(--gray-400)' }} />
                  <span>{name}</span>
                </span>
              );
            })}
            {selected.length > 2 && <span className="text-quaternary">+{selected.length - 2}</span>}
          </span>
        )}
        <IconAt name="chevron-down.png" size={14} style={{ color: 'var(--text-quaternary)' }} />
      </button>
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          aria-label="Clear tag filters"
          style={{
            display: 'inline-grid', placeItems: 'center',
            width: 22, height: 22, padding: 0,
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--text-quaternary)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12" transform="scale(.8) translate(1 1)"/></svg>
        </button>
      )}

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 42,
          minWidth: 260, maxWidth: 320, zIndex: 20,
          background: '#fff', border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ padding: 8, borderBottom: '1px solid var(--border-tertiary)' }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tags…"
              style={{
                width: '100%', height: 30, padding: '0 10px',
                border: '1px solid var(--border-secondary)', background: '#fff',
                font: 'inherit', fontSize: 13, outline: 'none',
              }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-quaternary)' }}>No matching tags</div>
            )}
            {filtered.map(tag => {
              const on = selected.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggle(tag.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '6px 12px',
                    background: on ? 'var(--brand-50)' : 'transparent',
                    border: 0, cursor: 'pointer', font: 'inherit', fontSize: 13,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{
                    width: 14, height: 14, border: '1px solid var(--border-secondary)',
                    background: on ? 'var(--brand-700)' : '#fff',
                    display: 'grid', placeItems: 'center',
                  }}>
                    {on && <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m3 8 3 3 7-7"/></svg>}
                  </span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{tag.name}</span>
                  <span className="t-caption text-quaternary">{tag.usage}</span>
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div style={{ padding: 8, borderTop: '1px solid var(--border-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="t-caption text-quaternary">{selected.length} selected</span>
              <button className="btn btn--ghost btn--xs" onClick={() => onChange([])}>Clear</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Upload toast -------------------------------------------- */
const UploadToast = () => {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
  <div style={{
    position: 'fixed', right: 24, bottom: 24, width: 340,
    background: '#fff', border: '1px solid var(--border-secondary)',
    boxShadow: 'var(--shadow-lg)', zIndex: 30,
  }}>
    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-tertiary)' }}>
      <div style={{ fontSize: 13, fontWeight: 500 }}>Uploaded 10 of 10 assets</div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="btn btn--ghost btn--icon btn--xs" aria-label="Collapse">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 10 5-5 5 5"/></svg>
        </button>
        <button className="btn btn--ghost btn--icon btn--xs" aria-label="Close" onClick={() => setOpen(false)}>{Icons.X}</button>
      </div>
    </div>
    <div>
      {UPLOADS.map((u, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto 20px', alignItems: 'center', gap: 10, padding: '8px 14px', borderBottom: i < UPLOADS.length - 1 ? '1px solid var(--border-tertiary)' : 0 }}>
          <div style={{ width: 20, height: 20, background: 'var(--bg-secondary)', display: 'grid', placeItems: 'center', color: 'var(--text-quaternary)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="3" width="12" height="10"/><circle cx="6" cy="7" r="1"/><path d="m2 11 3-3 3 3 2-2 4 4"/></svg>
          </div>
          <span style={{ fontSize: 13 }}>{u.name}</span>
          <span className="t-caption text-quaternary">{u.size}</span>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--success-500)', display: 'grid', placeItems: 'center', color: '#fff' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 8 3 3 7-7"/></svg>
          </span>
        </div>
      ))}
    </div>
  </div>
  );
};

/* ---------- Tweaks panel -------------------------------------------- */
const TweaksPanel = ({ open, values, onChange }) => {
  if (!open) return null;
  const set = (k, v) => onChange({ ...values, [k]: v });
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, width: 300, background: '#fff', border: '1px solid var(--border-secondary)', boxShadow: 'var(--shadow-lg)', zIndex: 60 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="t-sm-semibold">Tweaks</div>
        <div className="t-caption text-quaternary">sort explorer</div>
      </div>
      <div style={{ padding: 16, display: 'grid', gap: 16 }}>
        <div>
          <div className="t-xs-semibold text-tertiary" style={{ marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Sort UI variant</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {[
              { k: 'segmented', label: 'A — Segmented bar (inline)', sub: 'Three pill segments; mode is always visible' },
              { k: 'dropdown',  label: 'B — Dropdown menu',          sub: 'Compact; direction as a menu item' },
            ].map(o => {
              const active = values.sortVariant === o.k;
              return (
                <button key={o.k} onClick={() => set('sortVariant', o.k)}
                  style={{
                    textAlign: 'left', padding: '8px 10px',
                    background: active ? 'var(--brand-50)' : 'transparent',
                    border: active ? '1px solid var(--brand-300)' : '1px solid var(--border-secondary)',
                    cursor: 'pointer', font: 'inherit',
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--text-brand-secondary)' : 'var(--text-secondary)' }}>{o.label}</div>
                  <div className="t-caption text-quaternary" style={{ marginTop: 2 }}>{o.sub}</div>
                </button>
              );
            })}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={values.animate} onChange={e => set('animate', e.target.checked)} />
          Animate cards on reorder (FLIP)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={values.showAIBadge} onChange={e => set('showAIBadge', e.target.checked)} />
          Show AI badge on generated assets
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={values.showCardMeta} onChange={e => set('showCardMeta', e.target.checked)} />
          Show uploader &amp; timestamp on cards
        </label>
      </div>
    </div>
  );
};

/* ---------- Collections page --------------------------------------- */
function CollectionsPage({ route, onNavigate }) {
  const [tweakOpen, setTweakOpen] = useState_(false);
  const [tweaks, setTweaks] = useState_(TWEAKS_DEFAULTS);
  const [sortKey, setSortKey] = useState_('date-desc');
  const [activeTagFilters, setActiveTagFilters] = useState_([]);

  // Tag state is mutable; seed from ASSETS and keep a per-id map.
  const [assetTags, setAssetTags] = useState_(() => {
    const m = {};
    ASSETS.forEach(a => { m[a.id] = [...(a.tags || [])]; });
    return m;
  });
  const onAddTag = (id, tag) => setAssetTags(m => {
    const cur = m[id] || [];
    if (cur.includes(tag)) return m;
    return { ...m, [id]: [...cur, tag] };
  });
  const onRemoveTag = (id, tag) => setAssetTags(m => ({ ...m, [id]: (m[id] || []).filter(t => t !== tag) }));

  // Expose the union of all current tags so the picker can suggest tags that
  // users on other cards have created.
  useEffect_(() => {
    const all = new Set();
    Object.values(assetTags).forEach(list => list.forEach(t => all.add(t)));
    window.__allCollectionTags = [...all];
  }, [assetTags]);

  useEffect_(() => {
    const onMsg = (e) => {
      if (!e?.data?.type) return;
      if (e.data.type === '__activate_edit_mode')   setTweakOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Persist last sort in localStorage so refreshes don't lose the view.
  useEffect_(() => {
    const saved = localStorage.getItem('vizit.collections.sort');
    if (saved && SORTS[saved]) setSortKey(saved);
  }, []);
  useEffect_(() => { localStorage.setItem('vizit.collections.sort', sortKey); }, [sortKey]);

  // Broadcast tweaks that affect card internals (MetaRow in tags.jsx reads this)
  useEffect_(() => {
    window.__cardTweaks = {
      showCardMeta: tweaks.showCardMeta,
    };
    window.dispatchEvent(new Event('cardtweakschange'));
  }, [tweaks.showCardMeta]);

  const onTweak = (v) => {
    setTweaks(v);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: v }, '*');
  };

  // Merge live tag state into the asset list before sorting.
  const liveAssets = useMemo_(
    () => {
      const all = ASSETS.map(a => ({ ...a, tags: assetTags[a.id] || [] }));
      if (activeTagFilters.length === 0) return all;
      // AND semantics: asset must contain every selected tag.
      return all.filter(a => activeTagFilters.every(t => a.tags.includes(t)));
    },
    [assetTags, activeTagFilters]
  );
  const sorted = useMemo_(() => SORTS[sortKey].apply(liveAssets), [sortKey, liveAssets]);
  const register = useFlip(tweaks.animate ? sortKey : 'static');

  const isScore = sortKey.startsWith('score');
  const isDate  = sortKey === 'date-desc';
  const variant = tweaks.sortVariant;

  // Filter / AI badge visibility is applied globally via a CSS class on body.
  useEffect_(() => {
    document.body.classList.toggle('hide-ai-badge', !tweaks.showAIBadge);
  }, [tweaks.showAIBadge]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Crumbs onNavigate={onNavigate} />

        {/* Filter row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
          padding: '14px 24px',
          borderBottom: '1px solid var(--border-tertiary)',
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            {sorted.length} assets scored by category:
          </div>
          <FilterChip label="" value="Shaving Gels" />
          <FilterChip label="Image type" value="Carousel assets" />
          <TagFilter selected={activeTagFilters} onChange={setActiveTagFilters} />

          {/* Variation A lives inline */}
          {variant === 'segmented' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <SortSegmented value={sortKey} onChange={setSortKey} />
              <button className="btn btn--secondary btn--sm" style={{ gap: 6 }}>
                {Icons.Plus}<span>Upload assets</span>
              </button>
            </div>
          )}

          {/* Variations B & C: upload on the right, sort control sits above grid */}
          {variant !== 'segmented' && (
            <button className="btn btn--secondary btn--sm" style={{ marginLeft: 'auto', gap: 6 }}>
              {Icons.Plus}<span>Upload assets</span>
            </button>
          )}
        </div>

        {/* Sort control for B */}
        {variant === 'dropdown' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px 0' }}>
            <SortDropdown value={sortKey} onChange={setSortKey} />
          </div>
        )}

        {/* Grid */}
        <div style={{ padding: '20px 24px 80px', flex: 1 }}>
          <Grid
            assets={sorted} sortKey={sortKey} register={register}
            onAddTag={onAddTag} onRemoveTag={onRemoveTag}
          />
        </div>
      </main>

      <UploadToast />
      <TweaksPanel open={tweakOpen} values={tweaks} onChange={onTweak} />
    </div>
  );
}

/* ---------- Router (hash-based) ------------------------------------ */
function App() {
  const [route, setRoute] = useState_(() => window.location.hash.slice(1) || '/home');
  useEffect_(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || '/home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = (r) => { window.location.hash = r; setRoute(r); };

  if (route.startsWith('/settings/tags')) {
    return <TagManagerPage onBack={() => navigate('/collections')} route={route} onNavigate={navigate} />;
  }
  if (route.startsWith('/library/product-pages/')) {
    return <ProductPage route={route} onNavigate={navigate} />;
  }
  if (route.startsWith('/library/pack-designs')) {
    return <PackDesignPage route={route} onNavigate={navigate} />;
  }
  if (route.startsWith('/library/assets/')) {
    // Branch on asset class — heroes get the richer audit page.
    const assetId = route.split('/library/assets/')[1] || '';
    const tiles = typeof ASSET_TILES !== 'undefined' ? ASSET_TILES : [];
    const tile = tiles.find((a) => a.id === assetId);
    if (tile && tile.klass === 'Hero Image') {
      return <HeroDetailsPage route={route} onNavigate={navigate} />;
    }
    return <AssetDetailsPage route={route} onNavigate={navigate} />;
  }
  if (route.startsWith('/library')) {
    return <LibraryPage route={route} onNavigate={navigate} />;
  }
  if (route.startsWith('/home')) {
    return <HomePage route={route} onNavigate={navigate} />;
  }
  return <CollectionsPage route={route} onNavigate={navigate} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
