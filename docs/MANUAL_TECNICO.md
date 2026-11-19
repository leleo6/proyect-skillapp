# Manual Técnico · ActInvent

Sistema de Gestión, Consulta y Aprendizaje de Códigos PLU y Novedades de Tienda para Cajeros de Multinacional.

---

## 1. Arquitectura General del Sistema

ActInvent está diseñado bajo el patrón arquitectónico de **Monolito Modular** estructurado en TypeScript de extremo a extremo (Frontend y Backend). Esta arquitectura ofrece simplicidad operacional, cero latencia entre módulos y un despliegue unificado sin la complejidad operativa de microservicios.

```
proyect-skillapp/
├── client/                     # Frontend SPA Accesible (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/         # Modales, Tarjetas, Tabla compacta, Barcode, etc.
│   │   ├── context/            # AuthContext, ToastContext, BrandContext
│   │   ├── services/           # Cliente HTTP API con tipado estricto
│   │   ├── types/              # Interfaces de Dominio
│   │   ├── App.tsx             # Orquestador visual
│   │   └── index.css           # Tokens CSS de Marca Adaptativa
│   └── vite.config.ts
├── server/                     # Backend API Monolítico & Servidor de Assets
│   ├── src/
│   │   ├── config/             # Configuración centralizada de variables de entorno
│   │   ├── db/                 # Conexión SQLite (node:sqlite estándar), esquemas y seeders
│   │   ├── middleware/         # Auth JWT, RBAC, Correlation ID y Logging estructurado
│   │   ├── modules/
│   │   │   ├── auth/           # Login, JWT, Hashing seguro con Scrypt
│   │   │   ├── products/       # Búsqueda indexada, filtros, CRUD y cálculo de novedades
│   │   │   ├── stores/         # Gestión de tiendas multinacionales
│   │   │   └── audit/          # Registro inmutable de eventos y auditoría de seguridad
│   │   ├── docs/               # Especificación OpenAPI 3.0 (openapi.json)
│   │   └── tests/              # Suite de pruebas unitarias nativas
│   └── tsconfig.json
├── docs/                       # Manuales técnicos, de usuario y de despliegue
├── Dockerfile                  # Empaquetado multicapa (builder + runner)
├── docker-compose.yml          # Orquestación con persistencia SQLite
└── package.json                # Workspaces de NPM para monorepo
```

---

## 2. Tecnologías Principales

- **Runtime & Backend:** Node.js v22+ LTS (soporte nativo de `node:sqlite` sin dependencias binarias externas ni Python de compilación).
- **Servidor Web API:** Express 4.x con middleware modular.
- **Base de Datos:** SQLite 3 integrado con motor nativo de Node 22 (`DatabaseSync`). Modo WAL (Write-Ahead Logging) y timeout transaccional de 5000 ms.
- **Frontend SPA:** React 18, Vite 6, TypeScript 5.7.
- **Estilos & Diseño:** TailwindCSS 3.4 con tokens dinámicos para **Adaptive Brand Designs**.
- **Iconografía:** Lucide React.
- **Contenedorización:** Docker Multi-stage con imagen base `node:22-alpine`.

---

## 3. Sistema de Diseño de Marca Adaptativo (Adaptive Brand Designs)

El frontend integra un motor de marca dinámico gestionado mediante `BrandContext.tsx` y variables CSS en `:root`. Permite que la aplicación adapte instantáneamente su identidad visual según la tienda multinacional activa o las preferencias del operador.

### 3.1 Identidades de Marca Predefinidas

| Identidad | Clave | Persona Retail | Colores Primarios | Tiendas Vinculadas |
|---|---|---|---|---|
| **ActInvent Hyper** | `hyper` | Hipermercados y grandes almacenes | Azul Zafiro (`#0284c7`) / Cian (`#06b6d4`) | BOG-01 (Bogotá), BCN-01 (Barcelona) |
| **EcoFresh Market** | `fresh` | Supermercado de frescos, frutas y orgánicos | Verde Esmeralda (`#059669`) / Menta (`#10b981`) | MED-01 (Medellín) |
| **SuperFlash Express** | `express` | Conveniencia 24/7 y caja rápida de alta velocidad | Ámbar (`#ea580c`) / Naranja (`#f59e0b`) | MEX-01 (CDMX) |
| **Prestige Gourmet** | `gourmet` | Delicatessen, vinos y productos importados | Violeta Real (`#9333ea`) / Fucsia (`#ec4899`) | MAD-01 (Madrid), BUE-01 (Buenos Aires) |
| **POS Terminal Pro** | `terminal` | Pantalla antirreflejo para terminales de cajero | Pizarra Oscura (`#0f172a`) / Verde Neón (`#10b981`) | Operación intensiva con reflejos de luz |

