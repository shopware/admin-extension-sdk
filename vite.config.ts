// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

module.exports = defineConfig(({ command, mode }) => {
  if (mode === 'example') {
    // Development config (with HTML files for easier development)
    return {
      plugins: [
        tsconfigPaths()
      ],
      build: {
        outDir: resolve(__dirname, 'example-dist'),
        sourcemap: true,
        rollupOptions: {
          input: {
            main: resolve(__dirname, './index.html'),
            iframe: resolve(__dirname, './example/iframe-app/index.html'),
          }
        }
      }
    }
  }

  // Build config for CDN
  return {
    plugins: [
      tsconfigPaths()
    ],
    build: {
      outDir: resolve(__dirname, 'cdn'),
      sourcemap: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'sw',
        fileName: () => 'index.js',
        formats: ['umd']
      }
    }
  }
})