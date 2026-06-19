import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import PropertyCard from '../components/PropertyCard'

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    operation: searchParams.get('operation') || '',
    search: searchParams.get('search') || '',
  })

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.type) params.type = filters.type
    if (filters.operation) params.operation = filters.operation
    if (filters.search) params.search = filters.search

    api.getProperties(params)
      .then(data => { setProperties(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filters])

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params)
  }

  return (
    <>
      <section className="properties-header" style={{ position: 'relative' }}>
        <div className="dot-pattern" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1>Proyectos</h1>
          <p>Explora nuestra amplia selección de proyectos en venta.</p>

          <div className="properties-filters">
            <select value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="apartment">Apartamentos</option>
              <option value="studio">Apartaestudios</option>
              <option value="house">Casas</option>
              <option value="commercial">Comerciales</option>
            </select>
            <select value={filters.operation} onChange={e => updateFilter('operation', e.target.value)}>
              <option value="">Todas las operaciones</option>
              <option value="sale">Venta</option>
              <option value="rent">Renta</option>
            </select>
            <input
              type="text"
              placeholder="Buscar por título, descripción o ubicación..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="properties-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
              <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
              Cargando propiedades...
            </div>
          ) : properties.length === 0 ? (
            <div className="properties-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3>No encontramos proyectos</h3>
              <p>Intenta ajustar los filtros de búsqueda.</p>
            </div>
          ) : (
            <>
              <p className="properties-count">{properties.length} proyecto{properties.length !== 1 ? 's' : ''} encontrado{properties.length !== 1 ? 's' : ''}</p>
              <div className="properties-grid stagger">
                {properties.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
