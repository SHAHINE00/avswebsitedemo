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

    // Track page visibility without triggering reloads
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.tabSwitchTime = Date.now();
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

  markNavigationComplete() {
    this.isNavigating = false;
  }
}

// Initialize the navigation state manager
export const navigationStateManager = NavigationStateManager.getInstance();