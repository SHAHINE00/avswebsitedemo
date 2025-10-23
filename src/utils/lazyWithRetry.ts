import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with retry logic and exponential backoff
 * Prevents "Failed to fetch dynamically imported module" errors
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImporter: () => Promise<{ default: T }>,
  retries = 3,
  delayMs = 800
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const attemptLoad = async (attempt = 1): Promise<{ default: T }> => {
      try {
        return await componentImporter();
      } catch (error) {
        // If we've exhausted retries, throw the error
        if (attempt >= retries) {
          console.error(`Failed to load module after ${retries} attempts:`, error);
          throw error;
        }

        // Wait with exponential backoff before retrying
        const delay = delayMs * attempt;
        console.warn(`Module load failed (attempt ${attempt}/${retries}), retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with incremented attempt counter
        return attemptLoad(attempt + 1);
      }
    };

    return attemptLoad();
  });
}
