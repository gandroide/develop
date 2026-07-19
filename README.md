# Revelado

Tracker de 30 días de práctica fotográfica. PWA instalable, offline por defecto, sin backend. Todos los datos viven en tu dispositivo (IndexedDB).

## Requisitos

- Node ≥ 20

## Desarrollo

```bash
npm install
npm run dev
```

## Tests

```bash
npm test           # una pasada
npm run test:watch # modo watch
```

Tests cubren: cálculo de racha con huecos, cambio de día en zona local, archivado de rollo con conservación de `rolloId` en las entradas, y round-trip de export/import (Markdown + JSON).

## Build

```bash
npm run build
npm run preview
```

El build genera un sitio estático en `dist/` con manifiesto PWA y service worker (autoUpdate, offline-first).

## Deploy estático

**Netlify**

1. Sube el repo o arrastra `dist/` a app.netlify.com/drop.
2. Build command: `npm run build` — publish directory: `dist`.
3. En Site settings → Build & deploy, sin variables.

**Vercel**

```bash
npx vercel --prod
```

O importa el repo desde vercel.com — detecta Vite automáticamente.

**GitHub Pages**

```bash
npm run build
# publica `dist/` en la rama gh-pages
```

Si el sitio no vive en la raíz del dominio, ajusta `base` en `vite.config.ts` (`base: '/mi-repo/'`) y las `start_url`/`scope` del manifest.

## Instalar en el móvil

**Android (Chrome)**

Abre la URL, pulsa el menú (⋮) y elige “Instalar aplicación” o “Añadir a pantalla principal”. La app arranca a pantalla completa y funciona sin conexión.

**iOS (Safari)**

Abre la URL, pulsa Compartir → “Añadir a pantalla de inicio”. Al abrirla desde el icono queda en modo standalone.

Nota iOS: los recordatorios locales solo se disparan si la app está abierta (no hay push server). Ábrela una vez al día y la Notification API programa el siguiente aviso.

## Estructura

- `src/lib/` — lógica pura (racha, fechas, export, notificaciones) + `db.ts` con `idb`.
- `src/hooks/` — hooks React finos sobre `lib/`.
- `src/components/` — componentes por dominio (`contactos/`, `hoy/`, `diario/`, `ejercicios/`, `ajustes/`, `layout/`).
- `src/pages/` — una por pestaña (Hoy, Contactos, Ejercicios, Diario).
- `src/data/ejercicios.ts` — los 7 ejercicios; contenido marcado `TODO` para pegar tu texto.

## Datos y respaldo

Todo vive en IndexedDB. Desde la pestaña **Diario** puedes:

- Exportar `.md` (un archivo legible con una sección por fecha).
- Exportar `.json` (respaldo completo — rollos, entradas y config).
- Importar un `.json` para restaurar en otro dispositivo.

Al completar los 30 cuadros de un rollo puedes archivarlo y empezar el siguiente. Los archivados quedan consultables desde la pestaña **Contactos**.
