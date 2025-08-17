import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef, 
  useContext
} from 'react';
import { useLocation } from 'react-router-dom';

// Safe React hooks that provide fallbacks when React hooks are null during HMR
export const useSafeState = <T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] => {
  try {
    if (!React || !useState || useState === null) {
      console.warn('useState is null, using fallback');
      const value = typeof initialState === 'function' ? (initialState as () => T)() : initialState;
      return [value, () => {}];
    }
    return useState(initialState);
  } catch (error) {
    console.warn('useState failed, using fallback:', error);
    const value = typeof initialState === 'function' ? (initialState as () => T)() : initialState;
    return [value, () => {}];
  }
};

export const useSafeEffect = (effect: React.EffectCallback, deps?: React.DependencyList): void => {
  try {
    if (!React || !useEffect || useEffect === null) {
      console.warn('useEffect is null, skipping effect');
      return;
    }
    return useEffect(effect, deps);
  } catch (error) {
    console.warn('useEffect failed, skipping effect:', error);
  }
};

export const useSafeCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  try {
    if (!React || !useCallback || useCallback === null) {
      console.warn('useCallback is null, returning callback directly');
      return callback;
    }
    return useCallback(callback, deps);
  } catch (error) {
    console.warn('useCallback failed, returning callback directly:', error);
    return callback;
  }
};

export const useSafeMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  try {
    if (!React || !useMemo || useMemo === null) {
      console.warn('useMemo is null, computing value directly');
      return factory();
    }
    return useMemo(factory, deps);
  } catch (error) {
    console.warn('useMemo failed, computing value directly:', error);
    return factory();
  }
};

export const useSafeRef = <T>(initialValue: T): React.MutableRefObject<T> => {
  try {
    if (!React || !useRef || useRef === null) {
      console.warn('useRef is null, using fallback ref');
      return { current: initialValue };
    }
    return useRef(initialValue);
  } catch (error) {
    console.warn('useRef failed, using fallback ref:', error);
    return { current: initialValue };
  }
};

export const useSafeContext = <T>(context: React.Context<T>): T => {
  try {
    if (!React || !useContext || useContext === null) {
      console.warn('useContext is null, using default value');
      return {} as T;
    }
    return useContext(context);
  } catch (error) {
    console.warn('useContext failed, using default value:', error);
    return {} as T;
  }
};

export const useSafeLocation = () => {
  try {
    if (!useLocation || useLocation === null) {
      console.warn('useLocation is null, using fallback location');
      return {
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default'
      };
    }
    return useLocation();
  } catch (error) {
    console.warn('useLocation failed, using fallback location:', error);
    return {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    };
  }
};