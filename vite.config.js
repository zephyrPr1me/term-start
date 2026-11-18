import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const RSSHUB_URL = 'https://rsshub.rss.tips';
const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{4,31}$/;

function telegramFeedProxy() {
  const middleware = async (request, response, next) => {
    const requestUrl = new URL(request.url || '/', 'http://localhost');
    if (requestUrl.pathname !== '/api/telegram-feed') return next();

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (request.method !== 'GET') {
      response.statusCode = 405;
      response.setHeader('Allow', 'GET');
      response.end(JSON.stringify({ error: 'Only GET is supported.' }));
      return;
    }

    const username = requestUrl.searchParams.get('username') || '';
    if (!TELEGRAM_USERNAME_PATTERN.test(username)) {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: 'Invalid public Telegram username.' }));
      return;
    }

    try {
      const upstream = await fetch(`${RSSHUB_URL}/telegram/channel/${encodeURIComponent(username)}`, {
        headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(15000),
      });

      if (!upstream.ok) {
        console.error(`RSSHub returned HTTP ${upstream.status} for @${username}`);
        response.statusCode = 502;
        response.end(JSON.stringify({ error: `RSSHub returned HTTP ${upstream.status}.` }));
        return;
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (!/xml|rss/i.test(contentType)) {
        console.error(`RSSHub returned an unexpected content type for @${username}: ${contentType}`);
        response.statusCode = 502;
        response.end(JSON.stringify({ error: 'RSSHub returned an unexpected response.' }));
        return;
      }

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/xml; charset=utf-8');
      response.end(await upstream.text());
    } catch (error) {
      console.error(`Unable to load Telegram feed for @${username}:`, error);
      response.statusCode = error.name === 'TimeoutError' ? 504 : 502;
      response.end(
        JSON.stringify({
          error:
            error.name === 'TimeoutError'
              ? 'RSSHub request timed out.'
              : 'Unable to reach RSSHub.',
        }),
      );
    }
  };

  return {
    name: 'telegram-feed-proxy',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [telegramFeedProxy()],
  build: {
    rollupOptions: {
      input: {
        tateru: `${root}index.html`,
        kowasu: `${root}kowasu.html`,
        yasumu: `${root}yasumu.html`,
      },
    },
  },
});
