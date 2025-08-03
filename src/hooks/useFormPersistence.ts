import * as React from 'react';

export const useFormPersistence = <T>(key: string, initialData: T) => {
  // Create stable reference to initial data to prevent re-renders
  const initialDataRef = React.useRef<T>();
  const isInitializedRef = React.useRef(false);
  
  // Only set initial data once to prevent infinite loops
  if (!isInitializedRef.current) {
    initialDataRef.current = initialData;
    isInitializedRef.current = true;
  }
  
  const [data, setData] = React.useState<T>(initialDataRef.current!);

  // Load from localStorage on mount (only once)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData({ ...initialDataRef.current!, ...parsedData });
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
  }, [key]); // Only depend on key, not initialData

  // Save to localStorage whenever data changes (but not on initial load)
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip saving on first render
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [key, data]);

  // Create stable update function using useCallback
  const updateData = React.useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const clearData = React.useCallback(() => {
    try {
      localStorage.removeItem(key);
      setData(initialDataRef.current!);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [key]);

  return {
    data,
    updateData,
    clearData
  };
};