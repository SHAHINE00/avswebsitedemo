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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
          // Core React chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // UI Library chunks - split Radix UI more granularly
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
          'vendor-ui-display': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-progress',
            '@radix-ui/react-separator'
          ],
          'vendor-ui-navigation': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip'
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
          'vendor-date': ['date-fns'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Charts and data visualization
          'vendor-charts': ['recharts'],
          
          // DnD and interactions
          'vendor-dnd': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/utilities'
          ],
          
          // Markdown and content
          'vendor-content': [
            'react-markdown',
            'embla-carousel-react'
          ],
          
          // Animation and themes
          'vendor-animations': [
            'next-themes'
          ]
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
  define: {
    global: 'globalThis',
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