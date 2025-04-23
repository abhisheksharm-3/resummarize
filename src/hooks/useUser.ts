'use client';

import { getCurrentUser, resetPassword, signIn, signInWithGoogle, signOut, signUp } from '@/controllers/AuthControllers';
import { AuthCredentials } from '@/types/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Authentication query keys for consistent cache management
 */
const AUTH_KEYS = {
  user: ['user']
} as const;

/**
 * Hook to get the currently authenticated user
 * @returns Query result with the current user or null if not authenticated
 */
export function useUser() {
  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes before refetching
  });
}

/**
 * Hook for user registration
 * @returns Mutation for signing up a new user with email and password
 */
export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: AuthCredentials) =>
      signUp(email, password),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.user);
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for user authentication with email and password
 * @returns Mutation for signing in an existing user
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: AuthCredentials) =>
      signIn(email, password),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(AUTH_KEYS.user, data.user);
        router.push('/dashboard');
      }
    },
  });
}

/**
 * Hook for authentication with Google OAuth
 * @returns Mutation for initiating Google sign-in flow
 */
export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: () => signInWithGoogle(),
  });
}

/**
 * Hook for signing out the current user
 * @returns Mutation for signing out and clearing authentication state
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      // Set user data to null immediately for UI updates
      queryClient.setQueryData(AUTH_KEYS.user, null);
      
      // Remove user query completely instead of just invalidating
      // This ensures we don't retain any cached user data after logout
      queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
      
      // Clear all other queries to ensure fresh data on re-login
      queryClient.clear();
      
      // Redirect to home page
      router.push('/');
    },
  });
}

/**
 * Hook for requesting a password reset
 * @returns Mutation for sending a password reset email
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => resetPassword(email),
  });
}