# Manual de Despliegue · ActInvent

Guía completa para la instalación, configuración y despliegue en entornos de producción, tanto en Linux como en Windows y mediante contenedores Docker.

---

## 1. Requisitos Previos

### 1.1 Requisitos de Hardware
- **CPU:** 1 núcleo mínimo (2 núcleos recomendados para tiendas con más de 20 cajas simultáneas).
- **Memoria RAM:** 512 MB mínimo (1 GB recomendado).
- **Almacenamiento:** 500 MB libres para la aplicación y base de datos SQLite con WAL.

### 1.2 Requisitos de Software
- **Node.js:** Versión 20.x o 22.x LTS instalada (Node 22 incluye soporte nativo para `node:sqlite`).
- **NPM:** Versión 10.x o superior.
- **Docker:** (Opcional si se despliega nativo) Docker Engine v24+ y Docker Compose v2+.

---

## 2. Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

```bash
# Configuración del Servidor ActInvent
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Base de datos SQLite (ruta al archivo .db)
DB_PATH=/data/actinvent.db       # En Docker
# DB_PATH=./actinvent.db         # En despliegue nativo local

# Clave secreta para firma de tokens JWT (CRÍTICO: Cambiar por una cadena segura de al menos 32 caracteres)
JWT_SECRET=super_secret_key_production_multinacional_2026_xyz
```

---

## 3. Despliegue con Docker (Recomendado)

El proyecto incluye un `Dockerfile` multicapa optimizado y un archivo `docker-compose.yml` listo para producción.

### 3.1 Iniciar el Servicio
```bash
docker compose up -d --build
```

Esto ejecutará:
1. Etapa de compilación (`builder`): Descarga dependencias, compila el cliente React con Vite a `server/dist/public` y compila el servidor TypeScript.
2. Etapa de ejecución (`runner`): Crea una imagen ligera sobre `node:22-alpine` con solo dependencias de producción.
3. Monta un volumen persistente `actinvent_data` en `/data` para almacenar `actinvent.db` sin riesgo de pérdida de datos en reinicios.

### 3.2 Comandos Operativos con Docker
- **Verificar estado y healthcheck:**
  ```bash
  docker compose ps
  ```
- **Consultar registros en vivo:**
  ```bash
  docker compose logs -f actinvent
  ```
- **Detener el servicio:**
  ```bash
  docker compose down
  ```
- **Reiniciar el contenedor:**
  ```bash
  docker compose restart actinvent
  ```

---

## 4. Despliegue Nativo en Linux (Ubuntu / Debian / RHEL)

### 4.1 Instalación de Dependencias y Compilación
```bash
# 1. Clonar el repositorio
git clone https://github.com/leleo6/proyect-skillapp.git /opt/actinvent
cd /opt/actinvent

# 2. Instalar dependencias del monorepo
npm install

# 3. Compilar frontend y backend
npm run build

# 4. Configurar variables de entorno
cp .env.example .env
nano .env # Ajustar JWT_SECRET y DB_PATH
```

### 4.2 Servicio de Sistema con Systemd
Crea el archivo `/etc/systemd/system/actinvent.service`:

```ini
[Unit]
Description=ActInvent - Sistema de Códigos para Cajeros
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/actinvent
EnvironmentFile=/opt/actinvent/.env
ExecStart=/usr/bin/npm run start --workspace=server
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=actinvent

[Install]
WantedBy=multi-user.target
```

Habilitar e iniciar el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable actinvent
sudo systemctl start actinvent
sudo systemctl status actinvent
```

### 4.3 Configuración de Proxy Inverso con Nginx (HTTPS)
Crea `/etc/nginx/sites-available/actinvent`:

```nginx
server {
    listen 80;
    server_name actinvent.tienda.internal;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Activar y recargar Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/actinvent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Despliegue Nativo en Windows Server / Windows 10/11

### 5.1 Compilación
Abre PowerShell como Administrador:
```powershell
cd C:\servicios\actinvent
npm install
npm run build
Copy-Item .env.example .env
```

### 5.2 Configuración como Servicio de Windows (con PM2 o NSSM)

#### Opción A: Usando PM2
```powershell
npm install -g pm2 pm2-windows-service
pm2-service-install
pm2 start server/dist/index.js --name "actinvent" --env production
pm2 save
```

#### Opción B: Usando NSSM (Non-Sucking Service Manager)
```powershell
# Descargar NSSM y ejecutar:
nssm install ActInvent "C:\Program Files\nodejs\node.exe" "C:\servicios\actinvent\server\dist\index.js"
nssm set ActInvent AppDirectory "C:\servicios\actinvent"
nssm set ActInvent AppEnvironmentExtra NODE_ENV=production PORT=3000
nssm start ActInvent
```

---

## 6. Estrategia de Backup y Mantenimiento

La base de datos SQLite utiliza el modo **WAL (Write-Ahead Logging)**, lo que permite realizar copias de seguridad consistentes en caliente sin necesidad de detener el servidor.

### 6.1 Backup en Caliente
```bash
# Copia segura usando la utilidad sqlite3
sqlite3 /data/actinvent.db ".backup '/backups/actinvent_$(date +%Y%m%d_%H%M%S).db'"
```

En Windows PowerShell:
```powershell
$backupDate = Get-Date -Format "yyyyMMdd_HHmmss"
sqlite3 .\actinvent.db ".backup '.\backups\actinvent_$backupDate.db'"
```

### 6.2 Restauración
Para restaurar una copia de seguridad:
1. Detener el contenedor o servicio: `docker compose stop actinvent` o `sudo systemctl stop actinvent`.
2. Reemplazar el archivo `actinvent.db` por la copia deseada.
3. Eliminar los archivos residuales `actinvent.db-wal` y `actinvent.db-shm` si existieran.
4. Reiniciar el servicio.

---

## 7. Verificación Post-Despliegue

Ejecuta las siguientes comprobaciones para validar el correcto funcionamiento:

1. **Prueba de Healthcheck:**
   ```bash
   curl -I http://localhost:3000/api/health
   # Debe responder HTTP/1.1 200 OK con JSON {"status":"UP","database":"healthy"}
   ```

2. **Acceso Web:**
   Navega a `http://localhost:3000/` y valida:
   - Carga del selector de marca adaptativo (Adaptive Brand Designs).
   - Acceso al catálogo de productos y filtro de productos Nuevos.
   - Apertura de la ficha técnica modal al presionar sobre un producto.
   - Generación de la vista imprimible para cajeros.
