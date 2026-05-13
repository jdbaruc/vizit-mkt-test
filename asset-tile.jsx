// =========================================================================
// AssetTile — single-asset card used in the Library Assets grid and the
// Collections detail grid.
// =========================================================================
// This is the pattern that already ships in the app today, lifted into a
// shared component:
//
//   ┌──────────────────────┐
//   │       thumb          │   square, click-through; optional AI badge
//   │                  AI  │
//   ├──────────────────────┤
//   │ ▓▓▓▓▓░░░░     score  │   score-bar (existing component)
//   ├──────────────────────┤
//   │ Asset class · meta   │   MetaRow (from tags.jsx)
//   │ • tag • tag • +      │   TagsRow (editable)
//   └──────────────────────┘
//
// All visual styling is reused from existing classes (.score-bar, .badge,
// MetaRow, TagsRow). No new modifiers or states — this is just a wrapper
// around the existing pattern.
// =========================================================================

const AssetTile = React.forwardRef(({
  asset,                   // { id, thumb, score, klass?, origin?, tags?, ... }
  dim = false,             // dimmed state (used by sort filters / search)
  onOpen,                  // (asset) => void
  onAddTag,                // (id, tag) => void
  onRemoveTag,             // (id, tag) => void
  dictionary,              // tag dictionary for the picker
  thumb,                   // optional override JSX (defaults to <Thumb kind={asset.thumb} />)
}, ref) => {
  const tier = (typeof scoreTier === 'function') ? scoreTier(asset.score) : 'mod';

  const handleOpen = () => {
    if (onOpen) return onOpen(asset);
    if (typeof window !== 'undefined') window.location.hash = `#/library/assets/${asset.id}`;
  };

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        opacity: dim ? 0.35 : 1,
        transition: 'opacity .3s',
      }}
    >
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
        }}
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: '#eee',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {thumb || <Thumb kind={asset.thumb} />}
        {asset.origin === 'generated' && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span className="badge badge--slot badge--sm" style={{ gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1l1.8 4.2L14 7l-4.2 1.8L8 13l-1.8-4.2L2 7l4.2-1.8L8 1z" />
              </svg>
              AI
            </span>
          </div>
        )}
      </div>

      {asset.score != null && (
        <div className={`score-bar score-bar--${tier}`}>
          <span className="score-bar__label">{asset.score}</span>
          <div className="score-bar__track">
            <div className="score-bar__fill" style={{ width: `${asset.score}%` }} />
          </div>
        </div>
      )}

      {typeof MetaRow === 'function' && asset.uploader && <MetaRow asset={asset} />}

      {typeof TagsRow === 'function' && (
        <TagsRow
          tags={asset.tags || []}
          onAdd={(t) => onAddTag?.(asset.id, t)}
          onRemove={(t) => onRemoveTag?.(asset.id, t)}
          dictionary={dictionary}
        />
      )}
    </div>
  );
});

Object.assign(window, { AssetTile });
