export default function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#FAFAF8',
      borderBottom: '1px solid #E8E2D9',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(250,250,248,0.92)',
    }}>
      {/* Left nav */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {['Collections', 'Stories', 'Craft', 'About'].map((item) => (
          <a key={item} href="#" style={{
            color: '#888',
            textDecoration: 'none',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#B8942A'}
            onMouseLeave={e => e.target.style.color = '#888'}
          >{item}</a>
        ))}
      </div>

      {/* Logo */}
      <div style={{
        fontFamily: "'Cormorant Garant', 'Georgia', serif",
        fontSize: '22px',
        fontWeight: '600',
        color: '#2C2416',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Aurum Journal
      </div>

      {/* Right */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="#" style={{
          color: '#888',
          textDecoration: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = '#B8942A'}
          onMouseLeave={e => e.target.style.color = '#888'}
        >Shop</a>
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid #B8942A',
          color: '#B8942A',
          padding: '6px 16px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.backgroundColor = '#B8942A'; e.target.style.color = '#FAFAF8'; }}
          onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#B8942A'; }}
        >Subscribe</button>
      </div>
    </nav>
  );
}
