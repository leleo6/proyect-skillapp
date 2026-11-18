import { db } from '../../db/connection.js';
import crypto from 'node:crypto';
import { logAudit } from '../audit/audit.service.js';

export interface ProductFilter {
  search?: string;
  isNew?: number; // 1 = nuevo, 0 = actual
  categoryId?: string;
  storeId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ProductInput {
  code: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId: string;
  isNew?: boolean | number;
  price: number;
  unit?: string;
  status?: 'active' | 'inactive';
  notes?: string | null;
  storeIds?: string[];
}

export interface StoreBrief {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface ProductResult {
  id: string;
  code: string;
  barcode: string | null;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  isNew: number;
  price: number;
  unit: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  stores: StoreBrief[];
}

export function getAllCategories() {
  const stmt = db.prepare(`
    SELECT c.id, c.name, c.slug, c.icon,
           COUNT(p.id) as productCount,
           SUM(CASE WHEN p.is_new = 1 THEN 1 ELSE 0 END) as newProductCount
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
    GROUP BY c.id
    ORDER BY c.name
  `);
  return stmt.all();
}

export function getProducts(filters: ProductFilter = {}): { total: number; items: ProductResult[] } {
  let whereClauses: string[] = ["p.status = 'active'"];
  const params: Array<string | number> = [];

  if (filters.status && filters.status !== 'all') {
    whereClauses = [`p.status = ?`];
    params.push(filters.status);
  }

  if (filters.isNew !== undefined && filters.isNew !== null) {
    whereClauses.push(`p.is_new = ?`);
    params.push(Number(filters.isNew));
  }

  if (filters.categoryId) {
    whereClauses.push(`p.category_id = ?`);
    params.push(filters.categoryId);
  }

  if (filters.storeId) {
    whereClauses.push(`EXISTS (
      SELECT 1 FROM product_stores ps 
      WHERE ps.product_id = p.id AND ps.store_id = ?
    )`);
    params.push(filters.storeId);
  }

  if (filters.search && filters.search.trim()) {
    const term = `%${filters.search.trim()}%`;
    whereClauses.push(`(
      p.code LIKE ? OR 
      p.barcode LIKE ? OR 
      p.name LIKE ? OR 
      p.description LIKE ?
    )`);
    params.push(term, term, term, term);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM products p ${whereSQL}`);
  const countRow = countStmt.get(...params) as { count: number };
  const total = countRow ? countRow.count : 0;

  // Ordering: New products first, then recently updated, then code
  let querySQL = `
    SELECT 
      p.id, p.code, p.barcode, p.name, p.description,
      p.category_id as categoryId, c.name as categoryName, c.icon as categoryIcon,
      p.is_new as isNew, p.price, p.unit, p.status, p.notes,
      p.created_at as createdAt, p.updated_at as updatedAt
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ${whereSQL}
    ORDER BY p.is_new DESC, p.updated_at DESC, p.code ASC
  `;

  if (filters.limit) {
    querySQL += ` LIMIT ?`;
    params.push(filters.limit);
    if (filters.offset) {
      querySQL += ` OFFSET ?`;
      params.push(filters.offset);
    }
  }

  const stmt = db.prepare(querySQL);
  const rows = stmt.all(...params) as unknown as Omit<ProductResult, 'stores'>[];

  // Attach store lists to products efficiently
  if (rows.length === 0) {
    return { total, items: [] };
  }

  const productIds = rows.map(r => r.id);
  const placeholders = productIds.map(() => '?').join(',');
  const storesStmt = db.prepare(`
    SELECT ps.product_id as productId, s.id, s.code, s.name, s.city, s.country
    FROM product_stores ps
    JOIN stores s ON ps.store_id = s.id
    WHERE ps.product_id IN (${placeholders})
    ORDER BY s.country, s.name
  `);

  const storeRows = storesStmt.all(...productIds) as unknown as Array<{
    productId: string;
    id: string;
    code: string;
    name: string;
    city: string;
    country: string;
  }>;

  const storesMap = new Map<string, StoreBrief[]>();
  for (const sr of storeRows) {
    if (!storesMap.has(sr.productId)) {
      storesMap.set(sr.productId, []);
    }
    storesMap.get(sr.productId)!.push({
      id: sr.id,
      code: sr.code,
      name: sr.name,
      city: sr.city,
      country: sr.country
    });
  }

  const items: ProductResult[] = rows.map(r => ({
    ...r,
    stores: storesMap.get(r.id) || []
  }));

  return { total, items };
}

export function getProductById(id: string): ProductResult | null {
  const stmt = db.prepare(`
    SELECT 
      p.id, p.code, p.barcode, p.name, p.description,
      p.category_id as categoryId, c.name as categoryName, c.icon as categoryIcon,
      p.is_new as isNew, p.price, p.unit, p.status, p.notes,
      p.created_at as createdAt, p.updated_at as updatedAt
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `);

  const row = stmt.get(id) as unknown as Omit<ProductResult, 'stores'> | undefined;
  if (!row) return null;

  const storesStmt = db.prepare(`
    SELECT s.id, s.code, s.name, s.city, s.country
    FROM product_stores ps
    JOIN stores s ON ps.store_id = s.id
    WHERE ps.product_id = ?
    ORDER BY s.country, s.name
  `);

  const stores = storesStmt.all(id) as unknown as StoreBrief[];

  return {
    ...row,
    stores
  };
}

export function createProduct(input: ProductInput, userId: string, ip?: string): ProductResult {
  // Validate required fields
  if (!input.code || !input.code.trim()) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'El código del producto es obligatorio' };
  }
  if (!input.name || !input.name.trim()) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'El nombre del producto es obligatorio' };
  }
  if (!input.categoryId) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'La categoría es obligatoria' };
  }
  if (input.price === undefined || input.price < 0) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'El precio debe ser un número mayor o igual a 0' };
  }

  // Check code uniqueness
  const existingCode = db.prepare('SELECT id FROM products WHERE LOWER(code) = LOWER(?)').get(input.code.trim());
  if (existingCode) {
    throw { statusCode: 409, code: 'CODE_EXISTS', message: `El código "${input.code}" ya está asignado a otro producto` };
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const isNewVal = input.isNew === false || input.isNew === 0 ? 0 : 1;

  const insertStmt = db.prepare(`
    INSERT INTO products (
      id, code, barcode, name, description, category_id,
      is_new, price, unit, status, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    id,
    input.code.trim().toUpperCase(),
    input.barcode ? input.barcode.trim() : null,
    input.name.trim(),
    input.description ? input.description.trim() : null,
    input.categoryId,
    isNewVal,
    input.price,
    input.unit || 'und',
    input.status || 'active',
    input.notes ? input.notes.trim() : null,
    now,
    now
  );

  // Link stores
  if (input.storeIds && input.storeIds.length > 0) {
    const insertStore = db.prepare('INSERT OR IGNORE INTO product_stores (product_id, store_id) VALUES (?, ?)');
    for (const storeId of input.storeIds) {
      insertStore.run(id, storeId);
    }
  } else {
    // If no stores specified, assign to all active stores by default
    const allStores = db.prepare('SELECT id FROM stores WHERE is_active = 1').all() as unknown as Array<{ id: string }>;
    const insertStore = db.prepare('INSERT OR IGNORE INTO product_stores (product_id, store_id) VALUES (?, ?)');
    for (const store of allStores) {
      insertStore.run(id, store.id);
    }
  }

  logAudit(userId, 'CREATE_PRODUCT', 'products', id, { code: input.code, name: input.name, isNew: isNewVal }, ip || null);

  return getProductById(id)!;
}

export function updateProduct(id: string, input: Partial<ProductInput>, userId: string, ip?: string): ProductResult {
  const current = getProductById(id);
  if (!current) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Producto no encontrado' };
  }

  if (input.code && input.code.trim().toUpperCase() !== current.code) {
    const existingCode = db.prepare('SELECT id FROM products WHERE LOWER(code) = LOWER(?) AND id != ?')
      .get(input.code.trim(), id);
    if (existingCode) {
      throw { statusCode: 409, code: 'CODE_EXISTS', message: `El código "${input.code}" ya está en uso por otro producto` };
    }
  }

  const now = new Date().toISOString();
  const code = input.code !== undefined ? input.code.trim().toUpperCase() : current.code;
  const barcode = input.barcode !== undefined ? (input.barcode ? input.barcode.trim() : null) : current.barcode;
  const name = input.name !== undefined ? input.name.trim() : current.name;
  const description = input.description !== undefined ? (input.description ? input.description.trim() : null) : current.description;
  const categoryId = input.categoryId !== undefined ? input.categoryId : current.categoryId;
  const isNewVal = input.isNew !== undefined ? (input.isNew ? 1 : 0) : current.isNew;
  const price = input.price !== undefined ? input.price : current.price;
  const unit = input.unit !== undefined ? input.unit : current.unit;
  const status = input.status !== undefined ? input.status : current.status;
  const notes = input.notes !== undefined ? (input.notes ? input.notes.trim() : null) : current.notes;

  const updateStmt = db.prepare(`
    UPDATE products SET
      code = ?, barcode = ?, name = ?, description = ?, category_id = ?,
      is_new = ?, price = ?, unit = ?, status = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `);

  updateStmt.run(code, barcode, name, description, categoryId, isNewVal, price, unit, status, notes, now, id);

  // Update store mappings if provided
  if (input.storeIds !== undefined) {
    db.prepare('DELETE FROM product_stores WHERE product_id = ?').run(id);
    const insertStore = db.prepare('INSERT INTO product_stores (product_id, store_id) VALUES (?, ?)');
    for (const storeId of input.storeIds) {
      insertStore.run(id, storeId);
    }
  }

  logAudit(userId, 'UPDATE_PRODUCT', 'products', id, { code, name, isNew: isNewVal }, ip || null);

  return getProductById(id)!;
}

export function deleteProduct(id: string, userId: string, ip?: string): boolean {
  const current = getProductById(id);
  if (!current) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Producto no encontrado' };
  }

