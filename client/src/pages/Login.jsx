import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../utils/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await loginUser(form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#00ff88' }}>🔗 DeTrust</div>
          <p style={{ color: '#666', marginTop: '8px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#2a0a0a', border: '1px solid #ff4444', borderRadius: '8px', padding: '12px', color: '#ff4444', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {['email', 'password'].map((field) => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '6px', textTransform: 'capitalize' }}>{field}</label>
              <input
                type={field === 'password' ? 'password' : 'email'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#00ff88', color: '#000', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '24px' }}>
          No account? <Link to="/register" style={{ color: '#00ff88' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}