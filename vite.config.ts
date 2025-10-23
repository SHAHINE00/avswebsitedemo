import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2015',
    cssTarget: 'chrome58',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Optimized chunk size for faster loading
    chunkSizeWarningLimit: 1000,
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks (largest vendors)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // UI Library chunks
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-alert-dialog'
          ],
          'ui-forms': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-switch',
            '@radix-ui/react-label'
          ],
          'ui-navigation': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible'
          ],
          
          // Form handling
          'forms-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // Utility chunks
          'utils-vendor': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ],
          'charts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react']
        },
        // Optimize output file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    // Production optimizations
    ...(isProduction && {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn', 'console.info', 'logInfo', 'logWarn'],
          passes: 2,
          dead_code: true,
          unused: true
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 800
    })
  },
  
  // Performance optimizations - preload critical dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env', '@tanstack/react-query-devtools']
  },
  
  // CRITICAL FIX: Ensure single React instance and HMR stability  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure single React instance - CRITICAL for preventing null errors
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom")
    },
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  
  // Additional HMR stability
  define: {
    // Ensure consistent globals
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  
  // Preview configuration for production builds
  preview: {
    port: 4173,
    host: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  }
};
});