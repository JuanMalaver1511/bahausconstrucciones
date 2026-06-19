import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data.json');
const DATABASE_URL = process.env.DATABASE_URL;

const USE_PG = !!DATABASE_URL;
let pgPool = null;

if (USE_PG) {
  pgPool = new pg.Pool({ connectionString: DATABASE_URL });
}

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

// ─── JSON helpers ──────────────────────────────────────────────
function defaultDB() {
  return {
    users: [{
      id: 1,
      username: 'admin',
      password: crypto.createHash('sha256').update('admin123').digest('hex'),
      created_at: now(),
    }],
    sessions: [],
    properties: [],
    nextId: 1,
  };
}

function jsonRead() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    const db = defaultDB();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    return db;
  }
}

function jsonWrite(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ─── PostgreSQL helpers ─────────────────────────────────────────
async function pgQuery(sql, params = []) {
  const client = await pgPool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } finally {
    client.release();
  }
}

async function pgInit() {
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      token VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(12,2),
      type VARCHAR(50),
      operation VARCHAR(50) DEFAULT 'sale',
      bedrooms INTEGER,
      bathrooms INTEGER,
      area NUMERIC(10,2),
      location VARCHAR(255),
      images JSONB DEFAULT '[]',
      video_url TEXT,
      featured INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const userExists = await pgQuery('SELECT id FROM users WHERE username = $1', ['admin']);
  if (userExists.rows.length === 0) {
    const hash = crypto.createHash('sha256').update('admin123').digest('hex');
    await pgQuery('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hash]);
  }
}

// ─── Public API ─────────────────────────────────────────────────
export async function initDB() {
  if (USE_PG) {
    await pgInit();
    console.log('Base de datos conectada (PostgreSQL)');
  } else {
    jsonRead();
    console.log('Base de datos inicializada (JSON)');
  }
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function getProperties(filters = {}) {
  if (USE_PG) {
    let sql = 'SELECT * FROM properties';
    const clauses = [];
    const params = [];
    let idx = 1;

    if (filters.type && filters.type !== 'all') {
      clauses.push(`type = $${idx++}`);
      params.push(filters.type);
    }
    if (filters.operation && filters.operation !== 'all') {
      clauses.push(`operation = $${idx++}`);
      params.push(filters.operation);
    }
    if (filters.featured === 'true' || filters.featured === '1') {
      clauses.push('featured = 1');
    }
    if (filters.search) {
      clauses.push(`(LOWER(title) LIKE $${idx} OR LOWER(description) LIKE $${idx} OR LOWER(location) LIKE $${idx})`);
      params.push(`%${filters.search.toLowerCase()}%`);
      idx++;
    }

    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    const result = await pgQuery(sql, params);
    return result.rows.map(pgRow);
  }

  const db = jsonRead();
  let list = [...db.properties];
  if (filters.type && filters.type !== 'all') list = list.filter(p => p.type === filters.type);
  if (filters.operation && filters.operation !== 'all') list = list.filter(p => p.operation === filters.operation);
  if (filters.featured === 'true' || filters.featured === '1') list = list.filter(p => p.featured);
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || (p.location && p.location.toLowerCase().includes(s)));
  }
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getProperty(id) {
  if (USE_PG) {
    const result = await pgQuery('SELECT * FROM properties WHERE id = $1', [Number(id)]);
    return result.rows.length ? pgRow(result.rows[0]) : null;
  }
  const db = jsonRead();
  return db.properties.find(p => p.id === Number(id)) || null;
}

export async function createProperty(data) {
  if (USE_PG) {
    const result = await pgQuery(`
      INSERT INTO properties (title, description, price, type, operation, bedrooms, bathrooms, area, location, images, video_url, featured)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      data.title,
      data.description,
      Number(data.price),
      data.type,
      data.operation || 'sale',
      data.bedrooms ? Number(data.bedrooms) : null,
      data.bathrooms ? Number(data.bathrooms) : null,
      data.area ? Number(data.area) : null,
      data.location || null,
      JSON.stringify(data.images || []),
      data.video_url || null,
      data.featured ? 1 : 0,
    ]);
    return pgRow(result.rows[0]);
  }

  const db = jsonRead();
  const property = {
    id: db.nextId++,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    type: data.type,
    operation: data.operation || 'sale',
    bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
    bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
    area: data.area ? Number(data.area) : null,
    location: data.location || null,
    images: data.images || [],
    video_url: data.video_url || null,
    featured: data.featured ? 1 : 0,
    created_at: now(),
    updated_at: now(),
  };
  db.properties.push(property);
  jsonWrite(db);
  return property;
}

export async function updateProperty(id, data) {
  if (USE_PG) {
    const fields = ['title', 'description', 'price', 'type', 'operation', 'bedrooms', 'bathrooms', 'area', 'location', 'video_url', 'featured'];
    const sets = [];
    const params = [];
    let idx = 1;

    for (const key of fields) {
      if (data[key] !== undefined && data[key] !== null) {
        let val = data[key];
        if (['price', 'bedrooms', 'bathrooms', 'area'].includes(key)) val = Number(val);
        if (key === 'featured') val = val ? 1 : 0;
        sets.push(`${key} = $${idx++}`);
        params.push(val);
      }
    }
    if (data.images !== undefined) {
      sets.push(`images = $${idx++}`);
      params.push(JSON.stringify(data.images));
    }
    if (sets.length === 0) return null;

    sets.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(Number(id));

    const result = await pgQuery(`UPDATE properties SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`, params);
    return result.rows.length ? pgRow(result.rows[0]) : null;
  }

  const db = jsonRead();
  const idx = db.properties.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  const existing = db.properties[idx];
  const fields = ['title', 'description', 'price', 'type', 'operation', 'bedrooms', 'bathrooms', 'area', 'location', 'video_url', 'featured'];
  for (const key of fields) {
    if (data[key] !== undefined && data[key] !== null) {
      let val = data[key];
      if (['price', 'bedrooms', 'bathrooms', 'area'].includes(key)) val = Number(val);
      if (key === 'featured') val = val ? 1 : 0;
      existing[key] = val;
    }
  }
  if (data.images !== undefined) existing.images = data.images;
  existing.updated_at = now();
  db.properties[idx] = existing;
  jsonWrite(db);
  return existing;
}

export async function deleteProperty(id) {
  if (USE_PG) {
    const result = await pgQuery('DELETE FROM properties WHERE id = $1 RETURNING id', [Number(id)]);
    return result.rows.length > 0;
  }
  const db = jsonRead();
  const idx = db.properties.findIndex(p => p.id === Number(id));
  if (idx === -1) return false;
  db.properties.splice(idx, 1);
  jsonWrite(db);
  return true;
}

export async function authenticateUser(username, password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (USE_PG) {
    const result = await pgQuery('SELECT id, username FROM users WHERE username = $1 AND password = $2', [username, hash]);
    return result.rows.length ? result.rows[0] : null;
  }
  const db = jsonRead();
  return db.users.find(u => u.username === username && u.password === hash) || null;
}

export async function createSession(userId) {
  const token = crypto.randomBytes(48).toString('hex');
  if (USE_PG) {
    await pgQuery('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [userId, token]);
    return token;
  }
  const db = jsonRead();
  db.sessions.push({ id: Date.now(), user_id: userId, token, created_at: now() });
  jsonWrite(db);
  return token;
}

export async function validateSession(token) {
  if (USE_PG) {
    const result = await pgQuery('SELECT user_id FROM sessions WHERE token = $1', [token]);
    return result.rows.length ? result.rows[0].user_id : null;
  }
  const db = jsonRead();
  const session = db.sessions.find(s => s.token === token);
  return session ? session.user_id : null;
}

export async function destroySession(token) {
  if (USE_PG) {
    await pgQuery('DELETE FROM sessions WHERE token = $1', [token]);
    return;
  }
  const db = jsonRead();
  db.sessions = db.sessions.filter(s => s.token !== token);
  jsonWrite(db);
}

// ─── Helpers ──────────────────────────────────────────────────
function pgRow(r) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    price: Number(r.price),
    type: r.type,
    operation: r.operation,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    area: r.area ? Number(r.area) : null,
    location: r.location,
    images: typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || []),
    video_url: r.video_url || null,
    featured: r.featured ? 1 : 0,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}
