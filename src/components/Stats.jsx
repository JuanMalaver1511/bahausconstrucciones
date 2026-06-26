import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration, active) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    const isDecimal = !Number.isInteger(target)
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target
      setDisplay(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(isDecimal ? parseFloat(target.toFixed(1)) : target)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])

  return display
}

function StatBandItem({ number, suffix, label, sub, duration = 2000 }) {
  const [active, setActive] = useState(false)
  const ref = useRef(null)
  const count = useCountUp(number, duration, active)
  const isDecimal = !Number.isInteger(number)
  const displayValue = (isDecimal ? count.toFixed(1) : count) + suffix

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="stats-band-item">
      <div className="stats-band-number">{displayValue}</div>
      <div className="stats-band-label">{label}</div>
      <div className="stats-band-sub">{sub}</div>
    </div>
  )
}

export default function Stats() {
  const stats = [
    { number: 50,  suffix: '+', label: 'Proyectos entregados',  sub: '100% puntualidad',   duration: 1800 },
    { number: 400, suffix: '+', label: 'Familias felices',      sub: '97% satisfacción',   duration: 2200 },
    { number: 12,  suffix: '+', label: 'Años de experiencia',   sub: 'Desde 2014',         duration: 1500 },
    { number: 4.9, suffix: '',  label: 'Calificación promedio', sub: 'Reseñas verificadas', duration: 2000 },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Cifras</span>
          <h2 className="section-title font-display">
            Nuestros <span className="gradient-text">números</span> hablan
          </h2>
          <p className="section-subtitle">
            Resultados que respaldan nuestra trayectoria y compromiso con cada familia.
          </p>
        </div>
        <div className="stats-band">
          {stats.map((s, i) => <StatBandItem key={i} {...s} />)}
        </div>
      </div>
    </section>
  )
}
