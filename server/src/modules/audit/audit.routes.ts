import { Router, Response } from 'express';
import { getAuditLogs } from './audit.service.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

// Only admin can view audit logs
router.get('/', authenticate(false), requireRole('admin'), (_req: AuthenticatedRequest, res: Response, next) => {
  try {
    const logs = getAuditLogs(100);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

export default router;
