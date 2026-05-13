// =========================================================================
// HomePage — landing screen at /home (and the default route on app boot)
// =========================================================================
// Welcome header + 2×2 grid of CTA cards using the design system's
// `.cta-card` component. Each card routes into one of the existing flows.
//
// Anatomy follows components.css → .cta-card / __head / __icon / __plus /
// __body / __title / __subtitle. The hover state flips the surface dark
// and reveals the + glyph; default surface is brand-25 with a 24px icon.

const HomeCTACard = ({ icon, title, subtitle, onClick, defaultHover = false }) => (
  <button
    type="button"
    className={`cta-card${defaultHover ? ' is-hover' : ''}`}
    onClick={onClick}
  >
    <div className="cta-card__head">
      <span className="cta-card__icon">{icon}</span>
      <span className="cta-card__plus">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </div>
    <div className="cta-card__body">
      <h3 className="cta-card__title">{title}</h3>
      <p className="cta-card__subtitle">{subtitle}</p>
    </div>
  </button>
);

// Sized to match the design system spec — 24×24 stroke icons.
const HomeIcons = {
  ScoreImage: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  ScorePDP: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="14" rx="1.5" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
      <path d="M6 9h6" />
      <path d="M6 13h4" />
    </svg>
  ),
  StagePDP: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  ),
  Collection: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  ),
  PackDesign: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
      <path d="M3 7.5 12 12l9-4.5" />
      <path d="M12 12v9" />
      <path d="m7.5 5.25 9 4.5" />
    </svg>
  ),
};

function HomePage({ route, onNavigate }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LeftRail route={route} onNavigate={onNavigate} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          flex: 1,
          padding: '40px 48px 64px',
          display: 'flex', flexDirection: 'column', gap: 32,
          maxWidth: 1280,
        }}>
          {/* Welcome header — uses the styleguide's display type pairing
              (serif display + everything else mono/sans). */}
          <h1 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--display-md, 36px)',
            lineHeight: 'var(--lh-display-md, 1.2)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            Welcome to Vizit
          </h1>

          {/* 2×2 CTA grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
          }}>
            <HomeCTACard
              icon={HomeIcons.ScoreImage}
              title="Score an image"
              subtitle="Get instant feedback on an image's visual appeal—and tips to make it even stronger."
              onClick={() => onNavigate?.('/library/assets')}
            />
            <HomeCTACard
              icon={HomeIcons.ScorePDP}
              title="Score a product page"
              subtitle="Evaluate your live listings and see how images perform on the digital shelf. Get insights to boost conversion."
              onClick={() => onNavigate?.('/library')}
            />
            <HomeCTACard
              icon={HomeIcons.StagePDP}
              title="Stage a new product page"
              subtitle="Launching something new? Upload images to get Vizit Scores and recommendations before you go live."
              onClick={() => onNavigate?.('/library')}
            />
            <HomeCTACard
              icon={HomeIcons.Collection}
              title="Create a collection"
              subtitle="Organize images by category, see scores, and test/compare visuals to refine fast."
              onClick={() => onNavigate?.('/collections')}
            />
            <HomeCTACard
              icon={HomeIcons.PackDesign}
              title="Score a pack design"
              subtitle="Upload pack art or renders to test on-shelf legibility, hierarchy, and standout before it goes to print."
              onClick={() => onNavigate?.('/library/pack-designs/marlowe-q4')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { HomePage, HomeCTACard, HomeIcons });
