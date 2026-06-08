# Especificación del proyecto

## Análisis antes de codear

### Cómo entendí el problema

María es una asesora de seguros que mantiene a 280 clientes activos en un Excel. Cada cliente tiene una o más pólizas vigentes con fechas de vencimiento conocidas. Su flujo actual es manual:

- cada lunes filtra las pólizas que vencen en el mes,
- llama cliente por cliente,
- marca la gestión en el Excel,
- anota qué ofreció y cuándo,
- actualiza la fecha de vencimiento al renovar.

Este proceso es frágil porque el Excel puede dañarse, duplicarse o perder contexto, y cuando una póliza vence sin seguimiento, el cliente se va con otro asesor.

### Qué se decidió construir

Construir una aplicación simple de seguimiento de pólizas que reemplace el Excel por:

- una API REST ligera en Express para almacenar y exponer pólizas y clientes,
- un frontend Angular que muestre las pólizas por vencer,
- acciones de gestión y renovación desde la interfaz.

Qué dejé fuera deliberadamente:

- persistencia real en base de datos (por ahora el backend puede usar un almacén en memoria),
- autenticación y roles,
- reportes complejos o administración de usuarios,
- importación/edición masiva de Excel.

Justificación: la prioridad es validar el flujo central de seguimiento de vencimientos y evitar el fallo actual del Excel, sin complicar la primera versión con infraestructura adicional.

## Supuestos

1. La prioridad es el flujo de pólizas por vencer y la gestión de eventos simples.
2. Los datos del backend pueden empezar en memoria para prototipo, con rutas REST que permitan evolución futura.
3. El frontend debe ser una SPA angular moderna, usando componentes standalone y rutas básicas.
4. No hay requisitos explícitos de autenticación ni seguridad de acceso en esta fase.
5. El sistema debe ser suficiente para que un asesor detecte vencimientos y marque renovaciones, pero no reemplaza CRM o ERP completo.

## Cómo va a funcionar el sistema

### Flujos principales

1. El asesor abre la app Angular.
2. La app consulta el backend para obtener pólizas que vencen en el mes seleccionado.
3. Se muestra una tabla con cliente, tipo de póliza, fecha de vencimiento, estado de gestión y acciones.
4. El asesor puede marcar una póliza como gestionada.
5. El asesor puede renovar una póliza y actualizar su vencimiento automáticamente.
6. El frontend recarga el listado para reflejar el estado más reciente.

### Interacción clave

- `GET /api/policies?dueMonth=YYYY-MM` devuelve las pólizas a vencer.
- `POST /api/policies/:id/manage` marca una póliza como gestionada.
- `POST /api/policies/:id/renew` extiende la fecha de vencimiento.

## Modelo de datos

### Cliente

- `id`: string
- `name`: string
- `phone`: string

### Póliza

- `id`: string
- `clientId`: string
- `type`: string (auto, hogar, vida, etc.)
- `expiryDate`: string (YYYY-MM-DD)
- `managed`: boolean
- `note`: string

### Vista compuesta

- `clientName`: string (derivado de `clientId`)

## Endpoints expuestos

- `GET /api/clients`
  - devuelve todos los clientes.
- `GET /api/policies?dueMonth=YYYY-MM`
  - devuelve pólizas que expirarán en el mes solicitado.
- `GET /api/policies/:id`
  - devuelve una póliza individual.
- `POST /api/policies/:id/manage`
  - marca la póliza como gestionada.
- `POST /api/policies/:id/renew`
  - actualiza la fecha de vencimiento y marca la póliza como gestionada.

## Trade-offs considerados

- Usar una API in-memory permite avanzar rápido, pero no es durable. Para una versión productiva se necesitará una base de datos.
- Separar frontend y backend facilita el desarrollo y el proxy del `ng serve` simplifica integración local.
- No incluir autenticación reduce el tiempo de implementación, pero el sistema no es seguro para uso real en producción.
- Optar por Angular standalone reduce complejidad de módulos y aprovecha la arquitectura moderna del proyecto.

## Análisis del problema actual (importación y uso de `AuthService`)

### Problema

- El compilador/reportes de TypeScript señalaba: "No se encuentra el módulo '../service/auth.service' ni sus declaraciones de tipos correspondientes" en `src/app/page/login/login.ts`.
- Además, en `src/app/page/page.ts` aparecía el error: "La propiedad \"authService\" se usa antes de su inicialización." debido a la inicialización directa de una propiedad con `this.authService`.

### Causa raíz

- Ruta relativa incorrecta desde `login.ts` hacia el servicio. El archivo real está en `src/app/service/auth.service.ts`, por lo que la importación debe ser `../../service/auth.service` desde `src/app/page/login/`.
- Uso de la propiedad `authService` en el inicializador de clase en `Page` provocaba el acceso antes de que Angular inyecte la dependencia (inicialización de campos ocurre antes del constructor).

### Cambios realizados

1. Corregí la importación en `src/app/page/login/login.ts`:
  - De `import { AuthService } from '../service/auth.service';` a `import { AuthService } from '../../service/auth.service';`
2. En `src/app/page/page.ts` removí la asignación directa y la declaré así:
  - `public currentUser$!: Observable<User | null>;`
  - Asigné `this.currentUser$ = this.authService.currentUser$;` dentro del constructor para usar la dependencia ya inyectada.
3. Añadí tipado explícito `User | null` para el observable, importando `User` de `@angular/fire/auth`.

### Supuestos

- Estructura del proyecto estándar: `src/app/service/auth.service.ts` es la ubicación correcta del servicio.
- `AuthService` expone `currentUser$` como `Observable<User | null>`, `login`, `register` y `logout` como métodos Promise/async (confirmado por `auth.service.ts`).

### Decisiones y justificantes

- Usar la ruta relativa correcta es la solución más simple y robusta: evita cambiar la estructura de carpetas.
- Mover la asignación al constructor garantiza que la inyección de dependencias ya esté disponible y elimina el error de inicialización.
- Añadir tipos explícitos mejora la claridad y ayuda al compilador/IDE a detectar errores temprano.

### Recomendaciones / Próximos pasos

- Reiniciar el TypeScript/Angular Language Service o el servidor de desarrollo para que las correcciones de importación se reflejen en el IDE.
- Ejecutar `npm run start` o el comando equivalente para verificar en tiempo de ejecución.
- Ejecutar pruebas (`npm test`) si las hay para validar que no se rompa otra funcionalidad.
- Considerar añadir una guía de estilo de importaciones (paths relativos vs. alias) para evitar errores similares en el futuro.

## Conclusión

La solución propuesta es un MVP enfocado en lo esencial: evitar fugas de clientes por vencimientos olvidados y tener un control mínimo de gestión de pólizas. Los futuros pasos serían agregar persistencia, autenticación y más vistas de gestión/servicios.
