import { useState, useEffect, useCallback } from 'react';

interface PersonalizationPreferences {
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  reduceMotion: boolean;
  language: 'fr' | 'en';
  favoriteCategories: string[];
  recentSearches: string[];
}

const defaultPreferences: PersonalizationPreferences = {
  theme: 'auto',
  accentColor: 'hsl(var(--academy-blue))',
  fontSize: 'md',
  layoutDensity: 'comfortable',
  reduceMotion: false,
  language: 'fr',
  favoriteCategories: [],
  recentSearches: []
};

export function usePersonalization() {
  const [preferences, setPreferences] = useState<PersonalizationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem('user-preferences');
    if (stored) {
      try {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      } catch (error) {
        console.warn('Failed to parse stored preferences:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updatePreference = useCallback(<K extends keyof PersonalizationPreferences>(
    key: K,
    value: PersonalizationPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('user-preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToRecentSearches = useCallback((search: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        recentSearches: [search, ...prev.recentSearches.filter(s => s !== search)].slice(0, 10)
      };
      localStorage.setItem('user-preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addFavoriteCategory = useCallback((category: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        favoriteCategories: [...new Set([...prev.favoriteCategories, category])]
      };
      localStorage.setItem('user-preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavoriteCategory = useCallback((category: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        favoriteCategories: prev.favoriteCategories.filter(c => c !== category)
      };
      localStorage.setItem('user-preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('user-preferences');
  }, []);

  // Apply theme-specific CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    const fontSizeMap = {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px'
    };
    root.style.fontSize = fontSizeMap[preferences.fontSize];

    // Apply layout density
    const densityMap = {
      compact: '0.75rem',
      comfortable: '1rem',
      spacious: '1.5rem'
    };
    root.style.setProperty('--spacing-unit', densityMap[preferences.layoutDensity]);

    // Apply accent color
    root.style.setProperty('--accent-custom', preferences.accentColor);

  }, [preferences]);

  const getLayoutClasses = useCallback(() => {
    const densityClasses = {
      compact: 'space-y-2 p-2',
      comfortable: 'space-y-4 p-4',
      spacious: 'space-y-6 p-6'
    };
    return densityClasses[preferences.layoutDensity];
  }, [preferences.layoutDensity]);

  const getFontSizeClasses = useCallback(() => {
    const fontClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };
    return fontClasses[preferences.fontSize];
  }, [preferences.fontSize]);

  return {
    preferences,
    isLoading,
    updatePreference,
    addToRecentSearches,
    addFavoriteCategory,
    removeFavoriteCategory,
    resetPreferences,
    getLayoutClasses,
    getFontSizeClasses
  };
}