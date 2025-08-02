// Clear mobile browser cache and service worker to fix download issues

export const clearMobileCache = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing mobile cache...');
    
    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ Unregistering service worker...');
        await registration.unregister();
      }
    }
    
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
    
    // Force reload without cache
    console.log('🔄 Forcing page reload...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// Auto-clear cache on mobile if download issue detected
export const autoFixMobileDownload = (): void => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const hasDownloadIssue = document.contentType !== 'text/html' || 
                           document.location.href.includes('download');
  
  if (isMobile && hasDownloadIssue) {
    console.log('🚨 Mobile download issue detected, clearing cache...');
    clearMobileCache();
  }
};