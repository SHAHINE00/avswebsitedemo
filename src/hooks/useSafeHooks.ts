
import { useState, useEffect, useContext } from 'react';
import * as React from 'react';

/**
 * Safe React Hooks with Built-in Error Handling
 * These wrappers provide fallback behavior when React hooks fail
 */

export function useSafeState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  try {
    return useState(initialState);
  } catch (error) {
    console.warn('useSafeState failed:', error);
    return [initialState, () => {}];
  }
}

export function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  try {
    useEffect(effect, deps);
  } catch (error) {
    console.warn('useSafeEffect failed:', error);
  }
}

export function useSafeContext<T>(context: React.Context<T>): T | null {
  try {
    return useContext(context);
  } catch (error) {
    console.warn('useSafeContext failed:', error);
    return null;
  }
}

export function useSafeLocation() {
  try {
    const { useLocation } = require('react-router-dom');
    return useLocation();
  } catch (error) {
    console.warn('useSafeLocation failed:', error);
    return { pathname: '/', search: '', hash: '', state: null };
  }
}

export function useSafeAuth() {
  try {
    const { useAuth } = require('@/contexts/AuthContext');
    return useAuth();
  } catch (error) {
    console.warn('useSafeAuth failed:', error);
    return { user: null, session: null, loading: false, signIn: async () => ({}), signUp: async () => ({}), signOut: async () => {} };
  }
}
