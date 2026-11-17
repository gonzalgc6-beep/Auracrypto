import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function marketProxy(apiKey: string) {
  let cached: unknown;
  let cachedAt = 0;
  const handler = async (_req: any, res: any) => {
    if (!apiKey) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Configura COINGECKO_API_KEY en .env para activar cotizaciones reales.' }));
      return;
    }
    if (cached && Date.now() - cachedAt < 45_000) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(cached));
      return;
    }
    try {
      const upstream = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h', {
        headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey },
      });
      if (!upstream.ok) {
        res.statusCode = upstream.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: `CoinGecko respondió ${upstream.status}.` }));
        return;
      }
      cached = await upstream.json();
      cachedAt = Date.now();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(cached));
    } catch {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'No se pudo conectar con CoinGecko.' }));
    }
  };
  return {
    name: 'aura-market-proxy',
    configureServer(server: any) { server.middlewares.use('/api/markets', handler); },
    configurePreviewServer(server: any) { server.middlewares.use('/api/markets', handler); },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  base: process.env.GITHUB_ACTIONS ? '/Auracrypto/' : '/',
  plugins: [react(), tailwindcss(), marketProxy(env.COINGECKO_API_KEY || '')],
};
