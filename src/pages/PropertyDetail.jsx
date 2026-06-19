import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

const TYPE_LABELS = { apartment: 'Apartamento', studio: 'Apartaestudio', house: 'Casa', commercial: 'Comercial' }
const OPERATION_LABELS = { sale: 'Venta', rent: 'Renta' }
const FALLBACK_IMAGES = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
  studio: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
  house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
}

function formatPrice(price, operation) {
  const f = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
  return `${f.format(price)}${operation === 'rent' ? '/mes' : ''}`
}

function getEmbedUrl(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/').split('&')[0]
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0]
    return id ? `https://player.vimeo.com/video/${id}` : url
  }
  return url
}

export default function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    api.getProperty(id)
      .then(data => { setProperty(data); setLoading(false) })
      .catch(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', textAlign: 'center', padding: '10rem 2rem', color: 'var(--text-secondary)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        Cargando...
      </div>
    )
  }

  if (!property) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', textAlign: 'center', padding: '10rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1rem' }}>Propiedad no encontrada</h2>
        <Link to="/propiedades" className="btn btn-primary">Ver propiedades</Link>
      </div>
    )
  }

  const allImages = property.images?.length
    ? property.images.map(i => `/uploads/${i}`)
    : [FALLBACK_IMAGES[property.type] || FALLBACK_IMAGES.house]

  const prev = () => setActiveIndex(i => (i - 1 + allImages.length) % allImages.length)
  const next = () => setActiveIndex(i => (i + 1) % allImages.length)

  return (
    <>
      <div className="gallery-section">
        <div className="container">
          <div className="gallery-layout">
            <div className="gallery-main-wrap">
              <div className="gallery-main">
                <div className="gallery-main-inner">
                  {allImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={i === activeIndex ? 'active' : ''}
                      onClick={() => { setLightboxIndex(i); setLightbox(true) }}
                    />
                  ))}
                </div>
                {allImages.length > 1 && (
                  <>
                    <button className="gallery-arrow gallery-arrow-prev" onClick={prev} aria-label="Anterior">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button className="gallery-arrow gallery-arrow-next" onClick={next} aria-label="Siguiente">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div className="gallery-counter">{activeIndex + 1} / {allImages.length}</div>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="gallery-thumbs">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      className={`gallery-thumb ${i === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="gallery-info">
              <div className="gallery-price">{formatPrice(property.price, property.operation)}</div>
              <h1 className="gallery-title">{property.title}</h1>
              {property.location && (
                <div className="gallery-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.location}
                </div>
              )}
              <div className="gallery-tags">
                <span className="gallery-tag">{TYPE_LABELS[property.type] || property.type}</span>
                <span className="gallery-tag">{OPERATION_LABELS[property.operation] || property.operation}</span>
              </div>
              <div className="gallery-actions">
                <button className="btn btn-accent" onClick={() => {
                  const msg = encodeURIComponent(`Hola, me interesa agendar una visita a:\n\n${property.title}\n${property.location || ''}\n${formatPrice(property.price, property.operation)}`)
                  window.open(`https://wa.me/573106964219?text=${msg}`, '_blank')
                }}>
                  Agendar visita
                </button>
                <button className="btn btn-outline" onClick={() => {
                  const msg = encodeURIComponent(`Hola, me gustaría recibir más información sobre:\n\n${property.title}\n${property.location || ''}\n${formatPrice(property.price, property.operation)}`)
                  window.open(`https://wa.me/573106964219?text=${msg}`, '_blank')
                }}>
                  Solicitar información
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="detail-body">
        <div className="container">
          <div className="detail-grid">
            <div>
              <div className="detail-section">
                <h2>Descripción</h2>
                <p>{property.description}</p>
              </div>

              {property.video_url && (
                <div className="detail-section">
                  <h2>Video</h2>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
                    <iframe
                      src={getEmbedUrl(property.video_url)}
                      title="Video del proyecto"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h2>Características</h2>
                <div className="detail-features-grid">
                  {property.type && (
                    <div className="detail-feature">
                      <div className="detail-feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
                      </div>
                      <div className="detail-feature-info">
                        <strong>Tipo</strong>
                        <span>{TYPE_LABELS[property.type]}</span>
                      </div>
                    </div>
                  )}
                  {property.operation && (
                    <div className="detail-feature">
                      <div className="detail-feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/></svg>
                      </div>
                      <div className="detail-feature-info">
                        <strong>Operación</strong>
                        <span>{OPERATION_LABELS[property.operation]}</span>
                      </div>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="detail-feature">
                      <div className="detail-feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4v16M2 8h20M2 16h20M22 4v16"/></svg>
                      </div>
                      <div className="detail-feature-info">
                        <strong>Recámaras</strong>
                        <span>{property.bedrooms}</span>
                      </div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="detail-feature">
                      <div className="detail-feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6M8 12V4h8v8"/></svg>
                      </div>
                      <div className="detail-feature-info">
                        <strong>Baños</strong>
                        <span>{property.bathrooms}</span>
                      </div>
                    </div>
                  )}
                  {property.area > 0 && (
                    <div className="detail-feature">
                      <div className="detail-feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                      </div>
                      <div className="detail-feature-info">
                        <strong>Superficie</strong>
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="detail-sidebar-card">
                <h3>{formatPrice(property.price, property.operation)}</h3>
                <p>
                  {property.bedrooms > 0 && `${property.bedrooms} rec · `}
                  {property.bathrooms > 0 && `${property.bathrooms} baños · `}
                  {property.area > 0 && `${property.area} m²`}
                </p>
                <button className="btn btn-accent" onClick={() => {
                  const msg = encodeURIComponent(`Hola, me interesa agendar una visita a:\n\n${property.title}\n${property.location || ''}\n${formatPrice(property.price, property.operation)}`)
                  window.open(`https://wa.me/525512345678?text=${msg}`, '_blank')
                }}>
                  Agendar visita
                </button>
                <button className="btn btn-outline" onClick={() => {
                  const msg = encodeURIComponent(`Hola, me gustaría recibir más información sobre:\n\n${property.title}\n${property.location || ''}\n${formatPrice(property.price, property.operation)}`)
                  window.open(`https://wa.me/525512345678?text=${msg}`, '_blank')
                }}>
                  Solicitar información
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox open" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>×</button>
          {allImages.length > 1 && (
            <>
              <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length) }}>‹</button>
              <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % allImages.length) }}>›</button>
            </>
          )}
          <img src={allImages[lightboxIndex]} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
