# WebPruebaFrontedBackend

Aplicación de ejemplo que combina un frontend Angular con una API REST ligera en Express para el seguimiento de pólizas de seguros.

## Cómo correrlo

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el backend Express en un terminal:

```bash
npm run backend
```

   - El backend escucha por defecto en `http://localhost:3000`
   - Si el puerto está ocupado, usa:

```bash
PORT=3001 npm run backend
```

3. Iniciar el frontend Angular en otro terminal:

```bash
npm start
```

4. Abrir en el navegador:

```text
http://localhost:4200/
```

5. La app Angular usa `proxy.conf.json` para reenviar las llamadas a `/api` al backend.

## Qué incluye hoy

- `backend/server.cjs`: API REST Express con almacenamiento en memoria.
- `src/app`: frontend Angular standalone con rutas y estructura básica.
- `proxy.conf.json`: proxy para `ng serve` hacia el backend.
- `package.json`: scripts para frontend, backend y pruebas.

## Decisiones y enfoque

- Backend en memoria: permite validar rápidamente el flujo sin persistencia de base de datos.
- Express simple: expone rutas REST para clientes y pólizas, incluyendo acciones de gestión y renovación.
- Frontend Angular 21 con standalone components: reduce la complejidad de módulos y facilita evolución futura.
- Proxy local: `ng serve` se conecta a la API sin CORS adicional.

## Flujo previsto

1. El frontend solicita pólizas que vencen en un mes específico.
2. El backend devuelve datos combinados de póliza y cliente.
3. El usuario puede marcar una póliza como gestionada.
4. El usuario puede renovar una póliza y actualizar su vencimiento.

## API disponible

- `GET /api/clients`
- `GET /api/policies?dueMonth=YYYY-MM`
- `GET /api/policies/:id`
- `POST /api/policies/:id/manage`
- `POST /api/policies/:id/renew`

## Scripts útiles

- `npm start`: inicia el frontend Angular.
- `npm run backend`: inicia el servidor Express.
- `npm run build`: compila el frontend para producción.
- `npm run watch`: compila en modo desarrollo con watch.
- `npm test`: ejecuta pruebas unitarias de Angular.
- `npm run test:backend`: ejecuta pruebas del backend con Vitest.
- `npm run test:all`: ejecuta todas las pruebas en `tests`.

## Reflexión

El proyecto actual es un MVP técnico. Ya provee la base para un flujo de gestión de pólizas, pero aún falta completar la interfaz de usuario y conectar el frontend con las acciones del backend.

Lo que conviene mejorar a continuación:

- agregar componentes y vistas reales para listar y gestionar pólizas,
- implementar persistencia con base de datos para no perder datos al reiniciar,
- añadir validaciones y manejo de errores en el frontend,
- incorporar autenticación si se usa en producción.

## Observaciones

- La API usa datos en memoria, por lo que los cambios no sobreviven al reinicio del servidor.
- El backend tiene datos iniciales de ejemplo para clientes y pólizas.
- El enfoque actual es funcionalidad y estabilidad de flujo, no una solución completa de seguros.
- Un MVP (Producto Mínimo Viable) en software es la versión más funcional y sencilla de una aplicación o producto digital que permite lanzarlo al mercado con el mínimo esfuerzo y coste. Su objetivo principal no es vender, sino validar una idea de negocio y recopilar "aprendizaje validado" de usuarios reales para mejorar el producto.

## Conclusión

La solución propuesta es un MVP enfocado en lo esencial: evitar fugas de clientes por vencimientos olvidados y tener un control mínimo de gestión de pólizas. Los futuros pasos serían agregar persistencia, autenticación y más vistas de gestión/servicios.
<video src="ruta-de-tu-video.mp4" controls="controls" muted="muted" style="max-width: 100%;"></video>
