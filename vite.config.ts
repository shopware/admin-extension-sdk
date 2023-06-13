// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
import tsconfigPaths from 'vite-tsconfig-paths'

module.exports = defineConfig(({ command, mode }) => {
  if (mode === 'example') {
    // Development config (with HTML files for easier development)
    return {
      root: resolve(__dirname, './e2e/testpage'),
      plugins: [
        tsconfigPaths(),
      ],
      build: {
        outDir: resolve(__dirname, 'testpageDist'),
        sourcemap: true,
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