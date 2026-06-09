# 04_autenticacion_firebase

Fecha: 2026-06-09

## Resumen de la implementación actual de autenticación

En esta sesión se integró Firebase Authentication en la estructura real del proyecto y se corrigieron las rutas y referencias para que coincidieran con la organización actual del frontend.

## 1. Estado real del proyecto

### Frontend
- `src/app/feature/service/auth.service.ts`: servicio centralizado con `login()`, `register()`, `logout()`, `currentUser$`, `isAuthenticated$` y `getAuthToken()`.
- `src/app/core/guards/auth.guard.ts`: guard funcional que protege la ruta `/expiring` cuando no hay sesión activa.
- `src/app/feature/login/login.ts`: componente standalone de login y registro con manejo de errores Firebase.
- `src/app/feature/feature.ts`: vista principal que consume `currentUser$` y expone logout.
- `src/app/feature/service/policy.service.ts`: servicio que añade el token Bearer a las peticiones del backend cuando existe una sesión.

### Backend
- `backend/auth.middleware.cjs`: middleware básico que valida la presencia de un token Bearer en las peticiones protegidas.
- `backend/server.cjs`: rutas `GET /api/policies`, `GET /api/policies/:id`, `POST /api/policies/:id/manage` y `POST /api/policies/:id/renew` protegidas por ese middleware.

## 2. Configuración Firebase actual

- `src/app/app.config.ts` inicializa Firebase con una configuración hard-coded para el proyecto `prueba-front-back`.
- La integración actual usa `provideFirebaseApp()` y `provideAuth()` de `@angular/fire`.
- No se observa un archivo `.env` o un patrón de variables `NG_APP_FIREBASE_*` en la versión actual del repositorio; por tanto, la configuración está en el código de la app y debe revisarse si se quiere mover a variables de entorno.

## 3. Cambios importantes realizados

1. Se alinearon las rutas del login y la autenticación con la estructura real del proyecto (`src/app/feature/...`).
2. Se corrigió el patrón de inicialización en `src/app/feature/feature.ts` para evitar acceso a `authService` antes de la inyección del constructor.
3. Se mantuvo el flujo de login/registro con Firebase en el frontend y la protección de rutas con `authGuard`.
4. Se añadió la lógica de token Bearer al servicio de pólizas para que el backend pueda validar la sesión.

## 4. Limitaciones actuales

- La autenticación del backend sigue siendo una validación básica de presencia del token, no una verificación real de Firebase Admin SDK.
- La configuración de Firebase está actualmente fija en el código, lo que facilita el desarrollo local pero no es ideal para producción.
- El flujo de autenticación funciona como MVP, pero aún no cubre validación profunda de tokens ni roles por usuario.

## 5. Próximos pasos recomendados

1. Migrar la configuración de Firebase a variables de entorno o un archivo `.env.local` para evitar credenciales fijas en el repo.
2. Sustituir la validación básica del token por verificación real con Firebase Admin SDK en `backend/auth.middleware.cjs`.
3. Añadir pruebas de integración para login, logout y acceso a rutas protegidas.
4. Mejorar la experiencia de usuario con mensajes más claros y manejo de errores específicos por código Firebase.

## 6. Conclusión

La implementación actual proporciona una base funcional de autenticación con Firebase para el MVP: registro, login, sesión, logout y protección de rutas. El siguiente salto natural es reforzar la seguridad del backend y mover la configuración a un entorno más seguro y reusable.