### 3.2 Inyección de Tokens Dinámicos
Cada paleta define los escalones `50` a `950` y sus equivalentes RGB (`--color-brand-X-rgb`), permitiendo a Tailwind aplicar opacidades dinámicas (`bg-brand-500/20`, `shadow-brand-glow`) sin requerir recompilación de estilos.

---

## 4. Base de Datos y Modelo Relacional

La base de datos utiliza SQLite optimizada para lecturas masivas y concurrencia de consultas en puntos de venta.

### Esquema Relacional

```
[stores] 1 ──── ∞ [product_stores] ∞ ──── 1 [products]
                                                │
[categories] 1 ─────────────────────────────── ∞┘
                                                
[users] 1 ──── ∞ [audit_logs]
```

- **`stores`**: Registro de tiendas de la multinacional (id, code, name, city, country, is_active, created_at).
- **`categories`**: Categorías de productos con ícono representativo (id, name, slug, icon).
- **`products`**: Catálogo de códigos PLU e información nutricional/balanza (id, code, barcode, name, description, category_id, is_new, price, unit, status, notes, created_at, updatedAt).
- **`product_stores`**: Tabla asociativa N:M que define la disponibilidad por tienda.
- **`users`**: Cajeros y Administradores con hash Scrypt (`email`, `password_hash`, `role`, `store_id`).
- **`audit_logs`**: Trazabilidad inmutable de altas, bajas, ediciones y modificaciones de estado.

### Optimizaciones SQLite
```sql
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
```

---

## 5. Seguridad y Autenticación

- **Hashing de Contraseñas:** `node:crypto.scryptSync` con salt criptográfico de 16 bytes y clave de 64 bytes.
- **Tokens de Sesión:** Firma HMAC-SHA256 codificada en JWT con expiración configurable (8 horas por defecto).
- **Control de Acceso Basado en Roles (RBAC):**
  - Rol `cajero`: Consulta de catálogo, filtrado, uso de fichas técnicas, práctica en modo estudio y generación de cheat-sheet.
  - Rol `admin`: Capacidades completas de cajero más creación, edición, borrado lógico, alternancia de estado `NUEVO` y consulta de auditoría.
- **Trazabilidad HTTP:** Generación de Correlation ID único (`X-Request-Id`) por solicitud mediante UUIDv4 para seguimiento de errores de extremo a extremo.

---

## 6. Observabilidad y Métricas

- **Healthcheck:** Endpoint `GET /api/health` para verificaciones de liveness/readiness de Docker y balanceadores:
  ```json
  {
    "status": "UP",
    "timestamp": "2026-11-19T19:44:26.526Z",
    "uptimeSeconds": 16,
    "database": "healthy",
    "version": "1.0.0"
  }
  ```
- **Logging Estructurado:** Salida estándar en formato JSON con método HTTP, ruta, código de estado, tiempo de respuesta en milisegundos y Correlation ID.
- **Documentación de API:** Endpoint `GET /api/openapi.json` con especificación OpenAPI 3.0 completa.

---

## 7. Accesibilidad (WCAG 2.2 AA)

- **Navegación por teclado completa:** Tecla `/` o `Ctrl+K` para búsqueda rápida, `Escape` para cerrar modales, flechas `←` y `→` para paginar fichas técnicas.
- **Trampas de foco (`focus trap`):** Implementadas en todos los modales para evitar escape involuntario del foco accesible.
- **Regiones vivas ARIA:** Los cambios de filtro y resultados de búsqueda son anunciados mediante `<div aria-live="polite" className="sr-only">`.
- **Modo Alto Contraste:** Selector directo para personal de caja en condiciones de brillo o luz artificial intensa.
