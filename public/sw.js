// Enhanced Service Worker for all devices with iOS Safari compatibility
const CACHE_NAME = 'avs-website-v3';
const STATIC_CACHE = 'avs-static-v3';
const RUNTIME_CACHE = 'avs-runtime-v3';

// iOS Safari detection in Service Worker
const isIOSSafari = () => {
  const userAgent = (self.navigator && self.navigator.userAgent) || '';
  return /iPad|iPhone|iPod/.test(userAgent) || (userAgent.includes('Safari') && userAgent.includes('Mobile'));
};

// Critical resources to cache
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Install event - cache critical resources with iOS compatibility
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // iOS Safari needs special handling
  const installPromise = isIOSSafari() 
    ? handleIOSInstall()
    : handleStandardInstall();
  
  event.waitUntil(installPromise);
  self.skipWaiting();
});

// Standard installation for non-iOS devices
async function handleStandardInstall() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    console.log('Caching critical resources...');
    await cache.addAll(CRITICAL_RESOURCES);
    return Promise.resolve();
  } catch (error) {
    console.error('Standard install failed:', error);
    return Promise.resolve();
  }
}

// iOS-specific installation with progressive caching
async function handleIOSInstall() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    console.log('iOS Safari: Progressive caching...');
    
    // Cache resources one by one to avoid iOS memory limits
    for (const resource of CRITICAL_RESOURCES) {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          await cache.put(resource, response);
        }
      } catch (error) {
        console.warn(`iOS: Failed to cache ${resource}:`, error);
      }
    }
    return Promise.resolve();
  } catch (error) {
    console.error('iOS install failed:', error);
    return Promise.resolve();
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch event with better caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for allowed CDNs)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && 
      !url.hostname.includes('fonts.googleapis.com') && 
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // Handle different types of requests
  if (event.request.destination === 'document') {
    // For navigation requests, try network first, fallback to cache
    event.respondWith(handleNavigationRequest(event.request));
  } else if (event.request.url.includes('/static/') || 
             event.request.url.includes('.css') || 
             event.request.url.includes('.js')) {
    // For static assets, try cache first, fallback to network
    event.respondWith(handleStaticRequest(event.request));
  } else {
    // For other requests, try network first with cache fallback
    event.respondWith(handleDefaultRequest(event.request));
  }
});

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log('Network failed for navigation, trying cache');
  }
  
  // Try cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to index.html for SPA routing
  return caches.match('/index.html') || new Response('Offline', { status: 503 });
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log('Failed to fetch static asset:', request.url);
  }
  
  return new Response('Resource not available offline', { status: 503 });
}

// Handle default requests
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
      return response;
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
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
});