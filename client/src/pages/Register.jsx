import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'manufacturer', company: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await registerUser(form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#00ff88' }}>🔗 DeTrust</div>
          <p style={{ color: '#666', marginTop: '8px' }}>Create your account</p>
        </div>

        {error && (
          <div style={{ background: '#2a0a0a', border: '1px solid #ff4444', borderRadius: '8px', padding: '12px', color: '#ff4444', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'password', label: 'Password', type: 'password' },
            { key: 'company', label: 'Company Name', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '6px' }}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key !== 'company'}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '13px', marginBottom: '6px' }}>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="manufacturer">Manufacturer</option>
              <option value="supplier">Supplier</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#00ff88', color: '#000', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginTop: '24px' }}>
          Have account? <Link to="/login" style={{ color: '#00ff88' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}