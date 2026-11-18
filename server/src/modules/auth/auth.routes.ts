import { Router, Response } from 'express';
import { loginUser, getUserById } from './auth.service.js';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Se requiere email y contraseña' }
      });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || undefined;
    const result = loginUser(email, password, ip);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate(false), (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const user = getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado' } });
      return;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
