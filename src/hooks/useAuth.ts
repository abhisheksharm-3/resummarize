'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useSignOut } from '@/hooks/useUser';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { 
    data: user, 
    isLoading, 
    isError,
    refetch: refetchUser
  } = useUser();
  
  const { 
    mutate: signOutMutation, 
    isPending: isSigningOut,
    error: signOutError
  } = useSignOut();

  // Check if user is authenticated for protected routes
  useEffect(() => {
    // List of paths that require authentication
    const protectedRoutes = ['/dashboard', '/notes'];
    
    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname?.startsWith(route)
    );

    // If data is loaded (not loading) and we have no user but on protected route
    if (!isLoading && !user && isProtectedRoute) {
      router.push('/auth?mode=login');
    }
  }, [user, isLoading, pathname, router]);

  // Wrapper for signOut that maintains the React Query pattern
  const signOut = () => {
    signOutMutation();
  };

  const error = useMemo(() => {
    return isError || signOutError;
  }, [isError, signOutError]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSigningOut,
    signOut,
    refetchUser,
    error
  };
}