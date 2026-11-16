# Aura Crypto

Prototipo web responsive de Aura Crypto, construido con React, TypeScript, Vite y Recharts.

## Ejecutar

Requiere Node.js 20 o posterior y pnpm/npm.

```bash
pnpm install
pnpm dev
```

## Conectar datos reales de mercado

La app consulta CoinGecko desde un proxy del servidor Vite. Descarga hasta 100 criptomonedas por capitalización, con precios en EUR, variación de 24 horas y sparkline de 7 días; actualiza cada 60 segundos y mantiene una caché de servidor de 45 segundos.

1. Crea una cuenta Demo en CoinGecko y genera una API key desde su Developer Dashboard.
2. Copia `.env.example` a `.env` y asigna tu clave a `COINGECKO_API_KEY`.
3. Reinicia `pnpm dev`. El estado del encabezado indicará “Datos reales” al recibir cotizaciones.

La clave se usa en el proxy del servidor y nunca se incluye en el bundle del navegador. No publiques `.env`. La demo local seguirá mostrando los datos de muestra si la API no está configurada o disponible. El plan Demo tiene límites y la API no es un flujo WebSocket; el sondeo está limitado a una vez por minuto.

Para una compilación local, usa `pnpm build` y `pnpm preview`. El proyecto incluye `api/markets.ts` como función serverless para Vercel, que usa `COINGECKO_API_KEY` desde el entorno del servidor. En Vercel, define esa variable en Project Settings → Environment Variables y vuelve a desplegar. Otros hosts estáticos necesitan un backend/proxy equivalente.

## Alcance del prototipo

- Inicio, explorador de mercado, cartera y comparativa Free/Pro/Elite.
- Panel conversacional de IA simulado, modales de compra/ingreso/retirada y configuración del Escudo Anti-Pánico.
- Solo las cotizaciones, el cambio de 24 h y las curvas de 7 días se obtienen del proveedor conectado. Sentinel, pagos, operaciones, planes y respuestas de Aura AI son demostraciones; no ejecutan transacciones ni generan señales reales.

```bash
pnpm build
```
