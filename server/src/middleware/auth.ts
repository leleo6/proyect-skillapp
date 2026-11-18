import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthTokenPayload } from '../modules/auth/crypto.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticate(optional = false) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (optional) {
        return next();
      }
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Se requiere inicio de sesión para realizar esta acción'
        }
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        error: {
          code: 'TOKEN_INVALID_OR_EXPIRED',
          message: 'Token de sesión inválido o expirado'
        }
      });
      return;
    }

    req.user = payload;
    next();
  };
}

export function requireRole(...roles: Array<'admin' | 'cajero'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Acceso denegado: se requiere uno de los siguientes roles: ${roles.join(', ')}`
        }
      });
      return;
    }

    next();
  };
}
