// =========================================================================
// Collections — asset thumbnail placeholders
// =========================================================================
// CSS-painted stand-ins for the Hanni Shave Pillow photography. Each has a
// recognizable color treatment + a mock "hanni" jar silhouette so the grid
// reads at a glance even without real imagery.

const JAR_WIDTHS = { sm: 42, md: 58, lg: 74 };

const Jar = ({ size = 'md', label, tagline }) => {
  const w = JAR_WIDTHS[size];
  const h = w * 1.35;
  return (
    <div style={{
      width: w, height: h,
      background: 'linear-gradient(165deg, #6e1620 0%, #4a0f18 48%, #7a1a26 100%)',
      borderRadius: '2px 2px 3px 3px',
      boxShadow: 'inset 0 -8px 12px rgba(0,0,0,.35), inset 0 2px 4px rgba(255,255,255,.12), 0 2px 6px rgba(0,0,0,.15)',
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'Georgia, serif',
      padding: '8px 4px',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: w * 0.18, background: 'linear-gradient(180deg, #3a0b12, #5a1119)', borderRadius: '2px 2px 0 0' }} />
      <div style={{ fontStyle: 'italic', fontWeight: 500, fontSize: w * 0.28, letterSpacing: '-0.5px', lineHeight: 1, marginTop: w * 0.1 }}>{label || 'hanni'}</div>
      {tagline && <div style={{ fontSize: w * 0.1, opacity: 0.7, marginTop: 2, fontStyle: 'italic' }}>{tagline}</div>}
    </div>
  );
};

// Each thumb is a 1:1 square framing the jar in a distinctive backdrop.
const THUMBS = {
  plant: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #7a5a3f 0%, #4a3424 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', top: '10%', right: '12%', width: '28%', height: '42%',
        background: 'radial-gradient(ellipse at 50% 30%, #7fa858 0%, #5a8140 60%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.3))' }} />
      <div style={{ position: 'absolute', bottom: '18%', left: '32%', display: 'flex' }}><Jar size="md" /></div>
    </div>
  ),
  tile: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f0ebe4 0%, #d8cfc3 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,.06) 1px, transparent 1px)', backgroundSize: '28% 28%' }} />
      <Jar size="lg" label="hanni" tagline="shave pillow" />
    </div>
  ),
  stone: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e8e0d4 0%, #c4b8a6 100%)', display: 'grid', placeItems: 'end center' }}>
      <div style={{ position: 'absolute', bottom: '12%', left: '15%', right: '15%', height: '18%',
        background: 'linear-gradient(180deg, #9b8870, #6e5d48)', borderRadius: '40%' }} />
      <div style={{ display: 'flex', gap: 2, marginBottom: '22%', alignItems: 'end' }}>
        <div style={{ opacity: 0.55, transform: 'scale(0.78)' }}><Jar size="sm" /></div>
        <Jar size="md" />
        <div style={{ opacity: 0.55, transform: 'scale(0.82)' }}><Jar size="sm" /></div>
      </div>
    </div>
  ),
  sage: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #b8d4bc 0%, #8fb596 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', top: '14%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#2a4a32', fontSize: '13px', lineHeight: 1.1 }}>Smooth Shaving<br/>Experience</div>
      <div style={{ marginTop: '15%' }}><Jar size="md" /></div>
    </div>
  ),
  hand: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #c8a89a 0%, #9a7868 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
        background: 'radial-gradient(ellipse at 50% 20%, #b8998a 0%, #7a5c50 80%)',
        clipPath: 'polygon(20% 100%, 25% 40%, 40% 15%, 60% 10%, 75% 25%, 80% 100%)' }} />
      <div style={{ marginBottom: '5%' }}><Jar size="md" /></div>
    </div>
  ),
  floral: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f5dcdc 0%, #e8b8b8 100%)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: 'absolute',
          left: `${(i * 37) % 90}%`, top: `${(i * 23) % 80 + 5}%`,
          width: 18, height: 22, background: '#d89898', opacity: 0.55,
          clipPath: 'polygon(50% 0%, 80% 30%, 70% 70%, 50% 100%, 30% 70%, 20% 30%)',
          transform: `rotate(${i * 47}deg)` }} />
      ))}
      <div style={{ position: 'absolute', top: '14%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8a3a4a', fontSize: '12px' }}>Smooth Shaving Experience</div>
      <div style={{ marginTop: '10%' }}><Jar size="md" /></div>
    </div>
  ),
  existing: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f2dde0 0%, #e5c8cc 100%)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 8, left: 8, width: 22, height: 22, border: '1.5px solid rgba(0,0,0,.2)', background: 'rgba(255,255,255,.3)' }} />
      <div style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,.3)' }} />
      <Jar size="md" />
      <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Georgia, serif', color: '#fff', fontStyle: 'italic', fontSize: 24, letterSpacing: '-.5px', textShadow: '0 1px 4px rgba(0,0,0,.2)' }}>existing</div>
    </div>
  ),
  'copy-pink': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #f2c9c9 0%, #d88a8a 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', top: '10%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#3a1a20', fontSize: '14px', lineHeight: 1.1 }}>Smooth Shave<br/>Every Time!</div>
      <div style={{ marginTop: '12%', display: 'flex', alignItems: 'end', gap: 4 }}>
        <Jar size="md" />
        <div style={{ width: 12, height: 12, background: '#f0e5dc', borderRadius: '50%', marginBottom: 8 }} />
        <div style={{ width: 8, height: 8, background: '#f0e5dc', borderRadius: '50%', marginBottom: 14 }} />
      </div>
    </div>
  ),
  'blue-sparkle': () => (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, #c8dcf0 0%, #8aaed4 70%, #6a8cb8 100%)', display: 'grid', placeItems: 'center' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute',
          left: `${15 + i * 14}%`, top: `${20 + (i * 29) % 50}%`,
          width: 3, height: 3, background: '#fff', borderRadius: '50%',
          boxShadow: '0 0 6px #fff' }} />
      ))}
      <Jar size="md" />
      <div style={{ position: 'absolute', bottom: '14%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#fff', fontSize: 18, textShadow: '0 1px 6px rgba(0,0,0,.25)' }}>Shave pillow</div>
    </div>
  ),
  mint: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #4dd0b4 0%, #2ba890 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', top: '12%', left: 0, right: 0, textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '13px' }}>Smooth Shaving</div>
      <div style={{ position: 'absolute', top: '22%', left: 0, right: 0, textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '13px' }}>Awaits!</div>
      <div style={{ marginTop: '18%' }}><Jar size="md" /></div>
    </div>
  ),
  studio: () => (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fafafa 0%, #e8e8e8 100%)', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'absolute', top: '12%', left: 0, right: 0, textAlign: 'center', fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}>shave pillow</div>
      <div style={{ marginTop: '15%', transform: 'rotate(-8deg)' }}><Jar size="md" /></div>
      <div style={{ position: 'absolute', bottom: '15%', left: '25%', right: '25%', height: '6px', background: 'radial-gradient(ellipse, rgba(0,0,0,.25), transparent 70%)' }} />
    </div>
  ),
};

const Thumb = ({ kind }) => {
  const T = THUMBS[kind] || THUMBS.studio;
  return <T />;
};

Object.assign(window, { Thumb, THUMBS });
