import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), 'actinvent.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Configure SQLite optimizations, timeout and integrity
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA busy_timeout = 5000;');
try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch {
  // Ignore if already set or locked
}
db.exec('PRAGMA synchronous = NORMAL;');

export function initSchema() {
  db.exec(`
    -- Tiendas de la multinacional
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      created_at TEXT NOT NULL
    );

    -- Categorías de productos (Frutas/Verduras, Panadería, Carnicería, Abarrotes, etc.)
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL DEFAULT 'Tag'
    );

    -- Usuarios (Admin y Cajeros)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'cajero')),
      store_id TEXT REFERENCES stores(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL
    );

    -- Productos (con códigos PLU/internos que los cajeros deben saber)
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      barcode TEXT,
      name TEXT NOT NULL,
      description TEXT,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      is_new INTEGER NOT NULL DEFAULT 1 CHECK(is_new IN (0, 1)),
      price REAL NOT NULL CHECK(price >= 0),
      unit TEXT NOT NULL DEFAULT 'und',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Relación muchos a muchos: productos por tienda
    CREATE TABLE IF NOT EXISTS product_stores (
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      PRIMARY KEY (product_id, store_id)
    );

    -- Auditoría de cambios (quién agregó o modificó productos)
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip TEXT,
      created_at TEXT NOT NULL
    );

    -- Índices para optimizar búsquedas rápidas de cajeros (código, nombre, barcode, is_new)
    CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
    CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
    CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_product_stores_store ON product_stores(store_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
  `);
}
