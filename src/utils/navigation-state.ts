// Navigation state management to prevent unnecessary reloads during tab switches
export class NavigationStateManager {
  private static instance: NavigationStateManager;
  private isNavigating = false;
  private lastRoute = '';
  private tabSwitchTime = 0;

  private constructor() {
    this.initializeListeners();
  }

  static getInstance(): NavigationStateManager {
    if (!NavigationStateManager.instance) {
      NavigationStateManager.instance = new NavigationStateManager();
    }
    return NavigationStateManager.instance;
  }

  private initializeListeners() {
    if (typeof window === 'undefined') return;

    // Track actual navigation vs tab switches
    window.addEventListener('beforeunload', () => {
      this.isNavigating = true;
      sessionStorage.setItem('nav_state', JSON.stringify({
        wasNavigating: true,
        lastRoute: window.location.pathname,
        timestamp: Date.now()
      }));
    });

    // Track page visibility without triggering reloads
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.tabSwitchTime = Date.now();
        sessionStorage.setItem('tab_hidden_time', this.tabSwitchTime.toString());
      } else {
        const hiddenTime = this.tabSwitchTime ? Date.now() - this.tabSwitchTime : 0;
        console.log(`Tab visible after ${hiddenTime}ms - no reload needed`);
        
        // Only check for updates if hidden for more than 30 minutes
        if (hiddenTime > 30 * 60 * 1000) {
          console.log('Long tab switch detected, checking for updates');
          this.checkForUpdates();
        }
      }
    });

    // Handle force remount events
    window.addEventListener('forceRemount', () => {
      console.log('Force remount requested - using React state reset');
      // This will be handled by React components listening for this event
    });
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
      console.log('Tab switch detected - preventing reload');
      return true;
    }
    return false;
  }
}

// Initialize the navigation state manager
export const navigationStateManager = NavigationStateManager.getInstance();