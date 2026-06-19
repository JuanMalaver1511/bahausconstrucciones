const testimonials = [
  {
    text: "Bahaus Construcciones superó todas nuestras expectativas. El departamento que nos entregaron tiene acabados de primera calidad y la atención al detalle es impecable. ¡Recomendadísimos!",
    name: 'María García',
    role: 'Compradora',
    initials: 'MG',
  },
  {
    text: "Decidimos invertir en un apartaestudio con Bahaus y fue la mejor decisión. La construcción se entregó antes de lo previsto y tal cual lo prometieron. Profesionalismo total.",
    name: 'Carlos Mendoza',
    role: 'Inversionista',
    initials: 'CM',
  },
  {
    text: "Comprar nuestra casa con Bahaus fue una experiencia increíble. Nos guiaron en cada paso, desde la elección de acabados hasta la entrega. La calidad de construcción es superior.",
    name: 'Ana y Luis Fernández',
    role: 'Compradores',
    initials: 'AF',
  },
]

export default function Testimonials() {
  return (
    <section className="section section-alt">
      <div className="mesh-bg">
        <div className="mesh-orb" />
        <div className="mesh-orb" />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <span className="section-tag">Testimonios</span>
          <h2 className="section-title">Lo que dicen <span className="gradient-text">nuestros clientes</span></h2>
          <p className="section-subtitle">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
          </p>
        </div>
        <div className="testimonials-grid stagger">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {'★'.repeat(5)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
