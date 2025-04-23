import { AuthError, Session, User } from "@supabase/supabase-js";
import { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react";

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }
  export interface ResetPasswordOptions {
    /**
     * Custom redirect URL after password reset
     */
    redirectUrl?: string;
    
    /**
     * Whether to automatically sign in the user after password reset
     */
    autoSignIn?: boolean;
  }
  export enum AuthMode {
    LOGIN = 'login',
    SIGNUP = 'signup',
    RESET = 'reset'
  }

  export interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    rightElement?: ReactNode;
  }
  export interface SignupFormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
  export interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isPending: boolean;
    pendingText: string;
    defaultText: string;
    className?: string;
    disabled?: boolean;
  }
  export interface SignupFormProps {
    onModeChange: (mode: AuthMode) => void;
  }
  export interface DividerWithTextProps {
    text: string;
  }
  
  export interface FormData {
    email: string;
    password: string;
  }

  export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
  }

  /**
   * Authentication hook configuration options
   */
  export interface UseAuthOptions {
    /**
     * List of routes that require authentication
     * @default ['/dashboard', '/notes', '/settings', '/profile']
     */
    protectedRoutes?: string[];
    
    /**
     * Redirect path for unauthenticated users trying to access protected routes
     * @default '/auth?mode=login'
     */
    loginRedirectPath?: string;
  
    /**
     * Whether to automatically redirect unauthenticated users from protected routes
     * @default true
     */
    enableAutoRedirect?: boolean;
  }
  
  /**
   * Authentication hook result
   */
  export interface UseAuthResult {
    /**
     * The current authenticated user or null if not authenticated
     */
    user: User | null;
    
    /**
     * Whether the authentication state is still loading
     */
    isLoading: boolean;
    
    /**
     * Whether the current user is authenticated
     */
    isAuthenticated: boolean;
    
    /**
     * Whether the sign-out process is in progress
     */
    isSigningOut: boolean;
    
    /**
     * Sign out the current user
     */
    signOut: () => void;
    
    /**
     * Refresh the current user data
     */
    refetchUser: () => void;
    
    /**
     * Any error that occurred during authentication
     */
    error: Error | null;
    
    /**
     * Check if a route is protected and requires authentication
     */
    isProtectedRoute: (path: string) => boolean;
  }

  /**
 * Interface for authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}