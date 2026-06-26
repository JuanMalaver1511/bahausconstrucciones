import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Elige tu proyecto',
    desc: 'Explora nuestro catálogo, agenda una visita y conoce el proyecto que mejor se adapta a ti. Nuestros asesores te acompañan sin presiones.',
    tag: 'Sin compromiso',
  },
  {
    num: '02',
    title: 'Tramita tu crédito',
    desc: 'Te conectamos con nuestros bancos aliados para conseguir el crédito hipotecario con la mejor tasa del mercado. Asesoría totalmente incluida.',
    tag: 'Asesoría incluida',
  },
  {
    num: '03',
    title: 'Estrena tu hogar',
    desc: 'Recibe las llaves en perfectas condiciones y con todo lo prometido. Soporte postventa durante el primer año garantizado.',
    tag: 'Soporte garantizado',
  },
]

export default function Process() {
  const [lineActive, setLineActive] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLineActive(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section process-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Proceso</span>
          <h2 className="section-title font-display">
            Así de fácil es <span className="gradient-text">llegar a tu hogar</span>
          </h2>
          <p className="section-subtitle">
            Tres pasos sencillos para hacer realidad el hogar que siempre soñaste.
          </p>
        </div>

        <div ref={ref} className="process-steps">
          <div className="process-line-wrap">
            <div className="process-line-bg" />
            <div className={`process-line-fill${lineActive ? ' animate' : ''}`} />
          </div>

          {STEPS.map((step, i) => (
            <div key={i} className="process-step">
              <div className="process-num">{step.num}</div>
              <div className="process-title">{step.title}</div>
              <div className="process-desc">{step.desc}</div>
              <div className="process-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {step.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
