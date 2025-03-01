import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-report.html', // Output report file
      open: true, // Auto-open in browser
      gzipSize: true, // Show gzip size
      brotliSize: true, // Show brotli size
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs-worker': ['pdfjs-dist/build/pdf.worker.min.mjs'],
        },
      },
    },
  },
})
