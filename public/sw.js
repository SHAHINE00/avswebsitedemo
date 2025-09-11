// Optimized Service Worker for performance
const CACHE_NAME = 'avs-website-v4';
const STATIC_CACHE = 'avs-static-v4';
const RUNTIME_CACHE = 'avs-runtime-v4';
const IMAGE_CACHE = 'avs-images-v4';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Install event - optimized caching
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(CRITICAL_RESOURCES))
      .catch(error => console.warn('Cache install failed:', error))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const validCaches = [CACHE_NAME, STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (!validCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Optimized fetch event with smart caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isExternal = url.origin !== self.location.origin;
  const isAllowedExternal = url.hostname.includes('fonts.googleapis.com') || 
                           url.hostname.includes('fonts.gstatic.com') ||
                           url.hostname.includes('unsplash.com');

  if (isExternal && !isAllowedExternal) return;

  // Route requests based on type
  if (event.request.destination === 'document') {
    event.respondWith(handleNavigationRequest(event.request));
  } else if (event.request.destination === 'image') {
    event.respondWith(handleImageRequest(event.request));
  } else if (url.pathname.includes('/assets/') || 
             event.request.destination === 'script' || 
             event.request.destination === 'style') {
    event.respondWith(handleStaticRequest(event.request));
  } else {
    event.respondWith(handleDefaultRequest(event.request));
  }
});

// Handle navigation requests - network first with tab switch optimization
async function handleNavigationRequest(request) {
  // Skip aggressive caching during tab switches
  if (self.skipCacheUpdates) {
    try {
      return await fetch(request);
    } catch (error) {
      return await caches.match(request) || 
             await caches.match('/index.html') || 
             new Response('Offline', { status: 503 });
    }
  }
  
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    // Network failed, try cache
  }
  
  return await caches.match(request) || 
         await caches.match('/index.html') || 
         new Response('Offline', { status: 503 });
}

// Handle image requests - cache first with optimization
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      // Only cache images under 1MB
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 1048576) {
        cache.put(request, response.clone());
      }
      return response;
    }
  } catch (error) {
    // Network failed
  }
  
  return new Response('Image not available', { status: 503 });
}

// Handle static assets - cache first
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    return new Response('Asset unavailable', { status: 503 });
  }
}

// Handle other requests - network first
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return await caches.match(request) || 
           new Response('Network error', { status: 503 });
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    }).catch((error) => {
      event.ports[0].postMessage({ success: false, error: error.message });
    });
  }
  
  // Handle page visibility changes without triggering reloads
  if (event.data && event.data.type === 'PAGE_HIDDEN') {
    // Page is hidden, pause non-critical operations
    console.log('SW: Page hidden, reducing activity');
    // Cancel any pending cache updates to prevent interference
    self.skipCacheUpdates = true;
  }
  
  if (event.data && event.data.type === 'PAGE_VISIBLE') {
    // Page is visible again, resume normal operations
    const hiddenDuration = event.data.hiddenDuration || 0;
    console.log(`SW: Page visible after ${hiddenDuration}ms`);
    
    // Only resume cache updates if it wasn't a quick tab switch
    if (hiddenDuration > 1000) {
      self.skipCacheUpdates = false;
    } else {
      console.log('SW: Quick tab switch detected, maintaining cache freeze');
      setTimeout(() => {
        self.skipCacheUpdates = false;
      }, 2000);
    }
  }
});