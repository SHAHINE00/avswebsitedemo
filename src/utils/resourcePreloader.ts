// Resource preloading utilities for critical performance
import { logInfo, logWarn } from './logger';

interface PreloadResource {
  href: string;
  as: 'style' | 'script' | 'font' | 'image';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
}

// Critical resources to preload immediately
const CRITICAL_RESOURCES: PreloadResource[] = [
  // Critical fonts
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    as: 'style',
    fetchpriority: 'high'
  },
  // Critical images (hero section)
  {
    href: '/images/avs-blog-default.jpg',
    as: 'image',
    fetchpriority: 'high'
  }
];

// Preload critical resources on app start
export const preloadCriticalResources = (): void => {
  if (typeof window === 'undefined') return;

  CRITICAL_RESOURCES.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    if (resource.fetchpriority) link.setAttribute('fetchpriority', resource.fetchpriority);
    
    link.onload = () => logInfo(`Preloaded: ${resource.href}`);
    link.onerror = () => logWarn(`Failed to preload: ${resource.href}`);
    
    document.head.appendChild(link);
  });
};

// Preconnect to external domains
export const preconnectExternalDomains = (): void => {
  if (typeof window === 'undefined') return;

  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://images.unsplash.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// DNS prefetch for likely navigation targets
export const dnsPrefetchUrls = (): void => {
  if (typeof window === 'undefined') return;

  const urls = [
    '/features',
    '/curriculum',
    '/about',
    '/contact'
  ];

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Prefetch likely next pages based on current route
export const prefetchLikelyPages = (currentPath: string): void => {
  if (typeof window === 'undefined') return;

  const prefetchMap: Record<string, string[]> = {
    '/': ['/features', '/curriculum', '/about'],
    '/features': ['/curriculum', '/register'],
    '/curriculum': ['/ai-course', '/programming-course', '/register'],
    '/about': ['/contact', '/instructors'],
  };

  const urlsToPrefetch = prefetchMap[currentPath] || [];
  
  urlsToPrefetch.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Initialize all performance optimizations
export const initializeResourcePreloading = (): void => {
  // Run immediately for critical resources
  preloadCriticalResources();
  preconnectExternalDomains();
  
  // Run after a short delay for non-critical optimizations
  setTimeout(() => {
    dnsPrefetchUrls();
    prefetchLikelyPages(window.location.pathname);
  }, 1000);
};