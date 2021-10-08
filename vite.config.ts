// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

module.exports = defineConfig(({ command, mode }) => {
  // Development config (with HTML files for easier development)
  if (mode === 'example') {
    return {
      plugins: [
        tsconfigPaths()
      ],
      build: {
        outDir: resolve(__dirname, 'dist-example'),
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

  // Build config
  return {
    plugins: [
      tsconfigPaths(),
      dts({
        include: ['lib'],
        insertTypesEntry: true
      })
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, 'lib/index.ts'),
        name: 'AdminAppActions',
        fileName: (format) => `admin-app-actions.${format}.js`
      }
    }
  }
})