import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import path from 'path';

// Vite configuration
export default defineConfig({
  plugins: [
    react(),
    // Analyze bundle size with visualizer
    visualizer({
      filename: "./dist/bundle-analysis.html",
      open: true, // Opens the analysis in the browser after build
    }),
    // Compress assets using Brotli
    viteCompression({
      algorithm: "brotliCompress",
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Base alias for `src`
      '@types': path.resolve(__dirname, 'src/types'), // Alias for `src/types`
    },
  },
  build: {
    target: "esnext", // Use modern JavaScript
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          react: ["react", "react-dom"],
        },
      },
    },
    minify: "terser", // Use Terser for advanced minification
  },
  optimizeDeps: {
    include: ["react", "react-dom"], // Pre-bundle key dependencies
    exclude: ["large-unused-library"], // Exclude unused libraries
  },
});
