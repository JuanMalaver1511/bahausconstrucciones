import { useState, useEffect, useRef } from 'react'
import { api } from '../api'

const initialData = {
  title: '',
  description: '',
  price: '',
  type: 'house',
  operation: 'sale',
  bedrooms: '',
  bathrooms: '',
  area: '',
  location: '',
  video_url: '',
  featured: false,
  images: [],
}

export default function PropertyForm({ property, onSave, onCancel }) {
  const [form, setForm] = useState(initialData)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title || '',
        description: property.description || '',
        price: property.price?.toString() || '',
        type: property.type || 'house',
        operation: property.operation || 'sale',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        location: property.location || '',
        video_url: property.video_url || '',
        featured: !!property.featured,
        images: property.images || [],
      })
      setImages(property.images || [])
    }
  }, [property])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleUpload = async (files) => {
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const data = await api.uploadImages(Array.from(files))
      const newImages = [...images, ...data.files]
      setImages(newImages)
      set('images', newImages)
    } catch (err) {
      setError(err.message)
    }
    setUploading(false)
  }

  const removeImage = async (filename) => {
    try {
      await api.deleteImage(filename)
    } catch {}
    const newImages = images.filter(i => i !== filename)
    setImages(newImages)
    set('images', newImages)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.description || !form.price) {
      setError('Título, descripción y precio son requeridos')
      return
    }
    setSaving(true)
    try {
      await onSave({ ...form, images })
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  return (
    <form className="property-form-wrap" onSubmit={handleSubmit}>
      <h2>{property ? 'Editar propiedad' : 'Nueva propiedad'}</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>Título</label>
          <input type="text" value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min="0" />
        </div>
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="apartment">Apartamento</option>
            <option value="studio">Apartaestudio</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
          </select>
        </div>
        <div className="form-group">
          <label>Operación</label>
          <select value={form.operation} onChange={e => set('operation', e.target.value)}>
            <option value="sale">Venta</option>
            <option value="rent">Renta</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Recámaras</label>
          <input type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} min="0" />
        </div>
        <div className="form-group">
          <label>Baños</label>
          <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} min="0" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Área (m²)</label>
          <input type="number" value={form.area} onChange={e => set('area', e.target.value)} min="0" />
        </div>
        <div className="form-group">
          <label>Ubicación</label>
          <input type="text" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
      </div>

      <div className="form-checkbox">
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
        <label htmlFor="featured">Proyecto destacado</label>
      </div>

      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>Video (YouTube / Vimeo URL)</label>
        <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
      </div>

      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>Imágenes</label>
        <div
          className={`image-upload-area ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p><strong>Haz clic</strong> o arrastra imágenes aquí</p>
          <small>JPG, PNG, WebP. Máximo 10MB por imagen.</small>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleUpload(e.target.files)}
          />
        </div>
        {uploading && <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Subiendo imágenes...</p>}
        {images.length > 0 && (
          <div className="image-previews">
            {images.map((img, i) => (
              <div key={i} className="image-preview">
                <img src={`/uploads/${img}`} alt="" />
                <button type="button" onClick={() => removeImage(img)} aria-label="Eliminar imagen">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {saving ? 'Guardando...' : property ? 'Actualizar propiedad' : 'Crear propiedad'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}
