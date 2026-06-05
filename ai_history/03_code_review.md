# 03_code_review

# Code Review

## 1. Revisión general

El snippet de `backend/server.cjs` muestra una API Express clara y sencilla para un MVP. Usa un almacén en memoria adecuado para prototipo y cubre operaciones útiles de pólizas.

## 2. Diseño de API

- El backend expone rutas REST bien estructuradas:
	- `GET /api/clients`
	- `GET /api/policies?dueMonth=YYYY-MM`
	- `GET /api/policies/:id`
	- `POST /api/policies/:id/manage`
	- `POST /api/policies/:id/renew`
- La separación entre clientes y pólizas es correcta y permite derivar `clientName` en el servidor.
- El uso de `dueMonth` como filtro por prefijo de `expiryDate` es simple y funciona para este formato `YYYY-MM-DD`.

## 3. Implementación

- `express.json()` y `cors()` están configurados correctamente.
- La función `serializePolicy` mejora la respuesta añadiendo `clientName` sin modificar el modelo original.
- El método `addOneYear` es directo, aunque depende de `Date` y puede comportarse distinto cerca de fines de mes (por ejemplo, `2024-02-29`).
- El endpoint `/api/policies/:id/manage` actualiza `managed` y opcionalmente `note`, lo cual es consistente con su propósito.
- El endpoint `/api/policies/:id/renew` extiende la fecha y marca la póliza como gestionada, también consistente.

## 4. Buenas prácticas y robustez

- La validación de existencia de póliza antes de modificarla es correcta y responde con `404` en caso de no encontrarla.
- El logger de arranque muestra el puerto y maneja `EADDRINUSE`, lo cual mejora la experiencia de desarrollo.
- No hay persistencia, lo que está bien para un prototipo, pero debe documentarse explícitamente en el README (ya se hizo).

## 5. Recomendaciones

- Considerar usar `Date` con cuidado si se requiere una lógica más robusta de renovación; un paquete como `date-fns` puede evitar sorpresas.
- Si el proyecto avanza, mover la lógica de datos a un servicio separado facilitará pruebas unitarias y mantenimiento.
- Añadir validación de payload en los `POST` para evitar notas no deseadas o fechas inválidas.
- Documentar el formato de `newExpiryDate` en el endpoint `renew` si se acepta desde el cliente.

## 6. Conclusión

El backend es un buen punto de partida para un MVP de seguimiento de pólizas. El código es claro, la API es consistente y sólo falta robustecer la lógica de fechas y la validación para producción.

## 7. Análisis profundo: `src/app/service/policy.service.ts`

He seleccionado dos problemas relevantes y de impacto real para producción. Cada problema incluye: ubicación (función/archivo), qué está mal, por qué importa, impacto en usuarios y cómo arreglarlo.

---

