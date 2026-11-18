import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { runSeed } from '../db/seed.js';
import { loginUser } from '../modules/auth/auth.service.js';
import { verifyToken } from '../modules/auth/crypto.js';

describe('Auth & RBAC Module', () => {
  before(() => {
    runSeed(false);
  });

  test('debe autenticar a un usuario admin con credenciales correctas', () => {
    const res = loginUser('admin@actinvent.com', 'admin123');
    assert.ok(res.token, 'Debe devolver un token');
    assert.strictEqual(res.user.role, 'admin');
    assert.strictEqual(res.user.email, 'admin@actinvent.com');

    // Verify token validity
    const decoded = verifyToken(res.token);
    assert.ok(decoded);
    assert.strictEqual(decoded.role, 'admin');
  });

  test('debe autenticar a un usuario cajero con credenciales correctas', () => {
    const res = loginUser('cajero@actinvent.com', 'cajero123');
    assert.ok(res.token);
    assert.strictEqual(res.user.role, 'cajero');
  });

  test('debe rechazar contraseñas incorrectas', () => {
    assert.throws(() => {
      loginUser('admin@actinvent.com', 'password-falsa');
    }, (err: any) => {
      return err.code === 'INVALID_CREDENTIALS' && err.statusCode === 401;
    });
  });

  test('debe rechazar correos inexistentes', () => {
    assert.throws(() => {
      loginUser('fantasma@empresa.com', 'cualquiera');
    }, (err: any) => {
      return err.code === 'INVALID_CREDENTIALS' && err.statusCode === 401;
    });
  });
});
