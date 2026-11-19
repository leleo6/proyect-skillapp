# Manual de Usuario · ActInvent

Guía Operativa para Cajeros y Administradores de Puntos de Venta (POS).

---

## 1. Introducción

**ActInvent** es la herramienta web oficial para que los cajeros de la multinacional consulten, aprendan y registren los códigos de productos (PLU y códigos internos) en tiempo real.

Su objetivo principal es **eliminar la necesidad de escribir hojas de papel a mano** pegadas en las cajas registradoras cada vez que ingresa una fruta, verdura o producto nuevo a la tienda.

---

## 2. Acceso a la Plataforma

1. Abre tu navegador web e ingresa a la dirección asignada a tu tienda (por ejemplo, `http://localhost:3000` o la IP de tu servidor de tienda).
2. La plataforma está disponible inmediatamente en modo consulta para cajeros.
3. Si requieres funciones de administración o simulación, haz clic en **Ingresar** o usa el menú desplegable **Demo** en la barra superior:
   - **Cajero:** Consulta rápida, modo estudio y hojas imprimibles.
   - **Administrador:** Alta, edición, desactivación y control de novedades.

---

## 3. Funcionalidades para Cajeros

### 3.1 Búsqueda Rápida de Códigos (PLU)
- **Atajo de teclado:** Presiona la tecla **`/`** (barra inclinada) o **`Ctrl + K`** desde cualquier lugar de la pantalla para enfocar el buscador automáticamente.
- Puedes buscar por:
  - **Código numérico:** Ej. `4011` (Banano Cavendish).
  - **Nombre del producto:** Ej. `Manzana`, `Croissant`, `Lomo`.
  - **Código de barras:** Si dispones de lector óptico en caja.
- Para limpiar la búsqueda rápidamente, haz clic en la **X** o presiona `Escape`.

### 3.2 Pestaña de Novedades (Productos Nuevos)
En la parte superior encontrarás 3 pestañas de filtro:
- **Todos los productos:** Muestra el catálogo completo disponible en tienda.
- **NUEVOS (Novedades):** Filtra exclusivamente los productos ingresados en la última semana. Esta sección es prioritaria para memorizar antes de iniciar tu turno.
- **Actuales / Frecuentes:** Productos consolidados de alta rotación habitual.

### 3.3 Visualización en Tarjetas vs Tabla
- **Modo Tarjetas:** Vista amplia con código PLU destacado en tamaño grande, categoría y notas de balanza.
- **Modo Tabla de Códigos:** Vista compacta de alta densidad ideal para escanear visualmente muchas referencias rápidamente en pantallas de caja.

### 3.4 Ficha Técnica en Modal (Lectura a Distancia)
Al hacer clic sobre cualquier producto o presionar `Enter` sobre él:
- Se abre una ventana modal con el **código en tipografía gigante** para lectura cómoda desde la posición de cobro.
- Incluye el botón **Copiar Código** con confirmación visual.
- Muestra instrucciones especiales para balanza (por ejemplo: *"Digitar con tara de bolsa plástica"* o *"Pesar por unidad"*).
- Visualización del código de barras escaneable.
- Puedes navegar al siguiente producto con la **Flecha Derecha (`→`)** y al anterior con la **Flecha Izquierda (`←`)**.

### 3.5 Modo Estudio (Entrenamiento y Flashcards)
Para memorizar los códigos de las novedades antes de abrir caja:
1. Haz clic en el botón **Modo Estudio** en la barra superior.
2. La plataforma te presentará tarjetas interactivas con el nombre y foto de cada producto nuevo.
3. Digita el código PLU que recuerdes y haz clic en **Verificar**.
4. El sistema te indicará si acertaste o te mostrará el código correcto.
5. Al finalizar recibirás tu puntuación de aciertos para medir tu velocidad de aprendizaje.

### 3.6 Generación de Hoja Imprimible (Cheat-Sheet)
Si la gerencia de tienda autoriza una lista impresa temporal pegada en la estación de cobro:
1. Haz clic en **Hoja Imprimible** en la barra superior.
2. Selecciona si deseas imprimir **Solo Códigos Nuevos** o **Todos los Códigos**.
3. Filtra por tu tienda si aplica.
4. Presiona el botón **Imprimir Hoja (Ctrl+P)**.
5. La hoja se formateará automáticamente en un diseño limpio, compacto y sin elementos visuales innecesarios, lista para imprimir en papel estándar.

---

## 4. Personalización: Adaptive Brand Designs (Marcas de Tienda)

La aplicación cuenta con un selector de diseño de marca en la esquina superior:
- **Auto-adaptar según Tienda:** Al filtrar por una tienda (por ejemplo, *Hipermercado Bogotá*, *Macrotienda Madrid* o *Hiper Polanco CDMX*), la interfaz cambiará automáticamente de colores y estilo para coincidir con la marca de esa superficie.
- **Selector Manual:** Puedes elegir entre:
  - *ActInvent Hyper* (Azul Hipermercado)
  - *EcoFresh Market* (Verde Orgánico y Perecederos)
  - *SuperFlash Express* (Naranja Caja Rápida)
  - *Prestige Gourmet* (Violeta Selección Premium)
  - *POS Terminal Pro* (Modo Pizarra Oscura para evitar reflejos de luz en el monitor)
- **Modo Alto Contraste:** Haz clic en el botón de contraste si trabajas con luz solar directa o reflejos intensos sobre la pantalla de caja registradora.

---

## 5. Funcionalidades para Administradores

*(Requiere haber iniciado sesión con credenciales de Administrador)*

### 5.1 Registrar un Nuevo Producto
1. Haz clic en el botón **Nuevo Producto** en el menú superior.
2. Completa los campos:
   - **Código PLU:** Código único para digitar en caja (ej: `4099`).
   - **Código de Barras:** Código EAN-13 o UPC (opcional).
   - **Nombre del producto y descripción.**
   - **Categoría:** Frutas y Verduras, Panadería, Carnicería, etc.
   - **Precio y Unidad de Medida:** Unidad, kilogramo, libra o gramo.
   - **¿Es producto Nuevo?:** Actívalo para que aparezca en la lista de novedades y en el Modo Estudio de los cajeros.
   - **Nota de Caja / Balanza:** Instrucción vital para el cajero (ej: *"Requiere código de tara 02"*).
   - **Tiendas:** Marca las tiendas de la multinacional en las cuales estará disponible el producto.
3. Haz clic en **Registrar Producto**.

### 5.2 Alternar Estado de Novedad (+ Nuevo / Quitar Nuevo)
- En la tarjeta del producto, haz clic en **+ Nuevo** para marcarlo como novedad de la semana, o en **Quitar Nuevo** cuando el producto pase a ser parte del surtido habitual.

### 5.3 Editar o Desactivar Productos
- Haz clic en el ícono de lápiz para editar cualquier dato del producto.
- Haz clic en el ícono de papelera para desactivarlo del catálogo.

### 5.4 Auditoría de Seguridad
- Haz clic en el botón **Auditoría** en el menú superior para consultar el historial inmutable de quién creó, editó o modificó cada producto con fecha, hora y dirección IP.
