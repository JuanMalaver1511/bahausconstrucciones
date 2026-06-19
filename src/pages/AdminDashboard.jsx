import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import PropertyForm from '../components/PropertyForm'

const TYPE_LABELS = { apartment: 'Apartamento', studio: 'Apartaestudio', house: 'Casa', commercial: 'Comercial' }

function formatPrice(p) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(p)
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [editProperty, setEditProperty] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const loadProperties = () => {
    setLoading(true)
    api.getProperties().then(data => { setProperties(data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { loadProperties() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta propiedad permanentemente?')) return
    try {
      await api.deleteProperty(id)
      setProperties(p => p.filter(x => x.id !== id))
      setSuccess('Propiedad eliminada correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (property) => {
    setEditProperty(property)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleNew = () => {
    setEditProperty(null)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleSave = async (data) => {
    try {
      if (editProperty) {
        await api.updateProperty(editProperty.id, data)
        setSuccess('Propiedad actualizada correctamente')
      } else {
        await api.createProperty(data)
        setSuccess('Propiedad creada correctamente')
      }
      setView('list')
      setEditProperty(null)
      loadProperties()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      throw err
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  if (view === 'form') {
    return (
      <div className="admin-page">
        <div className="admin-topbar">
          <div className="navbar-logo">Bahaus<span>Construcciones</span></div>
          <div className="admin-topbar-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
              )}
            </button>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user?.username}</span>
            <button className="btn btn-outline btn-sm" onClick={() => { setView('list'); setEditProperty(null) }}>
              Volver
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
          </div>
        </div>
        <div className="admin-content">
          <PropertyForm property={editProperty} onSave={handleSave} onCancel={() => { setView('list'); setEditProperty(null) }} />
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="navbar-logo">Bahaus<span>Construcciones</span></div>
        <div className="admin-topbar-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user?.username}</span>
          <button className="btn btn-accent btn-sm" onClick={handleNew}>Nueva propiedad</button>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>Propiedades</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} registrada{properties.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleNew}>Nueva propiedad</button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>Cargando...</div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No hay propiedades registradas</p>
            <button className="btn btn-primary" onClick={handleNew}>Crear primera propiedad</button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Operación</th>
                  <th>Precio</th>
                  <th>Ubicación</th>
                  <th>Video</th>
                  <th>Destacado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0] ? (
                        <img src={`/uploads/${p.images[0]}`} alt="" className="thumb" />
                      ) : (
                        <div className="thumb" style={{ background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin img</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.title}</td>
                    <td><span className={`admin-badge ${p.type}`}>{TYPE_LABELS[p.type] || p.type}</span></td>
                    <td><span className={`admin-badge ${p.operation}`}>{p.operation === 'sale' ? 'Venta' : 'Renta'}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(p.price)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.location || '—'}</td>
                    <td>{p.video_url ? '🎬' : '—'}</td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Editar</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
