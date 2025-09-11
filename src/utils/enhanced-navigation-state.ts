// Enhanced Navigation state management with browser-specific optimizations
export class EnhancedNavigationStateManager {
  private static instance: EnhancedNavigationStateManager;
  private isNavigating = false;
  private lastRoute = '';
  private tabSwitchTime = 0;
  private browserType = '';
  private visibilityChangeCount = 0;
  private lastVisibilityChange = 0;

  private constructor() {
    this.detectBrowser();
    this.initializeListeners();
  }

  static getInstance(): EnhancedNavigationStateManager {
    if (!EnhancedNavigationStateManager.instance) {
      EnhancedNavigationStateManager.instance = new EnhancedNavigationStateManager();
    }
    return EnhancedNavigationStateManager.instance;
  }

  private detectBrowser() {
    if (typeof window === 'undefined') return;
    
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      this.browserType = 'chrome';
    } else if (userAgent.includes('Firefox')) {
      this.browserType = 'firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      this.browserType = 'safari';
    } else if (userAgent.includes('Edge')) {
      this.browserType = 'edge';
    }
  }

  private initializeListeners() {
    if (typeof window === 'undefined') return;

    // Track actual navigation vs tab switches
    window.addEventListener('beforeunload', () => {
      this.isNavigating = true;
      sessionStorage.setItem('nav_state', JSON.stringify({
        wasNavigating: true,
        lastRoute: window.location.pathname,
        timestamp: Date.now(),
        browserType: this.browserType
      }));
    });

    // Enhanced page visibility handling with rapid change detection
    document.addEventListener('visibilitychange', () => {
      const now = Date.now();
      const timeSinceLastChange = now - this.lastVisibilityChange;
      
      if (document.hidden) {
        this.tabSwitchTime = now;
        this.visibilityChangeCount++;
        sessionStorage.setItem('tab_hidden_time', this.tabSwitchTime.toString());
        
        // Send message to service worker about page being hidden
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'PAGE_HIDDEN',
            timestamp: now
          });
        }
      } else {
        const hiddenTime = this.tabSwitchTime ? now - this.tabSwitchTime : 0;
        
        // Detect rapid tab switching (likely browser tab management)
        if (timeSinceLastChange < 1000 && this.visibilityChangeCount > 2) {
          console.log('Rapid tab switching detected - preventing any reloads');
          this.preventAllReloads();
          return;
        }
        
        console.log(`Tab visible after ${hiddenTime}ms on ${this.browserType} - optimized handling`);
        
        // Browser-specific handling
        if (this.browserType === 'safari' && hiddenTime > 5000) {
          // Safari needs gentler handling
          this.gentleReactivation();
        } else if (hiddenTime > 30 * 60 * 1000) {
          // Only check for updates if hidden for more than 30 minutes
          this.checkForUpdates();
        }
        
        // Send message to service worker about page being visible
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'PAGE_VISIBLE',
            timestamp: now,
            hiddenDuration: hiddenTime
          });
        }
      }
      
      this.lastVisibilityChange = now;
    });

    // Handle force remount events
    window.addEventListener('forceRemount', () => {
      console.log('Force remount requested - using React state reset');
      // This will be handled by React components listening for this event
    });

    // Clean up rapid change detection after a period
    setInterval(() => {
      this.visibilityChangeCount = Math.max(0, this.visibilityChangeCount - 1);
    }, 10000);
  }

  private preventAllReloads() {
    // Temporarily disable any reload mechanisms
    sessionStorage.setItem('prevent_reload', Date.now().toString());
    setTimeout(() => {
      sessionStorage.removeItem('prevent_reload');
    }, 5000);
  }

  private gentleReactivation() {
    // Safari-specific gentle reactivation without forcing updates
    console.log('Safari gentle reactivation');
    // Just resume normal operations without forcing checks
  }

  private async checkForUpdates() {
    // Non-intrusive update check without reloading
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        console.log('Service worker updated silently');
      } catch (error) {
        console.log('Service worker update check failed:', error);
      }
    }
  }

  isTabSwitch(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if we're in rapid switching prevention mode
    const preventReload = sessionStorage.getItem('prevent_reload');
    if (preventReload) {
      const preventTime = parseInt(preventReload);
      if (Date.now() - preventTime < 5000) {
        return true;
      }
    }
    
    const navState = sessionStorage.getItem('nav_state');
    if (navState) {
      try {
        const parsed = JSON.parse(navState);
        const timeDiff = Date.now() - parsed.timestamp;
        // If less than 5 seconds and same route, likely a tab switch
        return timeDiff < 5000 && parsed.lastRoute === window.location.pathname;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  markNavigationComplete() {
    this.isNavigating = false;
    sessionStorage.removeItem('nav_state');
  }

  preventUnnecessaryReload(): boolean {
    // Check if this is a tab switch rather than navigation
    if (this.isTabSwitch()) {
      console.log(`Tab switch detected on ${this.browserType} - preventing reload`);
      return true;
    }
    return false;
  }

  // Session restoration without full reloads
  restoreSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const sessionData = sessionStorage.getItem('app_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Restore scroll position, form data, etc. without reload
        if (parsed.scrollPosition) {
          window.scrollTo(0, parsed.scrollPosition);
        }
        return true;
      }
    } catch (e) {
      console.warn('Session restoration failed:', e);
    }
    return false;
  }

  saveSession() {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionData = {
        scrollPosition: window.scrollY,
        timestamp: Date.now(),
        pathname: window.location.pathname
      };
      sessionStorage.setItem('app_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Session save failed:', e);
    }
  }
}

// Initialize the enhanced navigation state manager
export const enhancedNavigationStateManager = EnhancedNavigationStateManager.getInstance();