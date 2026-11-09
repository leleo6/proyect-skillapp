# Especificación técnica: actinvent

> aplicacion web para que sus usuarios (Cajeros), puedan saber los codigos nuevos, de los nuevos producto que se almacenen en cada tienda de una de una multinacional

**Alcance**

solo se pueden ver los productos actuales y los nuevos
un usuario admin que los agregue 
cada producto tiene los detalles de cada producto en un modal

**Contexto general**

todos los cajeros deben aprender el codigo de cada producto que registran, y cuando agregan otros productos ellos mismos deben hacer sus tablas de codigos para aprenderselas o recordarlas a mano. se nececita un sofwareen el cual se muestre cada producto y su cadigo para facilitar el trabajo de los cajeros.

_Generado con SkillNeitor 1.2.0 · 2026-11-09 · 28 ítems · 13 categorías_

## Índice

1. [Producto y descubrimiento](#producto-y-descubrimiento)
2. [UX/UI y accesibilidad](#ux-ui-y-accesibilidad)
3. [Arquitectura y patrones](#arquitectura-y-patrones)
4. [Frontend web](#frontend-web)
5. [Backend y APIs](#backend-y-apis)
6. [Datos y persistencia](#datos-y-persistencia)
7. [Seguridad y privacidad](#seguridad-y-privacidad)
8. [DevOps y observabilidad](#devops-y-observabilidad)
9. [Calidad y pruebas](#calidad-y-pruebas)
10. [Rendimiento y escalabilidad](#rendimiento-y-escalabilidad)
11. [Documentación y mantenimiento](#documentacion-y-mantenimiento)
12. [Móvil y escritorio](#movil-y-escritorio)
13. [Analítica y negocio](#analitica-y-negocio)

---

# Producto y descubrimiento

_Problema, alcance, usuarios, métricas y priorización._

## Definición del problema y propuesta de valor

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a antes de elegir tecnología, dejar explícito qué problema resuelve el producto, para quién y por qué merece existir. Úsala como guía: Describir el problema en una frase verificable, sin nombrar la solución. Identificar usuario primario, usuario secundario y contexto de uso. Comprueba el resultado con: Existe un documento de una página con problema, usuarios y valor.

### Propósito

Antes de elegir tecnología, dejar explícito qué problema resuelve el producto, para quién y por qué merece existir.

### Lineamientos

- Describir el problema en una frase verificable, sin nombrar la solución.
- Identificar usuario primario, usuario secundario y contexto de uso.
- Documentar alternativas actuales y el coste de no resolverlo.
- Definir una propuesta de valor que pueda contrastarse con evidencia.

### Criterios de aceptación

- [ ] Existe un documento de una página con problema, usuarios y valor.
- [ ] El equipo puede explicar el problema sin mencionar la implementación.
- [ ] Hay al menos una hipótesis falsable y una métrica asociada.

### Antipatrones

- Empezar por el stack o por una lista de pantallas.
- Confundir funcionalidades con problemas de usuario.

### Referencias

- Working Backwards (Amazon)
- Continuous Discovery Habits

## Historias de usuario y criterios de aceptación

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a convertir necesidades en historias pequeñas, verificables y con criterios de aceptación claros. Úsala como guía: Formato: como [rol] quiero [capacidad] para [beneficio]. Añadir criterios de aceptación en formato dado/cuando/entonces. Comprueba el resultado con: Cada historia tiene criterios de aceptación ejecutables.

### Propósito

Convertir necesidades en historias pequeñas, verificables y con criterios de aceptación claros.

### Lineamientos

- Formato: como [rol] quiero [capacidad] para [beneficio].
- Añadir criterios de aceptación en formato dado/cuando/entonces.
- Incluir casos límite, errores y permisos, no solo el camino feliz.
- Mantener cada historia con valor observable y tamaño de iteración.

### Criterios de aceptación

- [ ] Cada historia tiene criterios de aceptación ejecutables.
- [ ] Los casos de error y permisos están cubiertos.
- [ ] Una persona ajena puede validar la historia sin preguntar al autor.

### Antipatrones

- Historias técnicas sin valor visible.
- Criterios ambiguos como "debe funcionar bien".

### Referencias

- User Stories Applied (Mike Cohn)
- Example Mapping

## Métricas de producto y objetivos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a elegir pocas métricas que informen decisiones y evitar paneles llenos de números sin dueño. Úsala como guía: Definir métrica principal, métricas de soporte y contramétricas. Usar objetivos con resultado esperado y fecha. Comprueba el resultado con: Cada métrica tiene definición y fuente única de verdad.

### Propósito

Elegir pocas métricas que informen decisiones y evitar paneles llenos de números sin dueño.

### Lineamientos

- Definir métrica principal, métricas de soporte y contramétricas.
- Usar objetivos con resultado esperado y fecha.
- Documentar fórmula, fuente y frecuencia de cada métrica.
- Revisar métricas en rituales concretos, no solo acumularlas.

### Criterios de aceptación

- [ ] Cada métrica tiene definición y fuente única de verdad.
- [ ] Hay una contramétrica para evitar optimizaciones dañinas.
- [ ] Existe un ritual periódico de revisión y decisión.

### Antipatrones

- Medir solo vanidad (visitas, descargas).
- Cambiar la definición de una métrica sin versión.

### Referencias

- North Star Metric
- Lean Analytics

## MVP y priorización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Producto

### Cómo usarlo

Esta skill de producto te ayuda a definir el mínimo producto que valida la hipótesis principal y separar lo urgente de lo importante. Úsala como guía: Identificar el flujo crítico de extremo a extremo que debe funcionar. Priorizar con impacto, confianza, esfuerzo y riesgo. Comprueba el resultado con: El MVP tiene un flujo principal demostrable.

### Propósito

Definir el mínimo producto que valida la hipótesis principal y separar lo urgente de lo importante.

### Lineamientos

- Identificar el flujo crítico de extremo a extremo que debe funcionar.
- Priorizar con impacto, confianza, esfuerzo y riesgo.
- Excluir explícitamente lo que no entra en la primera versión.
- Definir criterios de salida y siguientes incrementos.

### Criterios de aceptación

- [ ] El MVP tiene un flujo principal demostrable.
- [ ] Existe una lista de exclusiones conscientes.
- [ ] Las prioridades son trazables a objetivos de producto.

### Antipatrones

- Llamar MVP a un producto completo.
- Priorizar por quién grita más fuerte.

### Referencias

- The Lean Startup
- RICE prioritization

# UX/UI y accesibilidad

_Experiencia, sistema de diseño, responsive y WCAG._

## Accesibilidad WCAG 2.2 AA

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** UX/UI, Accesibilidad

### Cómo usarlo

Esta skill de UX/UI te ayuda a diseñar y verificar interfaces usables con teclado, lectores de pantalla, contraste y movimiento reducido. Úsala como guía: HTML semántico primero; ARIA solo cuando aporta significado. Foco visible, orden lógico y objetivos táctiles de al menos 24×24 px. Comprueba el resultado con: Toda la app se recorre solo con teclado.

### Propósito

Diseñar y verificar interfaces usables con teclado, lectores de pantalla, contraste y movimiento reducido.

### Lineamientos

- HTML semántico primero; ARIA solo cuando aporta significado.
- Foco visible, orden lógico y objetivos táctiles de al menos 24×24 px.
- Contraste AA: 4.5:1 texto normal y 3:1 texto grande.
- Respetar prefers-reduced-motion y prefers-reduced-transparency.

### Criterios de aceptación

- [ ] Toda la app se recorre solo con teclado.
- [ ] Los modales atrapan y devuelven el foco.
- [ ] Estados y errores se anuncian en regiones vivas.

### Antipatrones

- Usar divs clicables sin rol ni teclado.
- Placeholders como única etiqueta.

### Referencias

- WCAG 2.2
- ARIA Authoring Practices

## Diseño responsive y adaptativo

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** UX/UI, Accesibilidad

### Cómo usarlo

Esta skill de UX/UI te ayuda a adaptar la interfaz a tamaños y capacidades reales sin degradar jerarquía ni accesibilidad. Úsala como guía: Diseñar por contenido y tareas, no por dispositivos concretos. Definir breakpoints y comportamientos esperados. Comprueba el resultado con: La app es usable a 320 px, 768 px, 1024 px y zoom 200 %.

### Propósito

Adaptar la interfaz a tamaños y capacidades reales sin degradar jerarquía ni accesibilidad.

### Lineamientos

- Diseñar por contenido y tareas, no por dispositivos concretos.
- Definir breakpoints y comportamientos esperados.
- Evitar scroll horizontal no intencional y tablas inutilizables.
- Probar zoom, orientación y tamaños intermedios.

### Criterios de aceptación

- [ ] La app es usable a 320 px, 768 px, 1024 px y zoom 200 %.
- [ ] Las tablas ofrecen patrón alternativo en móvil.
- [ ] La navegación principal sigue disponible.

### Antipatrones

- Ocultar funciones esenciales en móvil.
- Diseñar solo para el portátil del desarrollador.

### Referencias

- Responsive Web Design
- Container queries

# Arquitectura y patrones

_Estilos arquitectónicos, límites, APIs y decisiones estructurales._

## Monolito modular

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Arquitectura, APIs

### Cómo usarlo

Esta skill de arquitectura te ayuda a construir una sola unidad desplegable con límites internos claros, suficiente para la mayoría de productos. Úsala como guía: Definir módulos por dominio y prohibir imports cruzados arbitrarios. Exponer contratos internos explícitos y encapsular persistencia. Comprueba el resultado con: Los módulos no acceden a tablas de otros módulos sin contrato.

### Propósito

Construir una sola unidad desplegable con límites internos claros, suficiente para la mayoría de productos.

### Lineamientos

- Definir módulos por dominio y prohibir imports cruzados arbitrarios.
- Exponer contratos internos explícitos y encapsular persistencia.
- Mantener una sola base de datos con tablas por dominio.
- Preparar extracción futura sin pagar el coste de microservicios prematuros.

### Criterios de aceptación

- [ ] Los módulos no acceden a tablas de otros módulos sin contrato.
- [ ] El despliegue sigue siendo una unidad reproducible.
- [ ] Existe una prueba que detecta dependencias prohibidas.

### Antipatrones

- Monolito con un único paquete global.
- Microservicios por moda.

### Referencias

- Modular Monolith (Kamil Grzybek)
- Shopify monolith

# Frontend web

_Rendering, estado, componentes, PWA e internacionalización._

## Componentes semánticos y accesibles

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a encapsular ui con html semántico, teclado y atributos accesibles desde el propio componente. Úsala como guía: Preferir elementos nativos antes que roles ARIA. Gestionar foco, estados y anuncios en componentes interactivos. Comprueba el resultado con: No hay divs con onClick sin alternativa de teclado.

### Propósito

Encapsular UI con HTML semántico, teclado y atributos accesibles desde el propio componente.

### Lineamientos

- Preferir elementos nativos antes que roles ARIA.
- Gestionar foco, estados y anuncios en componentes interactivos.
- Exponer props claras y evitar efectos ocultos.
- Probar cada componente con teclado y lector.

### Criterios de aceptación

- [ ] No hay divs con onClick sin alternativa de teclado.
- [ ] Los componentes tienen estados hover, focus, disabled y error.
- [ ] Los tests cubren navegación por teclado.

### Antipatrones

- Reinventar select o modal sin accesibilidad.
- Props booleanas contradictorias.

### Referencias

- WAI-ARIA Authoring Practices
- Inclusive Components

## Formularios y validación frontend

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a implementar formularios con validación consistente, accesible y alineada con el servidor. Úsala como guía: Esquema de validación compartido o replicado explícitamente. Errores por campo y error global. Comprueba el resultado con: El servidor vuelve a validar todo.

### Propósito

Implementar formularios con validación consistente, accesible y alineada con el servidor.

### Lineamientos

- Esquema de validación compartido o replicado explícitamente.
- Errores por campo y error global.
- Estados submitting, success y error.
- Evitar doble envío e hidratar valores iniciales.

### Criterios de aceptación

- [ ] El servidor vuelve a validar todo.
- [ ] Los errores son accesibles y enfocables.
- [ ] El formulario no pierde datos al fallar.

### Antipatrones

- Confiar solo en validación cliente.
- Deshabilitar el botón sin explicar por qué.

### Referencias

- HTML constraint validation
- Zod

## Gestión de estado del cliente

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Web, JavaScript

### Cómo usarlo

Esta skill de frontend te ayuda a distinguir estado local, compartido y remoto para evitar fuentes de verdad duplicadas. Úsala como guía: Estado local para UI efímera; store para estado compartido. Caché de servidor con invalidación por evento. Comprueba el resultado con: Cada dato tiene una única fuente de verdad.

### Propósito

Distinguir estado local, compartido y remoto para evitar fuentes de verdad duplicadas.

### Lineamientos

- Estado local para UI efímera; store para estado compartido.
- Caché de servidor con invalidación por evento.
- Flujo unidireccional y acciones explícitas.
- Evitar derivar estado que pueda calcularse.

### Criterios de aceptación

- [ ] Cada dato tiene una única fuente de verdad.
- [ ] No hay actualizaciones impredecibles entre componentes.
- [ ] El estado se puede inspeccionar en desarrollo.

### Antipatrones

- Duplicar datos remotos en varios stores.
- Mutar estado directamente.

### Referencias

- Redux style guide
- Zustand patterns

# Backend y APIs

_Contratos, autenticación, idempotencia, colas y errores._

## Autenticación y autorización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs

### Cómo usarlo

Esta skill de backend te ayuda a separar identidad de permisos y aplicar autorización en servidor para cada recurso. Úsala como guía: Sesiones seguras, rotación y expiración. RBAC/ABAC con comprobaciones en servidor. Comprueba el resultado con: Cada endpoint valida autenticación y autorización.

### Propósito

Separar identidad de permisos y aplicar autorización en servidor para cada recurso.

### Lineamientos

- Sesiones seguras, rotación y expiración.
- RBAC/ABAC con comprobaciones en servidor.
- No confiar en roles enviados por el cliente.
- Auditar accesos sensibles y revocaciones.

### Criterios de aceptación

- [ ] Cada endpoint valida autenticación y autorización.
- [ ] Hay pruebas de acceso denegado por rol.
- [ ] Los tokens no se guardan en lugares inseguros.

### Antipatrones

- Ocultar botones como control de acceso.
- IDs predecibles sin autorización por recurso.

### Referencias

- OWASP Authentication Cheat Sheet
- OAuth 2.1

## Colas y procesamiento asíncrono

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs

### Cómo usarlo

Esta skill de backend te ayuda a mover trabajo lento o frágil a workers con reintentos, visibilidad y dead-letter queue. Úsala como guía: Definir contratos de mensaje y versionado. Idempotencia en cada consumidor. Comprueba el resultado con: Un mensaje fallido no se pierde silenciosamente.

### Propósito

Mover trabajo lento o frágil a workers con reintentos, visibilidad y dead-letter queue.

### Lineamientos

- Definir contratos de mensaje y versionado.
- Idempotencia en cada consumidor.
- Backoff, límite de reintentos y DLQ.
- Métricas de profundidad y antigüedad de cola.

### Criterios de aceptación

- [ ] Un mensaje fallido no se pierde silenciosamente.
- [ ] Los workers son escalables y observables.
- [ ] Existe replay controlado.

### Antipatrones

- Procesar pagos dentro de la petición HTTP.
- Colas sin DLQ ni alertas.

### Referencias

- Enterprise Integration Patterns
- BullMQ

## Errores, logging y trazabilidad

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Backend, APIs

### Cómo usarlo

Esta skill de backend te ayuda a producir errores accionables y correlacionar logs, métricas y trazas sin filtrar datos sensibles. Úsala como guía: Códigos de error estables y mensajes para usuario. Correlation ID por petición y propagación entre servicios. Comprueba el resultado con: Cada error tiene traza y contexto.

### Propósito

Producir errores accionables y correlacionar logs, métricas y trazas sin filtrar datos sensibles.

### Lineamientos

- Códigos de error estables y mensajes para usuario.
- Correlation ID por petición y propagación entre servicios.
- Logs estructurados con niveles y sampling.
- No registrar secretos ni datos personales.

### Criterios de aceptación

- [ ] Cada error tiene traza y contexto.
- [ ] Los logs permiten reconstruir una petición.
- [ ] Los datos sensibles se redactan.

### Antipatrones

- Loggear objetos completos con tokens.
- Stack traces al usuario final.

### Referencias

- OpenTelemetry
- Google SRE Book

# Datos y persistencia

_Modelado, migraciones, transacciones, búsqueda y backups._

## Backup y recuperación

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** SQL, SQLite

### Cómo usarlo

Esta skill de datos te ayuda a definir rpo/rto, backups verificados y restauración ensayada, no solo copias que existen. Úsala como guía: Backups automáticos, cifrados y fuera del host. Probar restauración periódicamente. Comprueba el resultado con: Existe una restauración completa probada.

### Propósito

Definir RPO/RTO, backups verificados y restauración ensayada, no solo copias que existen.

### Lineamientos

- Backups automáticos, cifrados y fuera del host.
- Probar restauración periódicamente.
- Documentar RPO y RTO.
- Versionar backups y retención.

### Criterios de aceptación

- [ ] Existe una restauración completa probada.
- [ ] El backup no depende del mismo disco.
- [ ] La pérdida máxima aceptada está documentada.

### Antipatrones

- Backups nunca restaurados.
- Guardar backup en el mismo servidor.

### Referencias

- Google SRE: Data integrity
- 3-2-1 backup rule

## Modelo relacional y normalización

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** SQL, SQLite

### Cómo usarlo

Esta skill de datos te ayuda a modelar entidades, relaciones y restricciones que representen el dominio y protejan la integridad. Úsala como guía: Claves primarias estables y foráneas explícitas. Normalizar hasta que duela; desnormalizar con motivo. Comprueba el resultado con: La base impide estados inválidos.

### Propósito

Modelar entidades, relaciones y restricciones que representen el dominio y protejan la integridad.

### Lineamientos

- Claves primarias estables y foráneas explícitas.
- Normalizar hasta que duela; desnormalizar con motivo.
- Restricciones NOT NULL, UNIQUE y CHECK.
- Documentar el modelo y sus invariantes.

### Criterios de aceptación

- [ ] La base impide estados inválidos.
- [ ] Las consultas críticas tienen índice.
- [ ] El modelo se entiende sin preguntar al autor.

### Antipatrones

- Guardar arrays en columnas de texto sin necesidad.
- Sin claves foráneas por pereza.

### Ejemplo

```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### Referencias

- SQL Antipatterns
- Use The Index, Luke

## Privacidad y retención de datos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** SQL, SQLite

### Cómo usarlo

Esta skill de datos te ayuda a minimizar datos, definir retención y permitir exportación y borrado con trazabilidad. Úsala como guía: Recoger solo datos necesarios y con base legal. Definir plazos de retención por tipo. Comprueba el resultado con: Cada campo personal tiene propósito y retención.

### Propósito

Minimizar datos, definir retención y permitir exportación y borrado con trazabilidad.

### Lineamientos

- Recoger solo datos necesarios y con base legal.
- Definir plazos de retención por tipo.
- Implementar exportación y borrado de usuario.
- Anonimizar datos en entornos no productivos.

### Criterios de aceptación

- [ ] Cada campo personal tiene propósito y retención.
- [ ] El borrado se propaga a backups según política.
- [ ] Los logs no conservan PII innecesaria.

### Antipatrones

- Retener todo para siempre.
- Usar datos reales en desarrollo.

### Referencias

- GDPR
- NIST Privacy Framework

# Seguridad y privacidad

_Amenazas, secretos, saneamiento, cifrado y auditoría._

## Auditoría y logs de seguridad

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Seguridad

### Cómo usarlo

Esta skill de seguridad te ayuda a registrar eventos de seguridad relevantes con integridad, retención y acceso restringido. Úsala como guía: Registrar login, cambios de permisos y acciones sensibles. Incluir actor, acción, recurso, resultado y timestamp. Comprueba el resultado con: Las acciones sensibles son auditables.

### Propósito

Registrar eventos de seguridad relevantes con integridad, retención y acceso restringido.

### Lineamientos

- Registrar login, cambios de permisos y acciones sensibles.
- Incluir actor, acción, recurso, resultado y timestamp.
- Proteger logs contra alteración.
- Definir retención y acceso.

### Criterios de aceptación

- [ ] Las acciones sensibles son auditables.
- [ ] Los logs no contienen secretos.
- [ ] Existe alerta para patrones anómalos.

### Antipatrones

- Logs solo locales y borrables por usuario.
- Auditar sin revisar.

### Referencias

- OWASP Logging Cheat Sheet
- NIST SP 800-92

# DevOps y observabilidad

_CI/CD, contenedores, entornos, telemetría y rollback._

## Observabilidad: logs, métricas y trazas

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Docker, CI/CD

### Cómo usarlo

Esta skill de DevOps te ayuda a instrumentar el sistema para responder qué falla, dónde y por qué, con correlación entre señales. Úsala como guía: Logs estructurados con correlation ID. Métricas RED/USE y dashboards por servicio. Comprueba el resultado con: Una petición se sigue de extremo a extremo.

### Propósito

Instrumentar el sistema para responder qué falla, dónde y por qué, con correlación entre señales.

### Lineamientos

- Logs estructurados con correlation ID.
- Métricas RED/USE y dashboards por servicio.
- Trazas distribuidas en rutas críticas.
- Alertas basadas en síntomas de usuario.

### Criterios de aceptación

- [ ] Una petición se sigue de extremo a extremo.
- [ ] Hay alertas de latencia, errores y saturación.
- [ ] Los dashboards tienen dueño.

### Antipatrones

- Solo logs de texto sin contexto.
- Alertas que nadie atiende.

### Referencias

- OpenTelemetry
- Google SRE

# Calidad y pruebas

_Estrategia de pruebas, contratos, E2E, carga y accesibilidad._

## Estrategia de pruebas por capas

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Testing

### Cómo usarlo

Esta skill de calidad te ayuda a distribuir pruebas unitarias, integración, contrato y e2e según riesgo y coste de feedback. Úsala como guía: Muchas unitarias rápidas, menos E2E críticas. Cada capa prueba lo que no puede probar la anterior. Comprueba el resultado con: Los flujos críticos tienen E2E.

### Propósito

Distribuir pruebas unitarias, integración, contrato y E2E según riesgo y coste de feedback.

### Lineamientos

- Muchas unitarias rápidas, menos E2E críticas.
- Cada capa prueba lo que no puede probar la anterior.
- Definir qué es crítico y qué se automatiza.
- Medir cobertura de comportamiento, no solo líneas.

### Criterios de aceptación

- [ ] Los flujos críticos tienen E2E.
- [ ] Las pruebas unitarias no dependen de red.
- [ ] La suite falla de forma determinista.

### Antipatrones

- Solo E2E lentas.
- Cobertura alta sin aserciones útiles.

### Referencias

- Test Pyramid
- Practical Test Pyramid

## Pruebas unitarias

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Testing

### Cómo usarlo

Esta skill de calidad te ayuda a probar reglas y funciones puras con casos límite, rápidos y sin infraestructura. Úsala como guía: Nombrar por comportamiento esperado. Incluir límites, errores y casos vacíos. Comprueba el resultado con: Las reglas de negocio tienen pruebas.

### Propósito

Probar reglas y funciones puras con casos límite, rápidos y sin infraestructura.

### Lineamientos

- Nombrar por comportamiento esperado.
- Incluir límites, errores y casos vacíos.
- Evitar mocks excesivos.
- Mantener ejecución por debajo de segundos.

### Criterios de aceptación

- [ ] Las reglas de negocio tienen pruebas.
- [ ] Los casos límite están cubiertos.
- [ ] Las pruebas no dependen del orden.

### Antipatrones

- Probar getters triviales.
- Mocks que replican la implementación.

### Referencias

- Test Desiderata
- xUnit patterns

# Rendimiento y escalabilidad

_Presupuestos, consultas, caché, CDN y escalado._

## Optimización de consultas y N+1

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Performance, SQL

### Cómo usarlo

Esta skill de rendimiento te ayuda a detectar consultas lentas y patrones n+1 con planes de ejecución e índices correctos. Úsala como guía: Revisar EXPLAIN de consultas críticas. Eliminar N+1 con joins o batch loading. Comprueba el resultado con: No hay N+1 en rutas críticas.

### Propósito

Detectar consultas lentas y patrones N+1 con planes de ejecución e índices correctos.

### Lineamientos

- Revisar EXPLAIN de consultas críticas.
- Eliminar N+1 con joins o batch loading.
- Índices compuestos según filtros y orden.
- Medir antes y después.

### Criterios de aceptación

- [ ] No hay N+1 en rutas críticas.
- [ ] Las consultas lentas tienen índice.
- [ ] El plan no hace full scan en tablas grandes.

### Antipatrones

- Añadir índices a todo.
- Optimizar sin medir.

### Referencias

- Use The Index, Luke
- PostgreSQL EXPLAIN

# Documentación y mantenimiento

_README, ADRs, API, runbooks y manual de usuario._

## Documentación de API

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Markdown, OpenAPI

### Cómo usarlo

Esta skill de documentación te ayuda a publicar contratos navegables, ejemplos y errores, generados desde la especificación. Úsala como guía: OpenAPI como fuente de verdad. Ejemplos de request/response y errores. Comprueba el resultado con: La documentación se genera del contrato.

### Propósito

Publicar contratos navegables, ejemplos y errores, generados desde la especificación.

### Lineamientos

- OpenAPI como fuente de verdad.
- Ejemplos de request/response y errores.
- Autenticación, paginación y límites.
- Versionado y changelog.

### Criterios de aceptación

- [ ] La documentación se genera del contrato.
- [ ] Los ejemplos se validan.
- [ ] Hay guía de migración entre versiones.

### Antipatrones

- Documentación manual desincronizada.
- Ocultar errores y límites.

### Referencias

- OpenAPI
- Redoc

## Manual de usuario y changelog

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Markdown

### Cómo usarlo

Esta skill de documentación te ayuda a explicar el producto a usuarios finales y comunicar cambios de forma comprensible. Úsala como guía: Guía por tareas y capturas actualizadas. Changelog con impacto y migración. Comprueba el resultado con: Las tareas principales están documentadas.

### Propósito

Explicar el producto a usuarios finales y comunicar cambios de forma comprensible.

### Lineamientos

- Guía por tareas y capturas actualizadas.
- Changelog con impacto y migración.
- Búsqueda y ayuda contextual.
- Accesibilidad de la documentación.

### Criterios de aceptación

- [ ] Las tareas principales están documentadas.
- [ ] Cada release tiene changelog.
- [ ] Las capturas coinciden con la versión.

### Antipatrones

- Changelog de commits.
- Manual sin versión.

### Referencias

- Keep a Changelog
- Semantic Versioning

## README y guía de inicio

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Markdown

### Cómo usarlo

Esta skill de documentación te ayuda a permitir que una persona nueva entienda, instale y ejecute el proyecto sin ayuda informal. Úsala como guía: Qué es, para quién y qué resuelve. Requisitos, instalación y comandos básicos. Comprueba el resultado con: Un nuevo desarrollador arranca siguiendo el README.

### Propósito

Permitir que una persona nueva entienda, instale y ejecute el proyecto sin ayuda informal.

### Lineamientos

- Qué es, para quién y qué resuelve.
- Requisitos, instalación y comandos básicos.
- Configuración, tests y troubleshooting.
- Enlaces a documentación profunda.

### Criterios de aceptación

- [ ] Un nuevo desarrollador arranca siguiendo el README.
- [ ] Los comandos están probados.
- [ ] Las variables de entorno están documentadas.

### Antipatrones

- README desactualizado.
- Suposiciones de conocimiento interno.

### Referencias

- Make a README
- Diátaxis

# Móvil y escritorio

_Apps multiplataforma, shells de escritorio, updates y sync._

## App móvil multiplataforma

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Mobile, React Native, Flutter

### Cómo usarlo

Esta skill de móvil y escritorio te ayuda a elegir y estructurar una app móvil con rendimiento, permisos y experiencia nativa suficiente. Úsala como guía: Evaluar nativo vs multiplataforma por requisitos. Navegación, estado y almacenamiento local. Comprueba el resultado con: La app funciona en versiones mínimas soportadas.

### Propósito

Elegir y estructurar una app móvil con rendimiento, permisos y experiencia nativa suficiente.

### Lineamientos

- Evaluar nativo vs multiplataforma por requisitos.
- Navegación, estado y almacenamiento local.
- Permisos, notificaciones y ciclo de vida.
- Distribución en stores y versionado.

### Criterios de aceptación

- [ ] La app funciona en versiones mínimas soportadas.
- [ ] Los permisos se piden con contexto.
- [ ] El tamaño y arranque están medidos.

### Antipatrones

- Webview disfrazada de app nativa.
- Permisos al primer arranque sin explicación.

### Referencias

- React Native docs
- Flutter architecture

## Notificaciones y permisos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Mobile

### Cómo usarlo

Esta skill de móvil y escritorio te ayuda a pedir permisos con contexto y usar notificaciones con respeto, segmentación y preferencias. Úsala como guía: Solicitar permiso solo al necesitarlo. Explicar beneficio antes del diálogo del sistema. Comprueba el resultado con: El usuario puede desactivar canales.

### Propósito

Pedir permisos con contexto y usar notificaciones con respeto, segmentación y preferencias.

### Lineamientos

- Solicitar permiso solo al necesitarlo.
- Explicar beneficio antes del diálogo del sistema.
- Preferencias por canal y frecuencia.
- Deep links y manejo de notificación en frío.

### Criterios de aceptación

- [ ] El usuario puede desactivar canales.
- [ ] La notificación abre el destino correcto.
- [ ] No se envía spam sin consentimiento.

### Antipatrones

- Pedir todos los permisos al inicio.
- Notificaciones sin deep link.

### Referencias

- Apple HIG notifications
- Android notification channels

# Analítica y negocio

_Eventos, facturación, experimentación, soporte y legal._

## Analítica de producto y eventos

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Analytics

### Cómo usarlo

Esta skill de negocio te ayuda a definir un esquema de eventos estable, con privacidad y trazabilidad a decisiones. Úsala como guía: Taxonomía de eventos y propiedades. Consentimiento y minimización. Comprueba el resultado con: Los eventos tienen esquema versionado.

### Propósito

Definir un esquema de eventos estable, con privacidad y trazabilidad a decisiones.

### Lineamientos

- Taxonomía de eventos y propiedades.
- Consentimiento y minimización.
- Validación de esquema en cliente/servidor.
- Dashboards ligados a objetivos.

### Criterios de aceptación

- [ ] Los eventos tienen esquema versionado.
- [ ] No se envían datos personales innecesarios.
- [ ] Las métricas se pueden reproducir.

### Antipatrones

- Eventos con nombres inconsistentes.
- Analítica sin consentimiento.

### Referencias

- Segment spec
- Analytics taxonomy

## Legal, términos y licencias

**Prioridad:** should · **Estado:** aprobado · **Tecnologías:** Analytics

### Cómo usarlo

Esta skill de negocio te ayuda a definir términos, privacidad y licencias de dependencias coherentes con el producto. Úsala como guía: Términos y privacidad versionados. Licencias de terceros y atribuciones. Comprueba el resultado con: Las licencias se revisan en CI.

### Propósito

Definir términos, privacidad y licencias de dependencias coherentes con el producto.

### Lineamientos

- Términos y privacidad versionados.
- Licencias de terceros y atribuciones.
- Límites de responsabilidad y uso aceptable.
- Consentimientos y cookies cuando apliquen.

### Criterios de aceptación

- [ ] Las licencias se revisan en CI.
- [ ] La política coincide con la práctica.
- [ ] Los cambios legales se comunican.

### Antipatrones

- Copiar términos de otra empresa.
- Ignorar licencias copyleft.

### Referencias

- SPDX
- Open Source Licenses
