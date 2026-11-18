import { db } from '../../db/connection.js';
import { verifyPassword, signToken, AuthTokenPayload } from './crypto.js';
import { logAudit } from '../audit/audit.service.js';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  name: string;
  role: 'admin' | 'cajero';
  store_id: string | null;
  created_at: string;
}

export function findUserByEmail(email: string): UserRow | null {
  const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
  const row = stmt.get(email);
  return (row as unknown as UserRow) || null;
}

export function getUserById(id: string) {
  const stmt = db.prepare(`
    SELECT u.id, u.email, u.name, u.role, u.store_id as storeId, s.name as storeName, u.created_at as createdAt
    FROM users u
    LEFT JOIN stores s ON u.store_id = s.id
    WHERE u.id = ?
  `);
  return stmt.get(id);
}

export function loginUser(email: string, password: string, ip?: string) {
  const user = findUserByEmail(email);
  if (!user) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas (usuario o contraseña incorrectos)' };
  }

  const isValid = verifyPassword(password, user.password_hash, user.salt);
  if (!isValid) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas (usuario o contraseña incorrectos)' };
  }

  const payload: Omit<AuthTokenPayload, 'exp'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    storeId: user.store_id
  };

  const token = signToken(payload);

  logAudit(user.id, 'AUTH_LOGIN', 'users', user.id, { email: user.email, role: user.role }, ip || null);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      storeId: user.store_id
    }
  };
}
