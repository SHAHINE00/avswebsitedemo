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
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'lucide-react'
          ],
          'vendor-forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          'vendor-charts': ['recharts'],
          'vendor-utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
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
      },
      // Add hash to filenames for cache busting
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name?.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType || '')) {
              return 'assets/images/[name]-[hash].[ext]';
            }
            if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
              return 'assets/fonts/[name]-[hash].[ext]';
            }
            if (/css/i.test(extType || '')) {
              return 'assets/css/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              'lucide-react'
            ],
            'vendor-forms': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod'
            ],
            'vendor-charts': ['recharts'],
            'vendor-utils': [
              'clsx',
              'class-variance-authority',
              'tailwind-merge',
              'date-fns'
            ],
            'vendor-query': ['@tanstack/react-query'],
            'vendor-supabase': ['@supabase/supabase-js']
          }
        }
      }
    })
  },
  
  // Performance optimizations
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