const FEATURES = [
  {
    title: 'Entrega garantizada',
    desc: 'Todos nuestros proyectos se entregan en la fecha pactada. Cero retrasos, cero excusas — tu confianza es nuestra mayor obra.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    title: 'Acabados premium',
    desc: 'Porcelanato italiano, cocinas integrales, ventanas de doble vidrio y sistema de seguridad incluidos en cada proyecto.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    title: 'Diseño personalizable',
    desc: 'Elige distribución, materiales y colores con asesoría de nuestro equipo de diseño. Tu espacio, tu firma.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    title: 'Financiamiento flexible',
    desc: 'Aliados con Bancolombia, Davivienda y más bancos. Te asesoramos para conseguir la mejor tasa hipotecaria.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    title: 'Supervisión permanente',
    desc: 'Reportes de avance mensuales y visitas de obra programadas. Siempre sabes cómo va tu proyecto.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: 'Soporte postventa',
    desc: 'Acompañamiento durante el primer año después de la entrega. Tu tranquilidad no termina en la escritura.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.2 2 2 0 012 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
]

export default function WhyBahaus() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">¿Por qué elegirnos?</span>
          <h2 className="section-title font-display">
            Lo que nos hace <span className="gradient-text">diferentes</span>
          </h2>
          <p className="section-subtitle">
            Más de una década construyendo confianza, calidad y hogares que perduran.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon-wrap">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
