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
    target: ['es2015', 'safari11', 'chrome58', 'firefox57'],
    cssTarget: ['chrome58', 'safari11', 'firefox57'],
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Optimized chunk size for faster loading
    chunkSizeWarningLimit: 400,
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // UI Library chunks
          'vendor-ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          'vendor-ui-forms': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-switch'
          ],
          'vendor-icons': ['lucide-react'],
          
          // Form handling
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // Utility chunks
          'vendor-utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge'
          ],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts': ['recharts']
        }
      }
    },
    // Production optimizations
    ...(isProduction && {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn', 'console.info'],
          passes: 3,
          unsafe_arrows: true,
          unsafe_comps: true
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      }
    })
  },
  
  // Performance optimizations - CRITICAL: Ensure React singleton
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // CRITICAL FIX: Ensure single React instance
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom")
    },
    dedupe: ['react', 'react-dom']
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