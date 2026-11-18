import { db, initSchema } from './connection.js';
import { hashPassword } from '../modules/auth/crypto.js';
import crypto from 'node:crypto';

export function runSeed(force = false) {
  initSchema();

  // Check if already seeded
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
  if (userCount > 0 && !force) {
    console.log('[SEED] Base de datos ya inicializada con datos.');
    return;
  }

  if (force) {
    console.log('[SEED] Limpiando tablas previas...');
    db.exec(`
      DELETE FROM audit_logs;
      DELETE FROM product_stores;
      DELETE FROM products;
      DELETE FROM users;
      DELETE FROM categories;
      DELETE FROM stores;
    `);
  }

  console.log('[SEED] Creando tiendas multinacionales...');
  const stores = [
    { id: 'store-bog-01', code: 'BOG-01', name: 'Hipermercado Bogotá Norte', city: 'Bogotá', country: 'Colombia' },
    { id: 'store-med-01', code: 'MED-01', name: 'Supercentro Medellín El Poblado', city: 'Medellín', country: 'Colombia' },
    { id: 'store-mad-01', code: 'MAD-01', name: 'Macrotienda Madrid Castellana', city: 'Madrid', country: 'España' },
    { id: 'store-bcn-01', code: 'BCN-01', name: 'Supermercado Barcelona Diagonal', city: 'Barcelona', country: 'España' },
    { id: 'store-mex-01', code: 'MEX-01', name: 'Hiper Polanco CDMX', city: 'Ciudad de México', country: 'México' },
    { id: 'store-bue-01', code: 'BUE-01', name: 'Centro Comercial Palermo', city: 'Buenos Aires', country: 'Argentina' }
  ];

  const insertStore = db.prepare(`
    INSERT INTO stores (id, code, name, city, country, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);
  const now = new Date().toISOString();
  for (const s of stores) {
    insertStore.run(s.id, s.code, s.name, s.city, s.country, now);
  }

  console.log('[SEED] Creando categorías...');
  const categories = [
    { id: 'cat-frut-verd', name: 'Frutas y Verduras (PLU)', slug: 'frutas-verduras', icon: 'Apple' },
    { id: 'cat-panaderia', name: 'Panadería y Pastelería', slug: 'panaderia', icon: 'Croissant' },
    { id: 'cat-carniceria', name: 'Carnicería y Pescadería', slug: 'carniceria', icon: 'Beef' },
    { id: 'cat-lacteos', name: 'Lácteos y Huevos', slug: 'lacteos', icon: 'Milk' },
    { id: 'cat-bebidas', name: 'Bebidas y Licores', slug: 'bebidas', icon: 'Coffee' },
    { id: 'cat-abarrotes', name: 'Abarrotes y Despensa', slug: 'abarrotes', icon: 'Package' },
    { id: 'cat-limpieza', name: 'Aseo y Hogar', slug: 'limpieza', icon: 'Sparkles' }
  ];

  const insertCat = db.prepare('INSERT INTO categories (id, name, slug, icon) VALUES (?, ?, ?, ?)');
  for (const c of categories) {
    insertCat.run(c.id, c.name, c.slug, c.icon);
  }

  console.log('[SEED] Creando usuarios...');
  const adminPass = hashPassword('admin123');
  const cashierPass = hashPassword('cajero123');

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, salt, name, role, store_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr-admin-01',
    'admin@actinvent.com',
    adminPass.hash,
    adminPass.salt,
    'Carlos Mendoza (Supervisor General)',
    'admin',
    null,
    now
  );

  insertUser.run(
    'usr-cajero-01',
    'cajero@actinvent.com',
    cashierPass.hash,
    cashierPass.salt,
    'Laura Gómez (Cajera Principal)',
    'cajero',
    'store-bog-01',
    now
  );

  insertUser.run(
    'usr-cajero-02',
    'miguel@actinvent.com',
    cashierPass.hash,
    cashierPass.salt,
    'Miguel Ángel Ruiz (Cajero Turno Tarde)',
    'cajero',
    'store-mad-01',
    now
  );

  console.log('[SEED] Creando productos (Actuales y Nuevos)...');
  const products = [
    // --- PRODUCTOS NUEVOS (Recién llegados a las tiendas) ---
    {
      code: '4988',
      barcode: '7701234004988',
      name: 'Pitahaya Amarilla Importada Premium',
      description: 'Fruta exótica fresca por kilo. Piel amarilla con escamas, pulpa blanca con semillas negras dulces.',
      categoryId: 'cat-frut-verd',
      isNew: 1,
      price: 4.85,
      unit: 'kg',
      notes: '¡NUEVO CÓDIGO! Ingresó esta semana. No confundir con la pitahaya roja (PLU 4989).',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-mex-01']
    },
    {
      code: '4225',
      barcode: '7701234004225',
      name: 'Aguacate Hass Orgánico en Malla',
      description: 'Malla con 4 unidades de aguacate Hass certificado de origen. Maduración media.',
      categoryId: 'cat-frut-verd',
      isNew: 1,
      price: 3.90,
      unit: 'malla',
      notes: '¡NUEVO CÓDIGO! Reemplaza al anterior código temporal de granel.',
      stores: ['store-bog-01', 'store-med-01', 'store-bcn-01', 'store-bue-01']
    },
    {
      code: '3107',
      barcode: '7701234003107',
      name: 'Pan Sourdough Masa Madre 500g',
      description: 'Hogaza de pan artesanal fermentada 48 horas con masa madre pura. Corteza crujiente.',
      categoryId: 'cat-panaderia',
      isNew: 1,
      price: 3.50,
      unit: 'und',
      notes: '¡NUEVO PRODUCTO! Se hornea diariamente a las 8am y 3pm.',
      stores: ['store-mad-01', 'store-bcn-01', 'store-bog-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '5540',
      barcode: '7701234005540',
      name: 'Mango Tommy Atkins de Temporada',
      description: 'Mango dulce de gran tamaño, pulpa firme y aromática.',
      categoryId: 'cat-frut-verd',
      isNew: 1,
      price: 2.30,
      unit: 'kg',
      notes: '¡NUEVO CÓDIGO! Promoción quincenal en tiendas de Latinoamérica.',
      stores: ['store-bog-01', 'store-med-01', 'store-mex-01']
    },
    {
      code: '7892',
      barcode: '7701234007892',
      name: 'Croissant Francés de Almendras',
      description: 'Croissant relleno de crema frangipane y cubierto con almendras laminadas tostadas.',
      categoryId: 'cat-panaderia',
      isNew: 1,
      price: 2.20,
      unit: 'und',
      notes: '¡NUEVA LÍNEA! Disponible en cafetería y sección gourmet.',
      stores: ['store-mad-01', 'store-bcn-01', 'store-bog-01']
    },
    {
      code: '1044',
      barcode: '7701234001044',
      name: 'Filete de Salmón Noruego en Bandeja',
      description: 'Corte fino de salmón fresco sin piel ni espinas, empacado al vacío.',
      categoryId: 'cat-carniceria',
      isNew: 1,
      price: 14.50,
      unit: 'kg',
      notes: '¡NUEVO CÓDIGO! Pesar en balanza de caja registradora.',
      stores: ['store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bog-01']
    },
    {
      code: '6120',
      barcode: '7701234006120',
      name: 'Bebida de Avena Barista Edición Especial 1L',
      description: 'Bebida vegetal enriquecida con calcio y vitaminas D y B12, ideal para espuma de café.',
      categoryId: 'cat-lacteos',
      isNew: 1,
      price: 2.45,
      unit: 'und',
      notes: '¡NUEVO INGRESO! Sin lactosa, apto vegano.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '8831',
      barcode: '7701234008831',
      name: 'Detergente Líquido Lavanda Botella Eco 3L',
      description: 'Fórmula ultra concentrada biodegradable con aroma prolongado a lavanda provenzal.',
      categoryId: 'cat-limpieza',
      isNew: 1,
      price: 8.95,
      unit: 'und',
      notes: '¡NUEVO LANZAMIENTO! Sustituye la botella azul tradicional.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-mex-01']
    },

    // --- PRODUCTOS ACTUALES (Clásicos y frecuentes que los cajeros ya conocen o deben consultar) ---
    {
      code: '4011',
      barcode: '7701234004011',
      name: 'Banano Criollo Granel',
      description: 'Plátano maduro estándar nacional, venta por peso.',
      categoryId: 'cat-frut-verd',
      isNew: 0,
      price: 1.25,
      unit: 'kg',
      notes: 'Código universal de cajero más vendido.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '4065',
      barcode: '7701234004065',
      name: 'Pimentón Verde / Morrón',
      description: 'Pimiento fresco verde para cocina, venta al peso.',
      categoryId: 'cat-frut-verd',
      isNew: 0,
      price: 2.10,
      unit: 'kg',
      notes: 'Verificar estado sin humedad antes de pesar.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '4087',
      barcode: '7701234004087',
      name: 'Tomate Chonto Rojo',
      description: 'Tomate para ensalada o guiso, seleccionado por calidad.',
      categoryId: 'cat-frut-verd',
      isNew: 0,
      price: 1.80,
      unit: 'kg',
      notes: 'Código estándar en todas las terminales POS.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '4131',
      barcode: '7701234004131',
      name: 'Manzana Gala Roja',
      description: 'Manzana crujiente y dulce origen Chile / Washington.',
      categoryId: 'cat-frut-verd',
      isNew: 0,
      price: 3.40,
      unit: 'kg',
      notes: 'No confundir con Manzana Fuji (código 4129).',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '4062',
      barcode: '7701234004062',
      name: 'Pepino Cohombro Granel',
      description: 'Pepino fresco para ensaladas, textura firme.',
      categoryId: 'cat-frut-verd',
      isNew: 0,
      price: 1.40,
      unit: 'kg',
      notes: 'Venta por peso en balanza.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '3010',
      barcode: '7701234003010',
      name: 'Baguette Tradicional Rústica 250g',
      description: 'Barra de pan blanco recién horneada.',
      categoryId: 'cat-panaderia',
      isNew: 0,
      price: 0.95,
      unit: 'und',
      notes: 'Venta por unidad.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '2001',
      barcode: '7701234002001',
      name: 'Carne Molida Especial de Res (85/15)',
      description: 'Carne molida magra de primera calidad.',
      categoryId: 'cat-carniceria',
      isNew: 0,
      price: 7.90,
      unit: 'kg',
      notes: 'Pesar con bandeja tara 12.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '5002',
      barcode: '7701234005002',
      name: 'Huevos Rojos Tipo AA Cubeta x30',
      description: 'Cubeta de cartón con 30 huevos frescos seleccionados.',
      categoryId: 'cat-lacteos',
      isNew: 0,
      price: 5.60,
      unit: 'paquete',
      notes: 'Revisar que la cubeta esté sellada con cinta de seguridad.',
      stores: ['store-bog-01', 'store-med-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '6001',
      barcode: '7701234006001',
      name: 'Leche Entera UHT Tetrapak 1L',
      description: 'Leche pasteurizada enriquecida con vitaminas A y D.',
      categoryId: 'cat-lacteos',
      isNew: 0,
      price: 1.15,
      unit: 'und',
      notes: 'Código de barra principal en el envase.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '7001',
      barcode: '7701234007001',
      name: 'Arroz Blanco Tradicional Grano Largo 1kg',
      description: 'Bolsa de arroz blanco premium de rápida cocción.',
      categoryId: 'cat-abarrotes',
      isNew: 0,
      price: 1.35,
      unit: 'und',
      notes: 'Abarrote básico de alta rotación.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '7005',
      barcode: '7701234007005',
      name: 'Aceite Vegetal Puro de Girasol 900ml',
      description: 'Botella PET de aceite comestible 100% vegetal.',
      categoryId: 'cat-abarrotes',
      isNew: 0,
      price: 3.40,
      unit: 'und',
      notes: 'Verificar tapa sellada en caja.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    },
    {
      code: '8020',
      barcode: '7701234008020',
      name: 'Papel Higiénico Triple Hoja Paquete x12',
      description: 'Rollos de papel higiénico suave con extracto de algodón.',
      categoryId: 'cat-limpieza',
      isNew: 0,
      price: 6.80,
      unit: 'paquete',
      notes: 'Cuidado al escanear, código en lateral inferior.',
      stores: ['store-bog-01', 'store-med-01', 'store-mad-01', 'store-bcn-01', 'store-mex-01', 'store-bue-01']
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (
      id, code, barcode, name, description, category_id,
      is_new, price, unit, status, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
  `);

  const insertProdStore = db.prepare('INSERT INTO product_stores (product_id, store_id) VALUES (?, ?)');

  for (const p of products) {
    const prodId = crypto.randomUUID();
    insertProd.run(
      prodId,
      p.code,
      p.barcode,
      p.name,
      p.description,
      p.categoryId,
      p.isNew,
      p.price,
      p.unit,
      p.notes,
      now,
      now
    );

    for (const storeId of p.stores) {
      insertProdStore.run(prodId, storeId);
    }
  }

  console.log(`[SEED] ¡Inicialización completa! ${products.length} productos sembrados (${products.filter(p => p.isNew).length} Nuevos).`);
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed(process.argv.includes('--force'));
}
