// Clear mobile browser cache to fix download issues

export const clearMobileCaches = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing mobile caches...');
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log(`🗑️ Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }
    
    // Clear service worker registrations
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ Unregistering service worker...');
        await registration.unregister();
      }
    }
    
    console.log('✅ Mobile caches cleared');
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
  }
};

// Auto-detect and fix mobile download issues
export const initMobileFix = (): void => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Clear caches if there's a download issue
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('download') || document.contentType !== 'text/html') {
      console.log('🚨 Mobile download issue detected, clearing caches...');
      clearMobileCaches();
    }
  }
};