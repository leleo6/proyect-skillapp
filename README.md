# ActInvent 🛒 · Sistema de Códigos de Productos para Cajeros

> **Solución técnica y operativa según la especificación de `SKILLS.md`**  
> Aplicación web integral para que los cajeros de una multinacional consulten, aprendan y registren los códigos (PLU / internos) de los productos actuales y nuevos en cada tienda, eliminando la necesidad de hacer tablas manuales a mano.

---

## 🎨 Adaptive Brand Designs (Diseño de Marca Adaptativo)

ActInvent incorpora un sistema dinámico de identidades de marca retail que adapta la interfaz visual (colores, gradientes, brillos, tipografía y sellos) en tiempo real:

1. **ActInvent Hyper:** Azul zafiro & cian para hipermercados y grandes almacenes (ej: *Hipermercado Bogotá Norte*, *Barcelona Diagonal*).
2. **EcoFresh Market:** Verde esmeralda & menta para supermercados de productos frescos, frutas y orgánicos (ej: *Supercentro Medellín El Poblado*).
3. **SuperFlash Express:** Ámbar, fuego & naranja para tiendas de conveniencia y cajas rápidas 24/7 (ej: *Hiper Polanco CDMX*).
4. **Prestige Gourmet:** Violeta real & fucsia para tiendas gourmet, vinos y delicatessen (ej: *Macrotienda Madrid Castellana*, *Palermo Buenos Aires*).
5. **POS Terminal Pro:** Modo de alto contraste antirreflejo para terminales de caja registradora bajo iluminación intensa.

- **Auto-adaptación según tienda:** Al filtrar por una tienda multinacional, la interfaz sincroniza su marca automáticamente.
- **Selector en Barra Superior:** Menú interactivo para cambiar de marca manualmente en 1 clic o activar el **Modo Alto Contraste** (WCAG 2.2 AAA).

---

## 📚 Documentación y Manuales Oficiales

El proyecto cuenta con documentación técnica y operativa detallada en la carpeta [`docs/`](docs/):

- 📘 **[Manual Técnico](docs/MANUAL_TECNICO.md):** Arquitectura del monolito modular, modelo relacional SQLite con WAL, seguridad JWT con Scrypt, tokens CSS de Adaptive Brand Designs, observabilidad y accesibilidad WCAG 2.2 AA.
- 📗 **[Manual de Usuario](docs/MANUAL_USUARIO.md):** Guía paso a paso para Cajeros y Administradores, atajos de teclado, fichas técnicas con tipografía gigante, modo estudio con tarjetas de memoria y generación de hojas imprimibles (cheat-sheet).
- 📙 **[Manual de Despliegue](docs/MANUAL_DESPLIEGUE.md):** Instrucciones de puesta en producción con Docker Compose, despliegue nativo en Linux con Systemd y Nginx, despliegue nativo en Windows Server (PM2 / NSSM), respaldos en caliente y resolución de problemas.

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
├── client/                     # Frontend SPA Accesible (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/         # Modales, Tarjetas, Tabla compacta, Barcode, etc.
│   │   ├── context/            # AuthContext, ToastContext, BrandContext
│   │   ├── services/           # Cliente API con tipado TypeScript
│   │   ├── types/              # Modelos de Dominio
│   │   ├── App.tsx             # Orquestador principal de vistas
│   │   └── index.css           # Tokens de Marca Adaptativa
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
├── docs/                       # Manual Técnico, de Usuario y de Despliegue
├── .github/workflows/          # Pipeline CI/CD para Releases automáticos (Linux y Windows)
├── Dockerfile                  # Empaquetado multicapa listo para producción
├── docker-compose.yml          # Despliegue con volumen persistente SQLite
└── package.json                # Workspaces de NPM
```

---

## 🚀 Puesta en Marcha Rápida

### Requisitos
- **Node.js**: v20+ o v22+ LTS (Node 22 incluye `node:sqlite` nativo)
- **NPM**: v10+
- **Docker**: (Opcional) Docker Engine y Docker Compose

### 1. Con Docker (Recomendado)
```bash
docker compose up -d --build
```
- Aplicación Web unificada: 👉 **`http://localhost:3000`**
- Healthcheck: `http://localhost:3000/api/health`
- OpenAPI Spec: `http://localhost:3000/api/openapi.json`

### 2. Ejecución en Modo Desarrollo Local
```bash
npm install
npm run dev
```
- Frontend (Vite HMR): `http://localhost:5173`
- Backend API: `http://localhost:3000`

### 3. Compilación y Ejecución en Producción Nativa
```bash
npm run build
npm run start
```

---

## 📦 Releases Automáticos Multiplataforma (GitHub Actions)

El repositorio incluye un workflow en `.github/workflows/release.yml` que compila y empaqueta automáticamente el proyecto en cada etiqueta de versión (`v*`) o ejecución manual para:

- **Linux (x64):** Genera `actinvent-linux-*.tar.gz` listo para producción con script `start.sh`.
- **Windows (x64):** Genera `actinvent-windows-*.zip` listo para producción con script `iniciar.bat`.
- Publica automáticamente el Release en GitHub con notas de versión y adjuntos binarios.

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
- **Selector de Alto Contraste para Cajeros:** Optimiza la legibilidad en pantallas táctiles de caja bajo iluminación directa de supermercado.

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servicio y base de datos SQLite | Público |
| `GET` | `/api/openapi.json` | Contrato navegable OpenAPI 3.0 | Público |
| `POST` | `/api/auth/login` | Inicio de sesión y emisión de JWT | Público |
| `GET` | `/api/products` | Búsqueda y filtrado (`is_new`, `search`, `category_id`, `store_id`) | Cajeros / Admin |
| `GET` | `/api/products/:id` | Ficha técnica completa para el modal de caja | Cajeros / Admin |
| `POST` | `/api/products` | Registro de nuevo producto | Admin |
| `PUT` | `/api/products/:id` | Actualización de producto | Admin |
| `PATCH`| `/api/products/:id/toggle-new` | Alternar producto como Nuevo / Actual | Admin |
| `DELETE`| `/api/products/:id` | Desactivar producto | Admin |
| `GET` | `/api/stores` | Listado de tiendas de la multinacional | Cajeros / Admin |
| `GET` | `/api/audit` | Registro de trazabilidad y eventos de modificación | Admin |
