import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import storesRoutes from './modules/stores/stores.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';
import { db, initSchema } from './db/connection.js';

export function createApp() {
  initSchema();

  const app = express();

  // Basic security and parsing
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Healthcheck endpoint (DevOps & Observability)
  app.get('/api/health', (_req, res) => {
    try {
      const dbCheck = db.prepare('SELECT 1 as ok').get() as { ok: number };
      res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        database: dbCheck.ok === 1 ? 'healthy' : 'degraded',
        version: '1.0.0'
      });
    } catch (err: unknown) {
      res.status(503).json({
        status: 'DOWN',
        database: 'unreachable',
        error: (err as Error).message
      });
    }
  });

  // OpenAPI spec
  app.get('/api/openapi.json', (_req, res) => {
    const specPaths = [
      path.resolve(import.meta.dirname, 'docs', 'openapi.json'),
      path.resolve(process.cwd(), 'src/docs/openapi.json'),
      path.resolve(process.cwd(), 'server/src/docs/openapi.json'),
      path.resolve(process.cwd(), 'dist/docs/openapi.json')
    ];
    for (const p of specPaths) {
      if (fs.existsSync(p)) {
        return res.sendFile(p);
      }
    }
    res.status(404).json({ error: { message: 'OpenAPI spec no encontrada' } });
  });

  // API Modules
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/stores', storesRoutes);
  app.use('/api/audit', auditRoutes);

  // Serve Frontend Static files in production / monolithic mode
  const clientDistPaths = [
    path.resolve(process.cwd(), 'dist/public'),
    path.resolve(process.cwd(), '../client/dist'),
    path.resolve(import.meta.dirname, 'public')
  ];

  let clientDir: string | null = null;
  for (const p of clientDistPaths) {
    if (fs.existsSync(p)) {
      clientDir = p;
      break;
    }
  }

  if (clientDir) {
    app.use(express.static(clientDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDir!, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
