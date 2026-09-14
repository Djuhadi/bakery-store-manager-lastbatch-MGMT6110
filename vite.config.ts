import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiRoutesPlugin(): Plugin {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const pathname = req.url.split('?')[0];
        if (pathname === '/api/forecast') {
          const { default: handler } = await import('./api/forecast.js');
          return handler(req, res);
        }
        if (pathname === '/api/health') {
          const { default: handler } = await import('./api/health.js');
          return handler(req, res);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const pathname = req.url.split('?')[0];
        if (pathname === '/api/forecast') {
          const { default: handler } = await import('./api/forecast.js');
          return handler(req, res);
        }
        if (pathname === '/api/health') {
          const { default: handler } = await import('./api/health.js');
          return handler(req, res);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
