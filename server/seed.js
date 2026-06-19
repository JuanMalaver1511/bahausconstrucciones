import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data.json');

const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

const properties = [
  {
    id: 1, title: 'Casa Moderna en Lomas Altas', description: 'Hermosa casa de diseño contemporáneo con acabados de lujo. Cuenta con amplios ventanales que brindan luz natural, jardín privado, alberca y roof garden con vista panorámica. Cocina integral equipada, closets inteligentes y sistema de seguridad.', price: 8500000, type: 'house', operation: 'sale', bedrooms: 4, bathrooms: 3, area: 350, location: 'Lomas Altas, CDMX', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], featured: 1, created_at: now, updated_at: now,
  },
  {
    id: 2, title: 'Departamento frente al mar', description: 'Espectacular departamento con vista al mar. Sala-comedor, cocina abierta, 2 recámaras con baño completo cada una. Amenidades: alberca, gimnasio, área de asadores y seguridad 24hrs.', price: 4500000, type: 'apartment', operation: 'sale', bedrooms: 2, bathrooms: 2, area: 120, location: 'Cancún, QRoo', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], featured: 1, created_at: now, updated_at: now,
  },
  {
    id: 3, title: 'Apartaestudio Moderno Bosques', description: 'Moderno apartaestudio con diseño contemporáneo, ideal para profesionales o inversionistas. Cocina integral equipada, baño completo, closet inteligente y balcón con vista a la ciudad. Acabados de primera calidad.', price: 1800000, type: 'studio', operation: 'sale', bedrooms: 1, bathrooms: 1, area: 45, location: 'Bosques, CDMX', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], featured: 1, created_at: now, updated_at: now,
  },
  {
    id: 4, title: 'Casa Campestre con Alberca', description: 'Encantadora casa en fraccionamiento campestre. 5 recámaras, sala de TV, estudio, cuarto de juegos. Jardín extenso con alberca climatizada, palapa y asador. Ideal para familia que busca espacio y tranquilidad.', price: 6500000, type: 'house', operation: 'sale', bedrooms: 5, bathrooms: 4, area: 450, location: 'Valle de Bravo, EdoMex', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], featured: 0, created_at: now, updated_at: now,
  },
  {
    id: 5, title: 'Departamento Ejecutivo Polanco', description: 'Moderno departamento en el corazón de Polanco. Sala amplia con ventanal, cocina equipada, 2 recámaras con baño y vestidor. Estacionamiento para 2 autos. A pasos de restaurantes y boutiques.', price: 32000, type: 'apartment', operation: 'rent', bedrooms: 2, bathrooms: 2, area: 95, location: 'Polanco, CDMX', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], featured: 0, created_at: now, updated_at: now,
  },
  {
    id: 6, title: 'Departamento Ejecutivo Corporativo', description: 'Departamento ejecutivo de lujo en zona corporativa. Sala amplia con ventanales, cocina integral, 3 recámaras cada una con baño y vestidor. Amenidades: roof garden, gimnasio y seguridad 24hrs.', price: 5500000, type: 'apartment', operation: 'sale', bedrooms: 3, bathrooms: 3, area: 150, location: 'Tlalnepantla, EdoMex', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], featured: 0, created_at: now, updated_at: now,
  },
  {
    id: 7, title: 'Casa de Playa', description: 'Preciosa casa frente al mar con 3 recámaras, alberca infinita, terraza con hamacas y acceso directo a la playa. Cocina exterior con asador. Perfecta para vacaciones o inversión.', price: 18000, type: 'house', operation: 'rent', bedrooms: 3, bathrooms: 2, area: 200, location: 'Tulum, QRoo', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], featured: 0, created_at: now, updated_at: now,
  },
  {
    id: 8, title: 'Oficina Corporativa Reforma', description: 'Oficina de 150 m² en Paseo de la Reforma. Planta libre, recepción, sala de juntas, 3 cubículos privados. Cocinetta, baños y estacionamiento incluido. Vista privilegiada.', price: 45000, type: 'commercial', operation: 'rent', bedrooms: 0, bathrooms: 2, area: 150, location: 'Paseo de la Reforma, CDMX', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], featured: 0, created_at: now, updated_at: now,
  },
];

const db = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: crypto.createHash('sha256').update('admin123').digest('hex'),
      created_at: now,
    },
  ],
  sessions: [],
  properties,
  nextId: 9,
};

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
console.log('Base de datos sembrada con 8 propiedades de ejemplo.');
console.log('Admin: admin / admin123');
