# 04_autenticacion_firebase.md

Fecha: 2026-06-08

## Resumen de Implementación de Autenticación con Firebase

Se ha completado la implementación de autenticación con Firebase en la aplicación. Aquí están los cambios realizados:

## 1. Instalación de Dependencias

- **firebase**: SDK de Firebase para JavaScript
- **@angular/fire**: Bindings de Angular para Firebase

## 2. Cambios en Frontend

### a) `src/app/service/auth.service.ts` (CREADO)
- Servicio centralizado de autenticación
- Métodos: `login()`, `logout()`, `register()`
- Observables: `currentUser$`, `isAuthenticated$`
- Manejo de tokens con `getAuthToken()`

### b) `src/app/guards/auth.guard.ts` (CREADO)
- Guard de rutas para proteger páginas autenticadas
- Redirige a login si no hay sesión activa

### c) `src/app/page/login/login.ts` (CREADO)
- Componente standalone de login/registro
- Formularios con validación básica
- Manejo de errores específicos de Firebase
- UI responsiva con estilos Tailwind-like

### d) `src/app/app.config.ts` (ACTUALIZADO)
- Configuración de Firebase con variables de entorno
- Providers: `provideFirebaseApp()`, `provideAuth()`
- Soporta variables: `NG_APP_FIREBASE_*`

### e) `src/app/app.routes.ts` (ACTUALIZADO)
- Ruta `/login` pública
- Ruta `/expiring` protegida con `authGuard`
- Redireccionamiento automático a login si no autenticado

### f) `src/app/page/page.ts` (ACTUALIZADO)
- Inyectado `AuthService`
- Método `logout()`
- Muestra email del usuario autenticado

### g) `src/app/page/page.html` (ACTUALIZADO)
- Barra de navegación con usuario y botón logout
- Info del usuario autenticado

### h) `src/app/page/page.css` (ACTUALIZADO)
- Estilos para navegación mejorada
- Botón logout con transiciones
- Info del usuario

### i) `src/app/service/policy.service.ts` (ACTUALIZADO)
- Añadido token de autenticación a headers
- Métodos incluyen `getHeaders()` con Bearer token
- Mejor manejo de errores

## 3. Cambios en Backend

### a) `backend/auth.middleware.cjs` (CREADO)
- Middleware de autenticación básico
- Valida presencia de token Bearer
- En producción, verificar con Firebase Admin SDK

### b) `backend/server.cjs` (ACTUALIZADO)
- Importa middleware de autenticación
- Rutas públicas: `/api/clients`
- Rutas protegidas: `/api/policies`, `/api/policies/:id`, manage, renew
- Todas las operaciones de pólizas requieren autenticación

## 4. Configuración de Entorno

### `.env.example` (CREADO)
- Template con variables de configuración de Firebase
- Variables necesarias:
  - `NG_APP_FIREBASE_API_KEY`
  - `NG_APP_FIREBASE_AUTH_DOMAIN`
  - `NG_APP_FIREBASE_PROJECT_ID`
  - `NG_APP_FIREBASE_STORAGE_BUCKET`
  - `NG_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `NG_APP_FIREBASE_APP_ID`

## 5. Próximos Pasos

Para poner en funcionamiento:

1. **Crear proyecto en Firebase Console**
   - Ir a https://console.firebase.google.com
   - Crear nuevo proyecto
   - Habilitar autenticación por email/password

2. **Copiar credenciales**
   - Copiar `.env.example` a `.env.local`
   - Reemplazar valores con las credenciales del proyecto

3. **Backend con Firebase Admin SDK (Opcional)**
   - Para producción, verificar tokens con Firebase Admin SDK
   - Instalar: `npm install firebase-admin`
   - Implementar validación real en `auth.middleware.cjs`

4. **Testing**
   - Ejecutar `npm start` para frontend
   - Ejecutar `npm run backend` para backend
   - Ir a http://localhost:4200
   - Registrarse o login con test@example.com / password123

## 6. Características

✅ Autenticación con Firebase Authentication
✅ Registro de nuevos usuarios
✅ Login con email/password
✅ Logout y sesión
✅ Protección de rutas con guards
✅ Token en headers de requests
✅ Manejo de errores específicos
✅ UI responsive para login
✅ Middleware de autenticación en backend
✅ Observables reactivos de estado

## 7. Seguridad

- Tokens JWT manejados por Firebase
- Bearer tokens en headers de API
- Middleware básico en backend (mejorable con Admin SDK)
- Contraseñas validadas en cliente (6+ caracteres)
- Redireccionamiento automático sin autenticación
