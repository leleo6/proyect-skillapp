import { createApp } from './app.js';
import { runSeed } from './db/seed.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Ensure seed data exists
try {
  runSeed(false);
} catch (err) {
  console.error('[STARTUP] Error al sembrar datos iniciales:', err);
}

const app = createApp();

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`  ActInvent - Monolito Modular`);
  console.log(`  Servidor iniciado en http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`  Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`  OpenAPI Spec: http://localhost:${PORT}/api/openapi.json`);
  console.log(`====================================================`);
});