Problema 1 — Falta de manejo de errores en llamadas `fetch`
- Ubicación: funciones `getExpiringPolicies`, `markManaged`, `renewPolicy` en [src/app/service/policy.service.ts](src/app/service/policy.service.ts#L1-L200).
- Qué está mal: el código asume que `fetch()` siempre resuelve correctamente y llama `response.json()` sin comprobar `response.ok` ni envolver en `try/catch`. No hay timeouts, ni manejo de códigos de error HTTP (4xx/5xx).
- Por qué importa (impacto técnico): si la red falla, el servidor responde 500, o la respuesta no es JSON válido, el `await response.json()` lanzará una excepción no manejada que puede propagarse como un rechazo de promesa no capturado. Además, sin timeout las solicitudes pueden bloquear la UI por tiempo indefinido.
- Qué comportamiento de negocio se rompe:
	- María (usuario final) podría ver la lista de pólizas vacía o la aplicación congelada en lugar de un mensaje claro; podría intentar renovar o marcar y la acción parecería no ejecutarse.
	- El asesor podría creer que una póliza fue gestionada cuando el backend devolvió un error y el cliente no recibe confirmación.
	- El cliente final podría recibir comunicación errónea sobre su renovación o no recibirla si el flujo falla silenciosamente.
- Cómo lo arreglaría (pasos concretos):
	1. Añadir comprobación de `response.ok` tras cada `fetch`. Si `!response.ok`, leer `response.text()` y lanzar un error con contexto ({ status, body }).
	2. Rodear las llamadas `fetch` con `try/catch` en el servicio y devolver errores tipados (p.ej. `throw new ApiError(...)`) para que la capa de componente pueda mostrar mensajes amigables.
	3. Implementar un timeout abortable con `AbortController` para evitar esperas indefinidas.
	4. En la UI, capturar errores y mostrar feedback claro (toast o banner) y, cuando aplique, permitir reintentos.

Ejemplo rápido (esquema):
```ts
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);
try {
	const r = await fetch(url, { signal: controller.signal });
	clearTimeout(timer);
	if (!r.ok) {
		const body = await r.text();
		throw new Error(`API ${r.status}: ${body}`);
	}
	return await r.json();
} catch (err) {
	// envolver/registrar y propagar
	throw err;
}
```

---

Problema 2 — Manejo inconsistente de fechas y tipos (expiryDate)
- Ubicación: `parsePolicy` y uso de `expiryDate` en [src/app/service/policy.service.ts](src/app/service/policy.service.ts#L1-L200) y consumo en frontend/backend (ver [backend/server.cjs](backend/server.cjs#L1-L120)).
- Qué está mal: se convierte `expiryDate` a `Date` con `new Date(raw.expiryDate)` y, si no existe, se usa `new Date(NaN)`. No hay validación\nessperada del formato ni consideración de zonas horarias. Además, el backend originalmente trabaja con `expiryDate` como string `YYYY-MM-DD`, y la serialización/parseo puede introducir desplazamientos de fecha por zona horaria.
- Por qué importa (impacto técnico): `new Date('YYYY-MM-DD')` es interpretado por JS como UTC midnight en algunos motores o como local en otros, lo que puede cambiar el día dependiendo de la zona. Un `Date` inválido (`NaN`) propagado puede romper ordenamientos, filtros por mes, comparaciones y la UI al formatearlo.
- Qué comportamiento de negocio se rompe:
	- María podría ver pólizas que supuestamente vencen en un mes distinto (orden incorrecto), lo que afecta la priorización de gestión.
	- El asesor podría renovar una póliza pensando que vence hoy cuando en realidad vence mañana o viceversa; esto genera errores en avisos y comunicaciones al cliente.
	- El cliente final podría recibir avisos de renovación con fechas equivocadas, dañando la confianza.
- Cómo lo arreglaría (pasos concretos):
	1. Definir un contrato claro: el backend debe enviar `expiryDate` en formato ISO completo `YYYY-MM-DD` (o `YYYY-MM-DDTHH:mm:ssZ`) y documentarlo.
	2. En el frontend, no usar `new Date(...)` directamente para formatos `YYYY-MM-DD`. Usar una biblioteca ligera (p. ej. `date-fns` o `luxon`) o convertir explícitamente la fecha como `new Date(raw.expiryDate + 'T00:00:00Z')` si el intent es tratar la fecha como día sin hora.
	3. Evitar representación interna como `Date` cuando el dominio requiere solo una fecha (sin hora); usar una cadena `expiryDate: string` en el modelo y exponer helpers `getExpiryAsDate()` o `formatExpiry()` para conversión puntual.
	4. Cuando la fecha sea inválida, devolver `null`/`undefined` y en la UI mostrar un estado claro («Fecha no disponible») en lugar de pasar un `Date` inválido.
	5. Añadir pruebas unitarias que cubran: parseo de `YYYY-MM-DD`, valores nulos, y comportamiento de filtro por `dueMonth`.

---

Resumen ejecutivo: priorizar solución del problema 1 (manejador de errores y timeouts) para evitar fallos visibles y pérdida de datos; después robustecer el contrato y manejo de fechas (problema 2) para evitar discrepancias en la lógica de negocio y comunicaciones.

