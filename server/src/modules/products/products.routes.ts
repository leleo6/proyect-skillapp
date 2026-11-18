import { Router, Response } from 'express';
import {
  getProducts,
  getProductById,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductNewStatus,
  getGeneralStats
} from './products.service.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

// Cashiers & Admins: List products with fast filter by new/actual, store, category, and code/name query
router.get('/', (req, res, next) => {
  try {
    const { search, is_new, category_id, store_id, status, limit, offset } = req.query;

    const filters = {
      search: typeof search === 'string' ? search : undefined,
      isNew: is_new !== undefined ? Number(is_new) : undefined,
      categoryId: typeof category_id === 'string' ? category_id : undefined,
      storeId: typeof store_id === 'string' ? store_id : undefined,
      status: typeof status === 'string' ? status : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined
    };

    const result = getProducts(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Categories list
router.get('/categories', (_req, res, next) => {
  try {
    const categories = getAllCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

// Stats summary
router.get('/stats', (_req, res, next) => {
  try {
    const stats = getGeneralStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Product details (used by Modal for cashiers)
router.get('/:id', (req, res, next) => {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado' } });
      return;
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// Admin only: Add new product
router.post('/', authenticate(false), requireRole('admin'), (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || undefined;
    const product = createProduct(req.body, req.user!.userId, ip);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

// Admin only: Update product
router.put('/:id', authenticate(false), requireRole('admin'), (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || undefined;
    const product = updateProduct(req.params.id, req.body, req.user!.userId, ip);
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// Admin only: Toggle "Nuevo" vs "Actual"
router.patch('/:id/toggle-new', authenticate(false), requireRole('admin'), (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || undefined;
    const product = toggleProductNewStatus(req.params.id, req.user!.userId, ip);
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// Admin only: Delete product (soft delete)
router.delete('/:id', authenticate(false), requireRole('admin'), (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || undefined;
    deleteProduct(req.params.id, req.user!.userId, ip);
    res.json({ success: true, message: 'Producto desactivado correctamente' });
  } catch (err) {
    next(err);
  }
});

export default router;
