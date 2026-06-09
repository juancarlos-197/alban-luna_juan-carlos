# WebPruebaFrontendBackend

Aplicación de ejemplo que combina un frontend Angular con una API REST ligera en Express para el seguimiento de pólizas de seguros.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

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

- `backend/server.cjs`: API REST Express con almacenamiento en memoria para clientes y pólizas.
- `src/app/feature/`: frontend Angular standalone con vistas de login, listado y servicio de pólizas.
- `src/app/shared/toolbar/`: componente reutilizable para navegación y acciones de la UI.
- `proxy.conf.json`: proxy local para que `ng serve` reenvíe `/api` al backend.
- `package.json`: scripts para frontend, backend y pruebas.
- `ai_history/`: historial de desarrollo y decisiones del proyecto.

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

Este proyecto cumple la función de MVP técnico: valida el flujo de seguimiento de vencimientos sin sobreconstruir infraestructura. La idea central es reemplazar el proceso manual en Excel con una herramienta simple, rápida de ejecutar y fácil de extender.

Lo que conviene mejorar a continuación:

- completar la vista de listado y acciones de gestión en el frontend,
- añadir persistencia real para que los cambios sobrevivan reinicios,
- robustecer validaciones, manejo de errores y feedback de usuario,
- incorporar autenticación y roles si el sistema se usa en producción.

## Observaciones

- La API usa datos en memoria, por lo que los cambios no sobreviven al reinicio del servidor.
- El backend tiene datos iniciales de ejemplo para clientes y pólizas.
- El enfoque actual es funcionalidad y estabilidad de flujo, no una solución completa de seguros.
- Un MVP (Producto Mínimo Viable) en software es la versión más funcional y sencilla de una aplicación o producto digital que permite lanzarlo al mercado con el mínimo esfuerzo y coste. Su objetivo principal no es vender, sino validar una idea de negocio y recopilar "aprendizaje validado" de usuarios reales para mejorar el producto.

## Notas de desarrollo

- Reiniciar el servidor TypeScript/Angular Language Service en VSCode si ves errores de importación o tipado tras mover archivos:

  1. Abrir la paleta de comandos (`Ctrl+Shift+P`).
  2. Ejecutar `TypeScript: Restart TS server`.
  3. Si el problema persiste, ejecutar `Developer: Reload Window` en la paleta.

- Comandos útiles para desarrollo local:

```bash
npm install
npm run backend        # inicia backend en http://localhost:3000
npm start              # inicia frontend Angular en http://localhost:4200
```

- Ejecutar pruebas:

```bash
npm test               # pruebas frontend
npm run test:backend   # pruebas backend
```

## Cambios recientes (rápida bitácora)

- Corregido el uso del servicio de autenticación en `src/app/feature/login/login.ts` y `src/app/feature/feature.ts`, alineando las rutas reales con la estructura actual del proyecto.
- Evitado error de inicialización en `src/app/feature/feature.ts` moviendo la asignación de `currentUser$` al constructor y tipándolo como `Observable<User | null>`.

Estos cambios son menores y buscan eliminar errores de compilación y mejorar la claridad del tipado.
 
## Conclusión

La solución propuesta es un MVP enfocado en lo esencial: evitar fugas de clientes por vencimientos olvidados y tener un control mínimo de gestión de pólizas. Los futuros pasos serían agregar persistencia, autenticación y más vistas de gestión/servicios.
 
<p align="center">
  <video controls="controls" muted="muted" style="max-width: 20%; height: auto">
    <source src="conclusion.mp4" type="video/mp4">
    Tu navegador no soporta la etiqueta video.
  </video>
</p>


