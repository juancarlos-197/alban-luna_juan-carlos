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

## Conclusión

La solución propuesta es un MVP enfocado en lo esencial: evitar fugas de clientes por vencimientos olvidados y tener un control mínimo de gestión de pólizas. Los futuros pasos serían agregar persistencia, autenticación y más vistas de gestión/servicios.
