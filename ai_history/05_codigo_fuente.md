# 05_codigo_fuente

Fecha: 2026-06-09

## Resumen del código fuente actual (`src/`)

Esta sección describe la implementación real que existe hoy en la carpeta `src/` del proyecto Angular.

## 1. Estructura principal

### `src/app/`
- `app.ts`: componente raíz de la aplicación Angular.
- `app.config.ts`: inicializa Firebase con `provideFirebaseApp()` y `provideAuth()`.
- `app.routes.ts`: define las rutas principales de la app.

### `src/app/feature/`
- `feature.ts`: vista principal con acceso a `AuthService` y logout.
- `feature.html` / `feature.css`: estructura visual base de la pantalla principal.
- `login/login.ts`: componente standalone para login y registro.
- `login/login.html` / `login.css`: UI del formulario de acceso.
- `list/policy-list.ts`: listado de pólizas por vencer con carga, error y acciones de gestión/renovación.
- `service/auth.service.ts`: servicio de autenticación con Firebase.
- `service/policy.service.ts`: servicio para consultar y actualizar pólizas usando el token Bearer.

### `src/app/core/`
- `guards/auth.guard.ts`: guard que protege la ruta `/expiring`.
- `interfaces/policy.interface.ts`: interfaz `Policy` usada por el frontend.

### `src/app/shared/`
- `toolbar/toolbar.ts`: componente reutilizable de barra de herramientas.

## 2. Qué hace cada parte

### Configuración de Angular y Firebase
- `app.config.ts` prepara el arranque de la app con router y Firebase Authentication.
- `app.routes.ts` redirige la ruta base a `/expiring` y protege esa vista con `authGuard`.

### Autenticación
- `AuthService` gestiona el estado de sesión mediante observables (`currentUser$`, `isAuthenticated$`).
- `Login` permite iniciar sesión y crear cuentas con email/password.
- `authGuard` bloquea el acceso a la vista de pólizas si no hay sesión activa.

### Listado de pólizas
- `PolicyList` carga las pólizas del mes actual y muestra errores/cargando.
- El usuario puede marcar una póliza como gestionada o renovarla con un año adicional.
- `PolicyService` consume la API `/api/policies` y añade el token Bearer cuando corresponde.

## 3. Puntos importantes a revisar

- El modelo de `Policy` usa `expiryDate: Date`, pero la API backend devuelve `YYYY-MM-DD` como string.
- La lógica de fechas en el frontend puede ser sensible a zonas horarias si no se normaliza bien.
- La autenticación del backend todavía es una validación básica de token, no una verificación real con Firebase Admin SDK.

## 4. Conclusión

El código actual en `src/` ya representa una base funcional para un MVP: autenticación con Firebase, protección de rutas, listado de pólizas y acciones de gestión. La parte más sensible para mejorar en una siguiente iteración es la robustez de fechas y la seguridad del backend.
