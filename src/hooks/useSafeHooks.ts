
import { useState, useEffect, useContext } from 'react';
import * as React from 'react';
import { isReactAvailable } from '@/utils/reactInitialization';

/**
 * Safe React Hooks with Built-in Error Handling
 * These wrappers provide fallback behavior when React hooks fail
 */

export function useSafeState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (!isReactAvailable()) {
    console.warn('useSafeState: React not available');
    return [initialState, () => {}];
  }
  
  try {
    return useState(initialState);
  } catch (error) {
    console.warn('useSafeState failed:', error);
    return [initialState, () => {}];
  }
}

export function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  if (!isReactAvailable()) {
    console.warn('useSafeEffect: React not available');
    return;
  }
  
  try {
    useEffect(effect, deps);
  } catch (error) {
    console.warn('useSafeEffect failed:', error);
  }
}

export function useSafeContext<T>(context: React.Context<T>): T | null {
  if (!isReactAvailable()) {
    console.warn('useSafeContext: React not available');
    return null;
  }
  
  try {
    return useContext(context);
  } catch (error) {
    console.warn('useSafeContext failed:', error);
    return null;
  }
}

export function useSafeLocation() {
  if (!isReactAvailable()) {
    return { pathname: '/', search: '', hash: '', state: null };
  }

  try {
    const { useLocation } = require('react-router-dom');
    return useLocation();
  } catch (error) {
    console.warn('useSafeLocation failed:', error);
    return { pathname: '/', search: '', hash: '', state: null };
  }
}

export function useSafeAuth() {
  if (!isReactAvailable()) {
    return { user: null, session: null, loading: false, signIn: async () => ({}), signUp: async () => ({}), signOut: async () => {} };
  }

  try {
    const { useAuth } = require('@/contexts/AuthContext');
    return useAuth();
  } catch (error) {
    console.warn('useSafeAuth failed:', error);
    return { user: null, session: null, loading: false, signIn: async () => ({}), signUp: async () => ({}), signOut: async () => {} };
  }
}
