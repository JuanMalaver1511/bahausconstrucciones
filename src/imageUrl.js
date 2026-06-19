export function imageUrl(img) {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  if (img.startsWith('/uploads/')) return img
  return `/uploads/${img}`
}
