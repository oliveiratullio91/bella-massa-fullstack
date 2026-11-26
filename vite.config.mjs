import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, normalizePath } from 'vite';
import { createPizzariaApi } from './server/api.mjs';
import { runtimeDirectory } from './server/database.mjs';

function pizzariaApi() {
    function connect(server) {
        const api = createPizzariaApi();
        server.middlewares.use((request, response, next) => {
            if (!api.handle(request, response)) next();
        });
        server.httpServer?.once('close', () => api.close());
    }
    return { name: 'bella-massa-api', configureServer: connect, configurePreviewServer: connect };
}

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        fs: {
            deny: ['.env', '.env.*', '*.{crt,pem,jwt-key}', '**/.git/**', '**/acesso-admin.txt', '**/bella-massa.sqlite*', normalizePath(runtimeDirectory) + '/**']
        }
    },
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        pizzariaApi(),
        vue(),
        tailwindcss(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    }
});