  // Soft delete (status = inactive) or hard delete if desired
  db.prepare("UPDATE products SET status = 'inactive', updated_at = ? WHERE id = ?")
    .run(new Date().toISOString(), id);

  logAudit(userId, 'DEACTIVATE_PRODUCT', 'products', id, { code: current.code, name: current.name }, ip || null);
  return true;
}

export function toggleProductNewStatus(id: string, userId: string, ip?: string): ProductResult {
  const current = getProductById(id);
  if (!current) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Producto no encontrado' };
  }

  const newIsNew = current.isNew === 1 ? 0 : 1;
  const now = new Date().toISOString();

  db.prepare('UPDATE products SET is_new = ?, updated_at = ? WHERE id = ?')
    .run(newIsNew, now, id);

  logAudit(userId, 'TOGGLE_IS_NEW', 'products', id, { code: current.code, previous: current.isNew, current: newIsNew }, ip || null);

  return getProductById(id)!;
}

export function getGeneralStats() {
  const totalProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'active'").get() as { c: number }).c;
  const newProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'active' AND is_new = 1").get() as { c: number }).c;
  const currentProducts = totalProducts - newProducts;
  const totalStores = (db.prepare("SELECT COUNT(*) as c FROM stores WHERE is_active = 1").get() as { c: number }).c;
  const totalCategories = (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c;

  return {
    totalProducts,
    newProducts,
    currentProducts,
    totalStores,
    totalCategories
  };
}
