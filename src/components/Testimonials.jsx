const FEATURED = {
  text: 'Bahaus Construcciones superó todas nuestras expectativas. El apartamento que nos entregaron tiene acabados de primera calidad y fue puntual al día. La atención desde el primer contacto hasta la entrega de llaves fue impecable. Sin duda la mejor decisión que tomamos como familia.',
  name: 'María García',
  role: 'Compradora — Apartamento en Tunja',
  initials: 'MG',
}

const TESTIMONIALS = [
  {
    text: 'Decidimos invertir en un apartaestudio con Bahaus y fue la mejor decisión. La construcción se entregó antes de lo previsto y tal cual lo prometieron. Profesionalismo total.',
    name: 'Carlos Mendoza',
    role: 'Inversionista',
    initials: 'CM',
  },
  {
    text: 'Comprar nuestra casa con Bahaus fue una experiencia increíble. Nos guiaron en cada paso, desde la elección de acabados hasta la entrega. La calidad de construcción es superior.',
    name: 'Ana y Luis Fernández',
    role: 'Compradores',
    initials: 'AF',
  },
  {
    text: 'El proceso de financiamiento fue muy fácil gracias a su equipo. En menos de dos meses teníamos el crédito aprobado y pudimos elegir los acabados de nuestro apartamento.',
    name: 'Jorge Ramírez',
    role: 'Comprador',
    initials: 'JR',
  },
]

export default function Testimonials() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Testimonios</span>
          <h2 className="section-title font-display">
            Lo que dicen <span className="gradient-text">nuestros clientes</span>
          </h2>
          <p className="section-subtitle">
            La satisfacción de nuestras familias es nuestra mejor carta de presentación.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="testimonial-featured">
          <div className="testimonial-featured-mark">"</div>
          <div className="testimonial-featured-quote">
            "{FEATURED.text}"
          </div>
          <div className="testimonial-featured-aside">
            <div className="testimonial-featured-avatar">{FEATURED.initials}</div>
            <div>
              <div className="testimonial-featured-name">{FEATURED.name}</div>
              <div className="testimonial-featured-role">{FEATURED.role}</div>
              <div className="testimonial-featured-stars">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Grid of testimonials */}
        <div className="testimonials-grid stagger">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(5)}</div>
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
