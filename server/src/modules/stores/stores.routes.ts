import { Router } from 'express';
import { getAllStores, getStoreById, createStore } from './stores.service.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

// Cashiers and admins can list all stores of the multinational
router.get('/', (_req, res, next) => {
  try {
    const stores = getAllStores();
    res.json({ stores });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const store = getStoreById(req.params.id);
    if (!store) {
      res.status(404).json({ error: { code: 'STORE_NOT_FOUND', message: 'Tienda no encontrada' } });
      return;
    }
    res.json({ store });
  } catch (err) {
    next(err);
  }
});

// Admin only: add store
router.post('/', authenticate(false), requireRole('admin'), (req: AuthenticatedRequest, res, next) => {
  try {
    const { code, name, city, country } = req.body;
    if (!code || !name || !city || !country) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Código, nombre, ciudad y país son requeridos' } });
      return;
    }
    const store = createStore({ code, name, city, country });
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
});

export default router;
