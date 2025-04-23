'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useSignOut } from '@/hooks/useUser';
import { UseAuthOptions, UseAuthResult } from '@/types/auth';

/**
 * Hook for managing authentication state and protected routes
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, signOut } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <button onClick={signOut}>Log out</button>;
 * }
 * ```
 * 
 * @param options - Configuration options for the auth hook
 * @returns Authentication state and utilities
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const router = useRouter();
  const pathname = usePathname();
  
  // Apply defaults to options
  const {
    protectedRoutes = ['/dashboard'],
    loginRedirectPath = '/auth?mode=login',
    enableAutoRedirect = true,
  } = options;
  
  // Get user data with React Query
  const { 
    data: user, 
    isLoading, 
    isError,
    error: userError,
    refetch: refetchUser
  } = useUser();
  
  // Sign out mutation with React Query
  const { 
    mutate: signOutMutation, 
    isPending: isSigningOut,
    error: signOutError
  } = useSignOut();

  /**
   * Check if a given path is a protected route
   */
  const isProtectedRoute = useCallback((path: string): boolean => {
    return protectedRoutes.some(route => path?.startsWith(route));
  }, [protectedRoutes]);
  
  // Handle automatic redirects for protected routes
  useEffect(() => {
    if (!enableAutoRedirect) return;
    
    const currentPathIsProtected = isProtectedRoute(pathname || '');
    
    // If data is loaded (not loading) and we have no user but on protected route
    if (!isLoading && !user && currentPathIsProtected) {
      // Store the original URL for redirect back after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname || '');
      }
      
      router.push(loginRedirectPath);
    }
  }, [
    user, 
    isLoading, 
    pathname, 
    router, 
    isProtectedRoute, 
    enableAutoRedirect, 
    loginRedirectPath
  ]);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(() => {
    signOutMutation(undefined, {
      onSuccess: () => {
        // Optionally redirect after sign out
        router.push('/');
        
        // Force refetch of user to clear state
        refetchUser();
      }
    });
  }, [signOutMutation, router, refetchUser]);

  /**
   * Combine errors from user fetching and sign out
   */
  const error = useMemo(() => {
    if (userError) return userError;
    if (signOutError) return signOutError;
    if (isError) return new Error('Authentication error');
    return null;
  }, [isError, userError, signOutError]);

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isSigningOut,
    signOut,
    refetchUser,
    error,
    isProtectedRoute,
  };
}