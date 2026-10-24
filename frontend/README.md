# Frontend de NeuroCV

Aplicación Next.js que se publica en Vercel. La API Laravel está en `../backend`.

## Desarrollo local

```sh
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Configura `NEXT_PUBLIC_API_URL=http://localhost:8000/api` en `.env.local` y
arranca la API Laravel en `http://localhost:8000`.

## Producción en Vercel

- `NEXT_PUBLIC_API_URL=https://neuracy-api.onrender.com/api`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: ID de cliente OAuth Web de Google. Configura el
  mismo ID como `GOOGLE_CLIENT_ID` en Render y autoriza
  `https://www.neurocv.net` en Google Cloud.

El botón de Google se muestra como disponible solo cuando existe el ID público.
No pongas secretos en variables `NEXT_PUBLIC_*`.
