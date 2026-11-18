import { db } from '../../db/connection.js';
import crypto from 'node:crypto';

export interface Store {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  isActive: number;
  createdAt: string;
}

export function getAllStores(): Store[] {
  const stmt = db.prepare(`
    SELECT id, code, name, city, country, is_active as isActive, created_at as createdAt
    FROM stores
    WHERE is_active = 1
    ORDER BY country, city, name
  `);
  return stmt.all() as unknown as Store[];
}

export function getStoreById(id: string): Store | null {
  const stmt = db.prepare(`
    SELECT id, code, name, city, country, is_active as isActive, created_at as createdAt
    FROM stores
    WHERE id = ?
  `);
  const row = stmt.get(id);
  return (row as unknown as Store) || null;
}

export function createStore(data: { code: string; name: string; city: string; country: string }): Store {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO stores (id, code, name, city, country, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);

  stmt.run(id, data.code.toUpperCase(), data.name, data.city, data.country, createdAt);
  return getStoreById(id)!;
}
