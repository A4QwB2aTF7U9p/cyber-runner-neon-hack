# Esquema de la Base de Datos

El proyecto utiliza **PostgreSQL** con el siguiente esquema de tablas. La inicialización automática se encuentra en `src/config/db.js`.

## Tablas

### 1. `users`
Almacena la información principal de los jugadores.
- `id` (SERIAL, PK): Identificador único.
- `username` (VARCHAR(50), UNIQUE): Nombre de usuario.
- `password_hash` (VARCHAR(255)): Contraseña encriptada con bcrypt.
- `shards_balance` (INTEGER, DEFAULT 0): Saldo actual de fragmentos (moneda del juego).
- `active_skin` (VARCHAR(50), DEFAULT 'default'): Skin equipada actualmente.
- `is_guest` (BOOLEAN): Indica si la cuenta es temporal (invitado).
- `created_at` (TIMESTAMP): Fecha de registro.

### 2. `runs`
Registra cada partida jugada.
- `id` (SERIAL, PK): Identificador único.
- `user_id` (FK -> users.id): Usuario que jugó la partida.
- `score` (INTEGER): Puntuación obtenida.
- `shards_collected` (INTEGER): Fragmentos recolectados.
- `distance_run` (INTEGER): Distancia recorrida.
- `death_reason` (VARCHAR(100)): Razón del fin de la partida.
- `duration_seconds` (INTEGER): Duración en segundos.
- `played_at` (TIMESTAMP): Fecha de la partida.

### 3. `user_upgrades`
Progresión RPG de los power-ups.
- `user_id` (PK, FK -> users.id): Usuario.
- `upgrade_type` (PK, VARCHAR(50)): Tipo de mejora (`magnet`, `shield`, `multiplier`).
- `level` (INTEGER, DEFAULT 1): Nivel actual de la mejora.

### 4. `user_skins`
Inventario de skins compradas por el usuario.
- `user_id` (PK, FK -> users.id): Usuario.
- `skin_id` (PK, VARCHAR(50)): Identificador de la skin.

## Relaciones
- Un **Usuario** puede tener muchas **Partidas** (1:N).
- Un **Usuario** tiene varias **Mejoras** (1:N), mapeadas por tipo.
- Un **Usuario** puede poseer múltiples **Skins** (N:M simplificado a tabla de propiedad).
