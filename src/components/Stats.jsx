export default function Stats() {
  const stats = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>, number: '50+', label: 'Proyectos entregados', trend: '100% puntualidad' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, number: '400+', label: 'Familias felices', trend: '97% satisfacción' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, number: '12+', label: 'Años de experiencia', trend: 'Desde 2014' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3 7h7l-5.5 5 2 8L12 17l-5.5 5 2-8L3 9h7z"/></svg>, number: '4.9', label: 'Calificación promedio', trend: 'Reseñas de clientes' },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Cifras</span>
          <h2 className="section-title">Nuestros <span className="gradient-text">números</span> hablan</h2>
          <p className="section-subtitle">Resultados que respaldan nuestra trayectoria y compromiso.</p>
        </div>
        <div className="stats-grid stagger">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
