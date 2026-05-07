import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #222' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ff88' }}>
          🔗 DeTrust
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/simulate')}
            style={{ background: 'transparent', border: '1px solid #00ff88', color: '#00ff88', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Live Demo
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background: '#00ff88', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '100px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#00ff88', marginBottom: '24px' }}>
          Powered by Solana + AI + MongoDB
        </div>
        <h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #00ff88 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Trust Every Product<br />In Your Supply Chain
        </h1>
        <p style={{ fontSize: '20px', color: '#888', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Real-time AI anomaly detection + blockchain verification. Know exactly where your product has been and whether it's been tampered with.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')}
            style={{ background: '#00ff88', color: '#000', padding: '16px 36px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            Get Started Free
          </button>
          <button onClick={() => navigate('/simulate')}
            style={{ background: '#1a1a1a', color: '#fff', padding: '16px 36px', borderRadius: '10px', border: '1px solid #333', fontSize: '16px', cursor: 'pointer' }}>
            See Live Demo →
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', margin: '60px auto', padding: '0 40px' }}>
        {[
          { icon: '🤖', title: 'AI Anomaly Detection', desc: 'ML model flags suspicious temperature, humidity, or timing changes instantly' },
          { icon: '⛓️', title: 'Blockchain Verified', desc: 'Every checkpoint is permanently recorded on Solana — immutable and transparent' },
          { icon: '📱', title: 'Consumer QR Scan', desc: 'Customers scan QR code to see full product journey and Trust Score' }
        ].map((f, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{f.title}</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px', color: '#444', fontSize: '14px', borderTop: '1px solid #1a1a1a' }}>
        Built by Priyanshi Gajjar — DeTrust Supply Chain Audit System
      </div>
    </div>
  )
}