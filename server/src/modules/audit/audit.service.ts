import { db } from '../../db/connection.js';
import crypto from 'node:crypto';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userName?: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
}

export function logAudit(
  userId: string | null,
  action: string,
  entity: string,
  entityId: string | null,
  details: Record<string, unknown> | string | null,
  ip: string | null = null
): void {
  try {
    const id = crypto.randomUUID();
    const detailsStr = typeof details === 'object' && details !== null ? JSON.stringify(details) : details;
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity, entity_id, details, ip, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, action, entity, entityId, detailsStr, ip, createdAt);
  } catch (err) {
    console.error('Error writing audit log:', err);
  }
}

export function getAuditLogs(limit = 50): AuditLogEntry[] {
  const stmt = db.prepare(`
    SELECT a.id, a.user_id as userId, u.name as userName, a.action, a.entity, 
           a.entity_id as entityId, a.details, a.ip, a.created_at as createdAt
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT ?
  `);

  return stmt.all(limit) as unknown as AuditLogEntry[];
}
