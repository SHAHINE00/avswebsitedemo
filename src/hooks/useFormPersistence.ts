import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

export const useFormPersistence = <T>(key: string, initialData: T) => {
  const [data, setData] = useState<T>(initialData);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData({ ...initialData, ...parsedData });
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
  }, [key, initialData]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [key, data]);

  const updateData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setData(initialData);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [key, initialData]);

  return {
    data,
    updateData,
    clearData
  };
};