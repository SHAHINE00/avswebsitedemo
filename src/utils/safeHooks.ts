import * as React from 'react';

// Safe useState wrapper
export function useSafeState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (!React || !React.useState) {
    console.warn('React.useState not available, using fallback');
    return [initialState, () => {}];
  }
  
  try {
    return React.useState(initialState);
  } catch (error) {
    console.warn('useState failed:', error);
    return [initialState, () => {}];
  }
}

// Safe useEffect wrapper
export function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  if (!React || !React.useEffect) {
    console.warn('React.useEffect not available');
    return;
  }
  
  try {
    React.useEffect(effect, deps);
  } catch (error) {
    console.warn('useEffect failed:', error);
  }
}

// Safe useContext wrapper
export function useSafeContext<T>(context: React.Context<T>): T | null {
  if (!React || !React.useContext) {
    console.warn('React.useContext not available');
    return null;
  }
  
  try {
    return React.useContext(context);
  } catch (error) {
    console.warn('useContext failed:', error);
    return null;
  }
}

// Safe useLocation wrapper with fallback
export function useSafeLocation() {
  try {
    const { useLocation } = require('react-router-dom');
    return useLocation();
  } catch (error) {
    console.warn('useLocation failed:', error);
    return { pathname: '/', search: '', hash: '', state: null };
  }
}