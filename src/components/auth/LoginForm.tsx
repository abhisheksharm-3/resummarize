'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSignIn, useSignInWithGoogle } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiGoogleLine, RiLoader2Fill, RiAlertLine } from '@remixicon/react';
import { AuthMode, FormData } from '@/types/auth';
import { FormField } from '@/components/auth/FormField';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { DividerWithText } from '@/components/auth/DividerWithText';

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
}

/**
 * LoginForm component for user authentication
 * 
 * @param props Component props
 * @param props.onModeChange Function to change authentication mode (login/signup/reset)
 * @returns Login form component
 */
export default function LoginForm({ onModeChange }: LoginFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Auth hooks
  const signIn = useSignIn();
  const signInWithGoogle = useSignInWithGoogle();

  // Update form field handler
  const updateFormField = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific validation error when user types
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate form on data change
  useEffect(() => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    let valid = true;
    
    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    setValidationErrors(errors);
    setIsFormValid(valid && Boolean(formData.email) && Boolean(formData.password));
  }, [formData]);

  // Form submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    signIn.mutate(formData, {
      onError: (error) => {
        // You could handle specific error types here if needed
        console.error("Login error:", error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to continue to Resummarize</p>
      </div>

      {/* Error alert */}
      {signIn.error && (
        <Alert variant="destructive" className="text-sm animate-in fade-in-50">
          <RiAlertLine className="h-4 w-4 mr-2" />
          <AlertDescription>
            {signIn.error.message || 'Authentication failed. Please check your credentials.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField 
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={updateFormField('email')}
          required
          error={validationErrors.email}
          autoComplete="email"
          aria-invalid={Boolean(validationErrors.email)}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
        />
        
        <FormField 
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={updateFormField('password')}
          required
          error={validationErrors.password}
          autoComplete="current-password"
          aria-invalid={Boolean(validationErrors.password)}
          aria-describedby={validationErrors.password ? "password-error" : undefined}
          rightElement={
            <button 
              type="button"
              onClick={() => onModeChange(AuthMode.RESET)}
              className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
            >
              Forgot password?
            </button>
          }
        />

        <LoadingButton
          type="submit"
          className="w-full font-medium"
          isPending={signIn.isPending}
          pendingText="Signing in..."
          defaultText="Sign in"
          disabled={!isFormValid || signIn.isPending}
        />
      </form>

      <DividerWithText text="Or continue with" />

      {/* Social login */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 font-medium border-border hover:bg-muted/50"
        onClick={() => signInWithGoogle.mutate()}
        disabled={signInWithGoogle.isPending}
      >
        {signInWithGoogle.isPending ? (
          <RiLoader2Fill className="h-4 w-4 animate-spin" />
        ) : (
          <RiGoogleLine className="h-4 w-4" />
        )}
        <span>Google</span>
      </Button>

      {/* Sign up link */}
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => onModeChange(AuthMode.SIGNUP)}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}