import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { runSeed } from '../db/seed.js';
import { getProducts, getProductById, createProduct, toggleProductNewStatus } from '../modules/products/products.service.js';

describe('Products & Cashier Codes Module', () => {
  before(() => {
    // Run seed to ensure data is present
    runSeed(false);
  });

  test('debe listar productos con estado activo', () => {
    const res = getProducts();
    assert.ok(res.total > 0, 'Debe haber productos registrados');
    assert.ok(res.items.length > 0, 'Debe retornar elementos');
    assert.ok(res.items[0].code, 'El producto debe tener código para cajero');
  });

  test('debe filtrar exclusivamente por productos nuevos (is_new = 1)', () => {
    const res = getProducts({ isNew: 1 });
    assert.ok(res.items.length > 0, 'Debe haber productos nuevos');
    for (const item of res.items) {
      assert.strictEqual(item.isNew, 1, `El producto ${item.code} debe ser nuevo`);
    }
  });

  test('debe filtrar por productos actuales (is_new = 0)', () => {
    const res = getProducts({ isNew: 0 });
    assert.ok(res.items.length > 0, 'Debe haber productos actuales');
    for (const item of res.items) {
      assert.strictEqual(item.isNew, 0, `El producto ${item.code} debe ser actual`);
    }
  });

  test('debe buscar productos por código PLU exacto o parcial', () => {
    const res = getProducts({ search: '4011' });
    assert.ok(res.items.length > 0, 'Debe encontrar el código 4011');
    assert.strictEqual(res.items[0].code, '4011');
    assert.match(res.items[0].name.toLowerCase(), /banano/);
  });

  test('debe buscar productos por nombre', () => {
    const res = getProducts({ search: 'Pitahaya' });
    assert.ok(res.items.length > 0);
    assert.strictEqual(res.items[0].code, '4988');
  });

  test('debe permitir a un administrador crear un nuevo producto con código único', () => {
    const testCode = `TEST-${Date.now().toString().slice(-4)}`;
    const newProd = createProduct({
      code: testCode,
      barcode: '7709999000111',
      name: 'Kiwi Dorado de Prueba',
      description: 'Prueba de ingreso de nuevo producto',
      categoryId: 'cat-frut-verd',
      isNew: true,
      price: 5.20,
      unit: 'kg',
      notes: 'Nota para el cajero sobre el producto de prueba'
    }, 'usr-admin-01');

    assert.strictEqual(newProd.code, testCode);
    assert.strictEqual(newProd.isNew, 1);
    assert.strictEqual(newProd.price, 5.20);

    // Verify retrieval by ID
    const retrieved = getProductById(newProd.id);
    assert.ok(retrieved);
    assert.strictEqual(retrieved.code, testCode);
  });

  test('debe rechazar la creación si el código ya existe (código duplicado)', () => {
    assert.throws(() => {
      createProduct({
        code: '4011', // Duplicate of Banano
        name: 'Otro Banano',
        categoryId: 'cat-frut-verd',
        price: 2.0
      }, 'usr-admin-01');
    }, (err: any) => {
      return err.code === 'CODE_EXISTS' && err.statusCode === 409;
    });
  });

  test('debe permitir cambiar el estado de nuevo a actual mediante toggle', () => {
    const allNew = getProducts({ isNew: 1 });
    const target = allNew.items[0];

    const updated = toggleProductNewStatus(target.id, 'usr-admin-01');
    assert.strictEqual(updated.isNew, 0);

    // Toggle back
    const restored = toggleProductNewStatus(target.id, 'usr-admin-01');
    assert.strictEqual(restored.isNew, 1);
  });
});
