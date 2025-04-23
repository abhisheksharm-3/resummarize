/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/services/supabase/client';
import { AuthResponse, ResetPasswordOptions } from '@/types/auth';
import { AuthError, Session, User, Provider } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient();

/**
 * Authentication service for handling user authentication flows
 * 
 * @description Provides methods for authentication with email/password and OAuth providers
 * @lastUpdated 2025-04-23
 */

/**
 * Sign up with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResponse object containing user, session, and any error
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    return {
      user: data?.user || null,
      session: data?.session || null,
      error,
    };
  } catch (error) {
    const authError = error instanceof Error 
      ? new AuthError(error.message) 
      : error as AuthError;
    
    return {
      user: null,
      session: null,
      error: authError,
    };
  }
}

/**
 * Sign in with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResponse object containing user, session, and any error
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data?.user || null,
      session: data?.session || null,
      error,
    };
  } catch (error) {
    const authError = error instanceof Error 
      ? new AuthError(error.message) 
      : error as AuthError;
    
    return {
      user: null,
      session: null,
      error: authError,
    };
  }
}

/**
 * Sign in with OAuth provider (e.g., Google, GitHub)
 *
 * @param provider - OAuth provider name
 * @param redirectTo - Optional custom redirect URL after authentication
 * @returns Promise that resolves when OAuth redirect is initiated
 */
export async function signInWithOAuth(
  provider: Provider = 'google', 
  redirectTo?: string
): Promise<void> {
  try {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Sign in with Google OAuth - convenience method
 * 
 * @returns Promise that resolves when Google OAuth redirect is initiated
 */
export async function signInWithGoogle(): Promise<void> {
  return signInWithOAuth('google');
}

/**
 * Sign out the current user
 *
 * @returns Object containing any error that occurred
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    return { error };
  } catch (error) {
    const authError = error instanceof Error 
      ? new AuthError(error.message) 
      : error as AuthError;
    
    return { error: authError };
  }
}

/**
 * Get the current user
 * 
 * @param skipCache - If true, bypass cache and fetch fresh data
 * @returns Current user or null if not authenticated
 */
export async function getCurrentUser(skipCache: boolean = false): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return null;
    }
    
    return data?.user || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get the current session
 *
 * @returns Current session or null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return null;
    }
    
    return data?.session || null;
  } catch (error) {
    return null;
  }
}

/**
 * Send password reset email
 *
 * @param email - User's email address
 * @param options - Optional configuration for reset flow
 * @returns Object containing any error that occurred
 */
export async function resetPassword(
  email: string, 
  options?: ResetPasswordOptions
): Promise<{ error: AuthError | null }> {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    
    const redirectTo = options?.redirectUrl || `${window.location.origin}/auth/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    
    return { error };
  } catch (error) {
    const authError = error instanceof Error 
      ? new AuthError(error.message) 
      : error as AuthError;
    
    return { error: authError };
  }
}

/**
 * Refresh the current session
 * 
 * @returns Updated session or null if refresh fails
 */
export async function refreshSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      return null;
    }
    
    return data.session;
  } catch (error) {
    return null;
  }
}
