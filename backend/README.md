# API de NeuroCV

API Laravel usada por el frontend Next.js de Vercel. El frontend de producción
se sirve desde `https://www.neurocv.net`; este servicio no sirve una segunda
interfaz.

## Desarrollo local

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Configura `DEEPSEEK_API_KEY` en `.env` para habilitar la generación y mejora de
CV con IA. La clave es opcional para el resto de la API.

## Render

El servicio se despliega desde la carpeta `backend` con Docker. Configura en
Render estas variables antes de iniciar el servicio:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY`: una clave estable generada una sola vez y guardada como variable
  secreta de Render.
- `DB_CONNECTION=pgsql` y una conexión PostgreSQL válida mediante `DB_URL` o
  `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD`.
- `FRONTEND_URL=https://www.neurocv.net`
- `DEEPSEEK_API_KEY` si se quiere activar la IA.

No apuntes `DB_HOST` a `localhost` ni uses SQLite para datos de cuentas o CV en
Render: el disco del servicio gratuito no conserva los cambios entre instancias.
El contenedor ejecuta las migraciones antes de abrir el puerto; si falta la clave
o la base de datos, termina con un error claro.

En el proyecto Vercel del frontend configura `NEXT_PUBLIC_API_URL` con:

```text
https://neuracy-api.onrender.com/api
```

Aplica la variable a Production y vuelve a desplegar el frontend. La API permite
el origen exacto `https://www.neurocv.net` mediante `FRONTEND_URL`.

## Funciones implementadas

- Registro, inicio y cierre de sesión con tokens de Sanctum.
- Perfil autenticado y operaciones CRUD de CV, experiencia, estudios, habilidades,
  idiomas y plantillas.
- Generación y mejora de texto de CV con DeepSeek.
- `GET /api/health` para comprobar que el servicio responde.

La recuperación de contraseña por correo aún requiere configurar el envío de
email y un flujo de restablecimiento real. El botón de Google del frontend es
informativo y todavía no inicia OAuth. No hay cobro de suscripciones.
