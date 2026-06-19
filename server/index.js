import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { initDB, getProperties, getProperty, createProperty, updateProperty, deleteProperty, authenticateUser, createSession, validateSession, destroySession } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USE_CLOUDINARY = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (USE_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|avif)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif, webp, avif)'));
    }
  }
});

async function start() {
  await initDB();

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = auth.slice(7);
  const userId = await validateSession(token);
  if (!userId) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  req.userId = userId;
  next();
}

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  const user = await authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = await createSession(user.id);
  res.json({ token, username: user.username });
});

app.post('/api/admin/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization.slice(7);
  await destroySession(token);
  res.json({ success: true });
});

app.get('/api/properties', async (req, res) => {
  try {
    const { type, operation, search, featured } = req.query;
    const properties = await getProperties({ type, operation, search, featured });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await getProperty(Number(req.params.id));
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener propiedad' });
  }
});

app.post('/api/properties', requireAuth, async (req, res) => {
  try {
    const { title, description, price, type, operation, bedrooms, bathrooms, area, location, images, video_url, featured } = req.body;
    if (!title || !description || !price || !type) {
      return res.status(400).json({ error: 'Título, descripción, precio y tipo son requeridos' });
    }
    const property = await createProperty({ title, description, price, type, operation, bedrooms, bathrooms, area, location, images, video_url, featured });
    res.status(201).json(property);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Error al crear propiedad' });
  }
});

app.put('/api/properties/:id', requireAuth, async (req, res) => {
  try {
    const property = await updateProperty(Number(req.params.id), req.body);
    if (!property) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(property);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: 'Error al actualizar propiedad' });
  }
});

app.delete('/api/properties/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await deleteProperty(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar propiedad' });
  }
});

app.post('/api/upload', requireAuth, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se subieron archivos' });
  }

  const files = [];
  for (const file of req.files) {
    if (USE_CLOUDINARY) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'bahaus', resource_type: 'image' },
            (err, result) => err ? reject(err) : resolve(result)
          );
          stream.end(file.buffer);
        });
        files.push(result.secure_url);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ error: 'Error al subir imagen a Cloudinary' });
      }
    } else {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(file.originalname).toLowerCase();
      const name = crypto.randomBytes(16).toString('hex') + ext;
      fs.writeFileSync(path.join(uploadsDir, name), file.buffer);
      files.push(name);
    }
  }

  res.json({ files });
});

app.delete('/api/upload/:filename', requireAuth, async (req, res) => {
  const { filename } = req.params;
  if (USE_CLOUDINARY) {
    try {
      const publicId = filename.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`bahaus/${publicId}`);
    } catch {}
    return res.json({ success: true });
  }
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin/login`);
});
}

start();
