import { AuthError, Session, User } from "@supabase/supabase-js";
import { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react";

/**
 * Authentication response from Supabase
 */
export interface AuthResponse {
  /** The authenticated user or null */
  user: User | null;
  /** The current session or null */
  session: Session | null;
  /** Any error that occurred during authentication */
  error: AuthError | null;
}

/**
 * Options for password reset functionality
 */
export interface ResetPasswordOptions {
  /** Custom redirect URL after password reset */
  redirectUrl?: string;
  /** Whether to automatically sign in the user after password reset */
  autoSignIn?: boolean;
}

/**
 * Authentication modes for UI presentation
 */
export enum AuthMode {
  LOGIN = 'login',
  SIGNUP = 'signup',
  RESET = 'reset'
}

/**
 * Interface for authentication credentials
 */
export interface AuthCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Basic form data structure for login
 */
export interface FormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Extended form data structure for signup with password confirmation
 */
export interface SignupFormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Password confirmation to ensure matching */
  confirmPassword: string;
}

/**
 * Props for form field components
 */
export interface FormFieldProps {
  /** Input field ID */
  id: string;
  /** Field label */
  label: string;
  /** Input type (text, password, email, etc.) */
  type?: string;
  /** Current field value */
  value: string;
  /** Change handler for the input */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Optional element to display on the right side of the input */
  rightElement?: ReactNode;
}

/**
 * Props for signup-specific form fields
 */
export interface SignupFormFieldProps {
  /** Input field ID */
  id: string;
  /** Field label */
  label: string;
  /** Input type (text, password, email, etc.) */
  type?: string;
  /** Current field value */
  value: string;
  /** Change handler for the input */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Whether the field is required */
  required?: boolean;
}

/**
 * Props for buttons that show loading state
 */
export interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the button is in loading/pending state */
  isPending: boolean;
  /** Text to display when in pending state */
  pendingText: string;
  /** Default button text */
  defaultText: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Props for the signup form component
 */
export interface SignupFormProps {
  /** Handler for changing authentication mode */
  onModeChange: (mode: AuthMode) => void;
}

/**
 * Props for divider with text component
 */
export interface DividerWithTextProps {
  /** Text to display in the divider */
  text: string;
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