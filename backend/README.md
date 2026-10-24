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

Para probar la recuperación por correo localmente, configura un SMTP real en
`MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`,
`MAIL_SCHEME` y `MAIL_FROM_ADDRESS`. La aplicación usa el broker de contraseñas
de Laravel, limita los tokens a 60 minutos y envía al formulario de
`/reset-password` del frontend. El mailer `log` no envía correos y el endpoint
devuelve `503` mientras no haya transporte de correo configurado.

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
- `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_SCHEME`, `MAIL_USERNAME`,
  `MAIL_PASSWORD` y `MAIL_FROM_ADDRESS` para envío de correo.
- `DEEPSEEK_API_KEY` para activar la generación y mejora de texto con IA.
- `GOOGLE_CLIENT_ID` para verificar las credenciales de Google.

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

La recuperación de contraseña requiere configurar un proveedor SMTP en Render
y publicar el mismo `GOOGLE_CLIENT_ID` como `NEXT_PUBLIC_GOOGLE_CLIENT_ID` en
Vercel. Para Google Identity Services, registra `https://www.neurocv.net` como
origen JavaScript autorizado en Google Cloud. No hay cobro de suscripciones.
