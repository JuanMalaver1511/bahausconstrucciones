import { useNavigate } from 'react-router-dom'
import { imageUrl } from '../imageUrl'

const TYPE_LABELS = { apartment: 'Apartamento', studio: 'Apartaestudio', house: 'Casa', commercial: 'Comercial' }
const OPERATION_LABELS = { sale: 'Venta', rent: 'Renta' }

const FALLBACK_IMAGES = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
  studio: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
  house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
}

function formatPrice(price, operation) {
  const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
  const prefix = operation === 'rent' ? '/mes' : ''
  return `${formatter.format(price)}${prefix}`
}

export default function PropertyCard({ property }) {
  const navigate = useNavigate()
  const imgSrc = property.images?.[0]
    ? imageUrl(property.images[0])
    : FALLBACK_IMAGES[property.type] || FALLBACK_IMAGES.house

  return (
    <article className="property-card" onClick={() => navigate(`/propiedades/${property.id}`)}>
      <div className="property-card-image">
        <img src={imgSrc} alt={property.title} loading="lazy" />
        <div className="image-overlay" />
        <div className="property-card-badges">
          <span className="property-card-badge type">{TYPE_LABELS[property.type] || property.type}</span>
          <span className="property-card-badge operation">{OPERATION_LABELS[property.operation] || property.operation}</span>
        </div>
        <div className="property-card-price">
          {formatPrice(property.price, property.operation)}
        </div>
        {property.video_url && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--accent)"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
      <div className="property-card-body">
        <h3 className="property-card-title">{property.title}</h3>
        {property.location && (
          <div className="property-card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {property.location}
          </div>
        )}
        <div className="property-card-features">
          {property.bedrooms > 0 && (
            <span className="property-card-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4v16M2 8h20M2 16h20M22 4v16" />
              </svg>
              {property.bedrooms} recámaras
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="property-card-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6M8 12V4h8v8" />
              </svg>
              {property.bathrooms} baños
            </span>
          )}
          {property.area > 0 && (
            <span className="property-card-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 3v18" />
              </svg>
              {property.area} m²
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
