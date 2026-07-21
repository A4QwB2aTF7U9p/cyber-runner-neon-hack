# Estructura del Proyecto

Este documento explica la organización de los archivos y carpetas en el backend de **Cyber-Runner: Neon Hack**.

## Raíz del Proyecto
- `.env`: Archivo de configuración para variables de entorno (Base de Datos, Secretos JWT, Puertos). **Importante: No subir a control de versiones.**
- `.gitignore`: Define qué archivos y carpetas deben ser ignorados por Git (ej. `node_modules`, `.env`).
- `package.json`: Archivo de configuración de Node.js que contiene dependencias, scripts y metadatos del proyecto.
- `README.md`: Guía principal del proyecto.

## Carpeta `src/`
Contiene todo el código fuente del servidor.

### `src/config/`
- `db.js`: Configuración de la conexión a PostgreSQL utilizando el paquete `pg`. Incluye la lógica para inicializar las tablas si no existen al arrancar el servidor.

### `src/middleware/`
- `auth.js`: Middleware encargado de interceptar las peticiones a rutas protegidas, verificar el token JWT en el encabezado `Authorization` y adjuntar los datos del usuario al objeto `req`.

### `src/routes/`
- `auth.js`: Define los endpoints relacionados con la gestión de usuarios (Registro, Login, Cuentas de Invitado).
- `runs.js`: Define los endpoints relacionados con la lógica del juego (Guardar partidas, Historial, Perfil y estadísticas).

## Flujo de Datos
1. Una petición llega al servidor (ej. `POST /api/runs/save`).
2. Si la ruta es protegida, pasa por `src/middleware/auth.js`.
3. El controlador en `src/routes/` procesa la petición.
4. Se interactúa con la base de datos a través de `src/config/db.js`.
5. Se devuelve una respuesta JSON al cliente (Phaser 3).
