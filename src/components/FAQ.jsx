import { useState } from 'react'

const faqs = [
  {
    q: '¿Cómo puedo agendar una visita a un proyecto?',
    a: 'Puedes contactarnos a través de nuestro formulario en línea, llamando al +52 55 1234 5678 o enviando un correo a info@bahausconstrucciones.com. Nuestro equipo te atenderá con gusto.',
  },
  {
    q: '¿Qué acabados incluyen sus proyectos?',
    a: 'Todos nuestros proyectos incluyen acabados de primera calidad: pisos de porcelanato, cocina integral equipada, closets inteligentes, ventanas de doble vidrio y sistema de seguridad. Cada proyecto tiene una carta de acabados personalizable.',
  },
  {
    q: '¿Ofrecen opciones de financiamiento?',
    a: 'Sí, trabajamos con los principales bancos e instituciones financieras para ofrecerte créditos hipotecarios con las mejores tasas. También tenemos planes de enganche diferido y facilidades de pago.',
  },
  {
    q: '¿Cuánto tiempo toma la entrega de un proyecto?',
    a: 'Dependiendo del proyecto, los tiempos de entrega van de 12 a 24 meses. Te mantenemos informado en cada etapa con reportes de avance y visitas de obra programadas.',
  },
  {
    q: '¿Puedo personalizar mi apartamento?',
    a: 'Sí, ofrecemos opciones de personalización en acabados, distribución de espacios y selección de materiales durante la etapa de construcción. Nuestro equipo de diseño te asesorará para crear el espacio perfecto.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">Preguntas frecuentes</h2>
          <p className="section-subtitle">
            Resolvemos tus dudas sobre nuestros proyectos y el proceso de compra.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {faq.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
