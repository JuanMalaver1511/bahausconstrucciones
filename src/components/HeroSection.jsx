import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CYCLING_WORDS = [
  'tu hogar ideal',
  'tu espacio soñado',
  'tu próximo proyecto',
  'el lugar perfecto',
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ type: '', operation: '', search: '' })
  const [wordIdx, setWordIdx] = useState(0)
  const [wordPhase, setWordPhase] = useState('visible')

  useEffect(() => {
    const timer = setInterval(() => {
      setWordPhase('exit')
      setTimeout(() => {
        setWordIdx(i => (i + 1) % CYCLING_WORDS.length)
        setWordPhase('enter')
        setTimeout(() => setWordPhase('visible'), 450)
      }, 350)
    }, 3400)
    return () => clearInterval(timer)
  }, [])

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
        <div className="hero-badge hero-anim-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Tunja, Boyacá · Desde 2014
        </div>

        <h1 className="hero-anim-2">
          Construimos{' '}
          <span className={`hero-word gradient-text phase-${wordPhase}`}>
            {CYCLING_WORDS[wordIdx]}
          </span>
        </h1>

        <p className="hero-anim-3">
          Proyectos residenciales y comerciales con acabados premium.
          Más de 12 años entregando hogares que superan expectativas.
        </p>

        <form className="hero-search hero-anim-4" onSubmit={handleSearch}>
          <select
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">Tipo de propiedad</option>
            <option value="apartment">Apartamento</option>
            <option value="studio">Apartaestudio</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
          </select>
          <select
            value={filters.operation}
            onChange={(e) => setFilters(f => ({ ...f, operation: e.target.value }))}
          >
            <option value="">Operación</option>
            <option value="sale">Venta</option>
            <option value="rent">Arriendo</option>
          </select>
          <input
            type="text"
            placeholder="Ciudad, barrio, proyecto..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          <button type="submit" className="btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar
          </button>
        </form>
      </div>

      <div className="hero-scroll hero-anim-5">
        <span>Descubre más</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  )
}
