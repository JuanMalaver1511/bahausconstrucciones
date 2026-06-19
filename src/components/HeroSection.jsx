import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ type: '', operation: '', search: '' })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.type) params.set('type', filters.type)
    if (filters.operation) params.set('operation', filters.operation)
    if (filters.search) params.set('search', filters.search)
    navigate(`/propiedades${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="mesh-bg">
        <div className="mesh-orb" />
        <div className="mesh-orb" />
        <div className="mesh-orb" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-grain" />
      <div className="hero-dots" />
      <div className="container">
        <div className="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20L12 4l10 16H2z" />
            <path d="M6 16l6-8 6 8" />
          </svg>
          Excelencia en Construcción
        </div>

        <h1>
          Construimos el <span className="gradient-text">hogar perfecto</span> para ti
        </h1>
        <p>
          Proyectos de alta calidad con acabados premium. Apartamentos, apartaestudios,
          casas y espacios comerciales diseñados para tu estilo de vida.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <select value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="">Tipo</option>
            <option value="apartment">Departamento</option>
            <option value="studio">Apartaestudio</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
          </select>
          <select value={filters.operation} onChange={(e) => setFilters(f => ({ ...f, operation: e.target.value }))}>
            <option value="">Operación</option>
            <option value="sale">Venta</option>
            <option value="rent">Renta</option>
          </select>
          <input
            type="text"
            placeholder="Ciudad, barrio..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          <button type="submit" className="btn">
            Buscar
          </button>
        </form>
      </div>

      <div className="hero-scroll">
        <span>Descubre más</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  )
}
