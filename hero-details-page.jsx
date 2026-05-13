// =========================================================================
// HeroDetailsPage — top-level page for /library/assets/:id when the asset's
// klass === 'Hero Image'. Composes the breadcrumb, header, body grid,
// footer strip, and readability table from hero-page.jsx primitives.
// =========================================================================

const { useState: useStateHA } = React;

function HeroDetailsPage({ route, onNavigate }) {
  const id = (route || '').split('/library/assets/')[1] || '';
  const tiles = typeof ASSET_TILES !== 'undefined' ? ASSET_TILES : [];
  const tile = tiles.find((a) => a.id === id) || tiles[0] || {};

  // Resolve a hero-shaped asset object. Falls back to the Fruity Pebbles
  // canonical example so the page always has a coherent story when no
  // hero tile is wired up.
  const asset = {
    id: tile.id || id,
    file: tile.file || 'fruity_pebbles_hero.jpg',
    score: tile.score != null ? tile.score : 71,
    category: tile.category || 'Cereal',
    placement: 'Carousel pos 1',
    thumb: tile.thumb,
    label: tile.label || 'Fruity PEBBLES cereal hero image'
  };

  const [previewTab, setPreviewTab] = useStateHA('Original');
  const [hoverId, setHoverId] = useStateHA(null);

  return (
    <div style={{ display: 'flex', background: '#fff', minHeight: '100vh' }}>
      <LeftRail route={route} onNavigate={onNavigate} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>
        {/* Breadcrumb — Library › Assets › <file> (matches regular asset details) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          height: 48, padding: '0 20px',
          borderBottom: '1px solid var(--border-secondary)',
          background: '#fff'
        }}>
          <button
            type="button"
            className="breadcrumb-btn"
            onClick={() => onNavigate && onNavigate('/library')}
            onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
            <span className="breadcrumb-btn__icon">{Icons.Folder}</span>
            <span className="breadcrumb-btn__label">Library</span>
            <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
          </button>
          <button
            type="button"
            className="breadcrumb-btn"
            onClick={() => onNavigate && onNavigate('/library/assets')}
            onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
            <span className="breadcrumb-btn__label">Assets</span>
            <span className="breadcrumb-btn__chevron"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 4 4 4-4 4"/></svg></span>
          </button>
          <button
            type="button"
            className="breadcrumb-btn breadcrumb-btn--active"
            onMouseEnter={(e) => e.currentTarget.classList.add('is-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('is-hover')}>
            <span className="breadcrumb-btn__label" style={{ fontFamily: 'var(--font-mono)' }}>{asset.file}</span>
          </button>
        </div>

        {/* Scrollable body — white throughout. Sections separated by border lines,
             not gray gutters or panel boxes (matches asset-details.jsx pattern).
             HeroHeader is nested inside the left column so the Score Breakdown
             panel sits flush to the breadcrumb bar (full-height right rail). */}
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0, background: '#fff', display: 'flex', flexDirection: 'column' }}>

          {/* Two columns — preview canvas + score breakdown.
               Vertical divider line separates them; no outer borders. */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 564px',
            alignItems: 'stretch',
            borderBottom: '1px solid var(--border-tertiary)'
          }}>

            {/* Preview canvas (left) */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              borderRight: '1px solid var(--border-tertiary)'
            }}>
              {/* Header strip lives at the top of the left column so the right
                  rail can run flush to the breadcrumb. */}
              <HeroHeader asset={asset} />
              <div style={{
                padding: '14px 16px',
                display: 'flex', justifyContent: 'center',
                background: 'var(--utility-gray-25, #FAFAFA)'
              }}>
                <PreviewTabs value={previewTab} onChange={setPreviewTab} />
              </div>
              <div style={{
                flex: 1, padding: 32,
                background: 'var(--utility-gray-25, #FAFAFA)',
                backgroundImage: 'radial-gradient(var(--border-tertiary) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                minHeight: 460
              }}>
                <div style={{
                  width: '100%', maxWidth: 480, aspectRatio: '1 / 1',
                  background: '#fff',
                  border: '1px solid var(--border-tertiary)',
                  position: 'relative',
                  display: 'grid', placeItems: 'center'
                }}>
                  {typeof AssetThumb !== 'undefined' && asset.thumb ?
                    <img
                      src="uploads/fruity pebbles box hero.jpeg"
                      alt={asset.label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                    /> :
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-quaternary)' }}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="6" y="8" width="36" height="32" />
                        <circle cx="16" cy="20" r="3" />
                        <path d="m6 32 12-10 8 6 8-8 8 6" />
                      </svg>
                      <span style={{ fontSize: 12 }}>{asset.label}</span>
                    </div>
                  }
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>
                  2400 × 2400 px · served on mobile PDP at 112 px
                </div>
              </div>
            </div>

            {/* Score Breakdown (right) */}
            <ScoreBreakdown />
          </div>

          {/* Readability table — full-width section, divider above */}
          <ReadabilityTable rows={HERO_FRAGMENTS} hoverId={hoverId} onHover={setHoverId} />
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { HeroDetailsPage });
