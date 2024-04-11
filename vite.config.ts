import { defineConfig } from 'vite'
import replace from '@rollup/plugin-replace';
import packageJson from './package.json';

export default defineConfig(({ mode }) => ({
    plugins: [
        replace({
            __PIXI_APP__: mode === 'development' ? 'globalThis.__PIXI_APP__ = app;' : '',
            __PIXI_STAGE__: mode === 'development' ? 'globalThis.__PIXI_STAGE__ = stage;' : '',
            __PIXI_RENDERER__: mode === 'development' ? 'globalThis.__PIXI_RENDERER__ = renderer;' : '',
            __PIXI_ASSETS_CACHE__: mode === 'development' ? 'globalThis.__PIXI_ASSETS_CACHE__ = Assets.cache;' : '',
            __APP_VERSION__: JSON.stringify(packageJson.version),
            preventAssignment: true
        })
    ],
    base: './',
    build: {
        outDir: './dist',
        sourcemap: true
    }
}));
