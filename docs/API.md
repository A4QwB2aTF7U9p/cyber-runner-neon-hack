# Documentación de la API

La API de **Cyber-Runner: Neon Hack** está construida con Express y utiliza JWT para la autenticación de rutas protegidas.

## Base URL
`/api` (Sujeto a configuración en `server.js`)

---

## 🔐 Autenticación

### Registrar Usuario
- **Ruta:** `POST /auth/register`
- **Cuerpo (JSON):**
  ```json
  {
    "username": "usuario123",
    "password": "mi_password_seguro"
  }
  ```
- **Respuesta Exitosa (201):**
  ```json
  {
    "message": "¡Registro exitoso!",
    "token": "JWT_TOKEN",
    "user": { ... }
  }
  ```

### Iniciar Sesión
- **Ruta:** `POST /auth/login`
- **Cuerpo (JSON):**
  ```json
  {
    "username": "usuario123",
    "password": "mi_password_seguro"
  }
  ```
- **Respuesta Exitosa (200):**
  ```json
  {
    "message": "¡Sesión iniciada correctamente!",
    "token": "JWT_TOKEN",
    "user": { ... }
  }
  ```

### Crear Invitado
- **Ruta:** `POST /auth/guest`
- **Descripción:** Crea una cuenta rápida sin necesidad de contraseña.
- **Respuesta Exitosa (201):**
  ```json
  {
    "message": "Invitado creado correctamente.",
    "token": "JWT_TOKEN",
    "user": { ... }
  }
  ```

---

## 🏃 Partidas (Runs)
*Todas estas rutas requieren el encabezado: `Authorization: Bearer <TOKEN>`*

### Guardar Resultado de Partida
- **Ruta:** `POST /runs/save`
- **Cuerpo (JSON):**
  ```json
  {
    "score": 5000,
    "shards_collected": 120,
    "distance_run": 1500,
    "death_reason": "collision_spikes",
    "duration_seconds": 45
  }
  ```
- **Descripción:** Guarda la partida y suma los fragmentos al balance del usuario. Incluye validación básica anti-trampas.

### Obtener Historial
- **Ruta:** `GET /runs/history`
- **Respuesta:** Devuelve las últimas 10 partidas del usuario.

### Perfil del Jugador
- **Ruta:** `GET /runs/profile`
- **Respuesta:**
  ```json
  {
    "username": "usuario123",
    "shards_balance": 450,
    "active_skin": "default",
    "is_guest": false,
    "stats": {
      "high_score": 12500,
      "total_distance": 50000,
      "total_runs": 25
    },
    "upgrades": {
      "magnet": 2,
      "shield": 1,
      "multiplier": 1
    }
  }
  ```

---

## 🛡️ Middlewares
- **Auth Middleware:** Verifica que el token JWT sea válido y no haya expirado (30 días de validez).
