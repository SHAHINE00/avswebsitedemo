import * as React from 'react';

export const useFormPersistence = <T>(key: string, initialData: T) => {
  const initialDataRef = React.useRef<T>(initialData);
  const [data, setData] = React.useState<T>(initialData);

  // Load from localStorage on mount (only once)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData({ ...initialDataRef.current, ...parsedData });
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
  }, [key]);

  // Save to localStorage whenever data changes
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [key, data]);

  // Use useRef to create a truly stable function reference
  const updateDataRef = React.useRef<(updates: Partial<T> | ((prev: T) => T)) => void>();
  
  if (!updateDataRef.current) {
    updateDataRef.current = (updates: Partial<T> | ((prev: T) => T)) => {
      setData(prev => {
        if (typeof updates === 'function') {
          return updates(prev);
        }
        return { ...prev, ...updates };
      });
    };
  }
  
  const updateData = updateDataRef.current;

  const clearData = React.useCallback(() => {
    try {
      localStorage.removeItem(key);
      setData(initialDataRef.current);
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