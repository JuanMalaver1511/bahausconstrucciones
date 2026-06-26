import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useScrollReveal } from '../hooks/useScrollReveal'
import HeroSection from '../components/HeroSection'
import TrustStrip from '../components/TrustStrip'
import PropertyCard from '../components/PropertyCard'
import Stats from '../components/Stats'
import WhyBahaus from '../components/WhyBahaus'
import Process from '../components/Process'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'

function SectionWrap({ children, className = '' }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.getProperties({ featured: 'true' })
      .then(setFeatured)
      .catch(() => {})
  }, [])

  return (
    <>
      <HeroSection />

      <TrustStrip />

      <SectionWrap><Stats /></SectionWrap>

      {featured.length > 0 && (
        <SectionWrap>
          <section className="section section-alt">
            <div className="mesh-bg">
              <div className="mesh-orb" />
              <div className="mesh-orb" />
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="section-header">
                <span className="section-tag">Destacados</span>
                <h2 className="section-title">Proyectos <span className="gradient-text">destacados</span></h2>
                <p className="section-subtitle">
                  Nuestros mejores proyectos seleccionados especialmente para ti.
                </p>
              </div>
              <div className="properties-grid stagger">
                {featured.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/propiedades')}>
                  Ver todos los proyectos
                </button>
              </div>
            </div>
          </section>
        </SectionWrap>
      )}

      <SectionWrap><WhyBahaus /></SectionWrap>

      <SectionWrap><Process /></SectionWrap>

      <SectionWrap><Testimonials /></SectionWrap>

      <SectionWrap><FAQ /></SectionWrap>

      <section className="section cta-section">
        <div className="mesh-bg">
          <div className="mesh-orb" />
          <div className="mesh-orb" />
        </div>
        <div className="dot-pattern" />
        <div className="container">
          <span className="section-tag">Contacto</span>
          <h2 className="section-title">¿Listo para estrenar tu <span className="gradient-text">hogar</span>?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Déjanos tus datos y te contactamos al instante por WhatsApp.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
