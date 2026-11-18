# ActInvent 🛒 · Sistema de Códigos de Productos para Cajeros

> **Solución técnica y operativa según la especificación de `SKILLS.md`**  
> Aplicación web integral para que los cajeros de una multinacional consulten, aprendan y registren los códigos (PLU / internos) de los productos actuales y nuevos en cada tienda, eliminando la necesidad de hacer tablas manuales a mano.

---

## 🎯 Problema y Propósito

En los supermercados y tiendas por departamento de una multinacional, los cajeros necesitan digitar códigos rápidos (PLU) para registrar frutas, verduras, panadería, carnes o nuevos productos que ingresan a tienda. Históricamente, cada vez que llega un producto nuevo, los cajeros deben confeccionar hojas de papel escritas a mano pegadas en la caja registradora para memorizarlos o consultarlos.

**ActInvent** resuelve esta problemática centralizando:
1. **Visualización y Consulta:** Filtrado instantáneo entre productos **Actuales** y **Nuevos** (novedades de la semana).
2. **Ficha Técnica en Modal Accesible:** Al hacer clic en cualquier producto, se despliega un modal con el **código en tipografía gigante** para lectura cómoda a distancia, código de barras escaneable, disponibilidad por tiendas de la multinacional y notas especiales para balanza.
3. **Módulo de Administración:** El usuario Administrador puede dar de alta nuevos productos, editar referencias, asignarlas a tiendas multinacionales específicas y alternar su estado de novedad.
4. **Modo Estudio / Memorización de Códigos:** Minijuego interactivo con tarjetas de memoria (flashcards) para que los cajeros entrenen y memoricen los códigos de los productos nuevos antes o durante su turno.
5. **Hoja de Códigos Imprimible (Cheat-Sheet):** Generador con formato optimizado para impresión física (Ctrl+P) por si se requiere una chuleta pegada en la caja, sin necesidad de escribirla a mano.

---

## 🏗️ Arquitectura del Sistema (Monolito Modular)

El proyecto sigue el patrón de **Monolito Modular** especificado en `SKILLS.md`, desplegándose como una única unidad reproducible:

```
proyect-skillapp/
├── client/                     # Frontend SPA Accesible (WCAG 2.2 AA)
│   ├── src/
│   │   ├── components/         # Modales, Tarjetas, Tabla compacta, Barcode, etc.
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── services/           # Cliente API con tipado TypeScript
│   │   ├── types/              # Modelos de Dominio
│   │   └── App.tsx             # Orquestador principal de vistas
│   └── vite.config.ts
├── server/                     # Backend API & Servidor de Assets
│   ├── src/
│   │   ├── config/             # Configuración y variables de entorno
│   │   ├── db/                 # SQLite (node:sqlite estándar), esquemas y seeds
│   │   ├── middleware/         # Auth JWT, RBAC, Correlation ID y Logger
│   │   ├── modules/
│   │   │   ├── auth/           # Login, JWT, Hash con Scrypt
│   │   │   ├── products/       # Búsqueda indexada, filtros, CRUD
│   │   │   ├── stores/         # Tiendas de la multinacional
│   │   │   └── audit/          # Registro de auditoría de modificaciones
│   │   ├── docs/               # Especificación OpenAPI 3.0
│   │   └── tests/              # Suite de pruebas unitarias y de integración
│   └── tsconfig.json
├── Dockerfile                  # Empaquetado multicapa listo para producción
├── docker-compose.yml          # Despliegue con volumen persistente SQLite
└── package.json                # Workspaces de NPM
```

---

## 🚀 Puesta en Marcha Rápida

### Requisitos
- **Node.js**: v20+ (probado y optimizado en Node v22 y v26)
- **NPM**: v10+

### 1. Instalación
```bash
npm install
```

### 2. Ejecución en Modo Desarrollo
Inicia tanto el servidor API como el frontend con recarga en vivo:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### 3. Compilación y Ejecución en Modo Producción (Monolito)
```bash
npm run build
npm run start
```
La aplicación completa (Frontend + Backend + API) se sirve unificada en:
👉 **`http://localhost:3000`**

### 4. Ejecución con Docker
```bash
docker compose up -d --build
```

---

## 🧪 Pruebas Automatizadas

El proyecto incluye tests unitarios e integrados usando el motor nativo de pruebas:

```bash
npm test
```

Verifica:
- Filtrado estricto por productos `Nuevos` vs `Actuales`.
- Búsqueda por código PLU y coincidencia por nombre.
- Restricciones de unicidad de código y validación de precios.
- Autenticación segura y RBAC (Admin vs Cajero).

---

## 👥 Credenciales de Prueba Preconfiguradas

Para facilitar la evaluación, la base de datos se inicializa automáticamente con datos realistas y ofrece botones de **"1 Clic Demo"** en la interfaz:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@actinvent.com` | `admin123` | Crear, editar, eliminar productos, alternar novedades y consultar logs de auditoría. |
| **Cajero Principal** | `cajero@actinvent.com` | `cajero123` | Consulta de códigos, vista detallada en modal, modo estudio y generación de hoja de impresión. |
| **Cajero Invitado** | Acceso libre | N/A | Consulta pública y rápida de terminal. |

---

## ⌨️ Accesibilidad y Atajos de Teclado (WCAG 2.2 AA)

- Presiona **`/`** o **`Ctrl + K`**: Enfoca directamente el campo de búsqueda desde cualquier lugar.
- Tecla **`Escape`**: Cierra inmediatamente cualquier ventana modal activa.
- Navegación **`Tab`** / **`Shift + Tab`**: Atrapamiento de foco (*focus trap*) dentro de los modales para evitar extravíos del cursor.
- Flechas **`←` / `→`**: Navegación entre producto anterior y siguiente dentro del modal.
- Soporte para **`prefers-reduced-motion`** y alto contraste en foco (`focus-visible`).

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servicio y base de datos | Público |
| `GET` | `/api/openapi.json` | Contrato navegable OpenAPI 3.0 | Público |
| `POST` | `/api/auth/login` | Inicio de sesión y emisión de JWT | Público |
| `GET` | `/api/products` | Búsqueda y filtrado (`is_new`, `search`, `category_id`, `store_id`) | Cajeros / Admin |
| `GET` | `/api/products/:id` | Detalles completos para el modal de caja | Cajeros / Admin |
| `POST` | `/api/products` | Registro de nuevo producto | Admin |
| `PUT` | `/api/products/:id` | Actualización de producto | Admin |
| `PATCH`| `/api/products/:id/toggle-new` | Alternar producto como Nuevo / Actual | Admin |
| `DELETE`| `/api/products/:id` | Desactivar producto | Admin |
| `GET` | `/api/stores` | Listado de tiendas de la multinacional | Cajeros / Admin |
| `GET` | `/api/audit` | Registro de trazabilidad y eventos de modificación | Admin |
