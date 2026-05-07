import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, getShipments, addShipment } from '../utils/api'
import QRCode from 'react-qr-code'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [shipments, setShipments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [form, setForm] = useState({ location: '', temperature: '', humidity: '', shippingTime: '', notes: '' })

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, shipRes] = await Promise.all([
        getProductById(productId),
        getShipments(productId)
      ])
      setProduct(prodRes.data.product)
      setShipments(shipRes.data.shipments)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [productId])

  useEffect(() => {
    // eslint-disable-next-line
    fetchData()
  }, [fetchData])

  const handleShipment = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data } = await addShipment({ productId, ...form })
      setLastResult(data)
      setShowForm(false)
      setForm({ location: '', temperature: '', humidity: '', shippingTime: '', notes: '' })
      const [prodRes, shipRes] = await Promise.all([
        getProductById(productId),
        getShipments(productId)
      ])
      setProduct(prodRes.data.product)
      setShipments(shipRes.data.shipments)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add checkpoint')
    }
    setSubmitting(false)
  }

  const getTrustColor = (score) => {
    if (score >= 80) return '#00ff88'
    if (score >= 50) return '#ffaa00'
    return '#ff4444'
  }

  if (loading) return <div style={{ color: 'white', padding: '40px', background: '#0a0a0a', minHeight: '100vh' }}>Loading...</div>
  if (!product) return <div style={{ color: 'white', padding: '40px' }}>Product not found</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: 'white' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#00ff88' }}>🔗 DeTrust</div>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

          {/* Left Column */}
          <div>
            {/* Product Header */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{product.name}</h1>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>ID: {product.productId}</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Category: {product.category}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, color: getTrustColor(product.trustScore) }}>{product.trustScore}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Trust Score</div>
                  <div style={{ background: '#222', borderRadius: '4px', height: '6px', width: '80px', marginTop: '8px' }}>
                    <div style={{ background: getTrustColor(product.trustScore), height: '6px', borderRadius: '4px', width: `${product.trustScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Result Banner */}
            {lastResult && (
              <div style={{ background: lastResult.aiFlag ? '#2a0808' : '#0a2a15', border: `1px solid ${lastResult.aiFlag ? '#ff4444' : '#00ff88'}`, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{lastResult.aiFlag ? '🚨' : '✅'}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: lastResult.aiFlag ? '#ff4444' : '#00ff88' }}>{lastResult.message}</div>
                    <div style={{ color: '#888', fontSize: '13px', marginTop: '2px' }}>AI Risk Score: {lastResult.aiRiskScore}/100 | New Trust Score: {lastResult.trustScore}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Checkpoint */}
            <div style={{ marginBottom: '24px' }}>
              <button onClick={() => setShowForm(!showForm)}
                style={{ background: '#00ff88', color: '#000', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', marginBottom: '16px' }}>
                + Add Checkpoint
              </button>

              {showForm && (
                <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '24px' }}>
                  <form onSubmit={handleShipment}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      {[
                        { key: 'location', label: 'Location', placeholder: 'Mumbai Warehouse' },
                        { key: 'temperature', label: 'Temperature (°C)', placeholder: '4' },
                        { key: 'humidity', label: 'Humidity (%)', placeholder: '60' },
                        { key: 'shippingTime', label: 'Shipping Time (hrs)', placeholder: '24' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label style={{ display: 'block', color: '#888', fontSize: '12px', marginBottom: '4px' }}>{label}</label>
                          <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                            placeholder={placeholder}
                            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', color: '#888', fontSize: '12px', marginBottom: '4px' }}>Notes</label>
                      <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                        placeholder="Optional notes"
                        style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <button type="submit" disabled={submitting}
                      style={{ background: '#00ff88', color: '#000', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                      {submitting ? 'Analyzing with AI...' : 'Submit Checkpoint'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Shipment Timeline */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Shipment History</h2>
              {shipments.length === 0 ? (
                <div style={{ background: '#111', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#666' }}>No checkpoints yet</div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {shipments.map((s, i) => (
                    <div key={s._id} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.aiFlag ? '#ff4444' : '#00ff88', marginTop: '4px', flexShrink: 0 }} />
                        {i < shipments.length - 1 && <div style={{ width: '2px', flex: 1, background: '#222', marginTop: '4px' }} />}
                      </div>
                      <div style={{ background: '#111', border: `1px solid ${s.aiFlag ? '#ff444433' : '#222'}`, borderRadius: '12px', padding: '16px', flex: 1, marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>📍 {s.location}</span>
                          <span style={{ color: s.aiFlag ? '#ff4444' : '#00ff88', fontSize: '12px', fontWeight: 600 }}>
                            {s.aiFlag ? '🚨 FLAGGED' : '✅ OK'} — Risk: {s.aiRiskScore}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666' }}>
                          {s.temperature !== null && <span>🌡️ {s.temperature}°C</span>}
                          {s.humidity !== null && <span>💧 {s.humidity}%</span>}
                          {s.shippingTime !== null && <span>⏱️ {s.shippingTime}hrs</span>}
                          <span>{new Date(s.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — QR Code */}
          <div>
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '28px', textAlign: 'center', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Consumer QR Code</h3>
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
                <QRCode value={`http://localhost:5173/product/${product.productId}`} size={180} />
              </div>
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>Scan to view full product history and Trust Score</p>
              <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '12px', fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
                {product.productId}
              </div>
              {product.blockchainTxHash && (
                <div style={{ marginTop: '16px', background: '#0a1a0a', border: '1px solid #00ff8833', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ color: '#00ff88', fontSize: '11px', marginBottom: '4px' }}>Blockchain TX</div>
                  <div style={{ fontSize: '10px', color: '#666', wordBreak: 'break-all' }}>{product.blockchainTxHash}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}