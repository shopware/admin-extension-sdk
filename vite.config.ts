// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

module.exports = defineConfig(({ command, mode }) => {
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
})