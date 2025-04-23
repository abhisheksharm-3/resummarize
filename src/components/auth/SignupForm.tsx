'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSignUp, useSignInWithGoogle } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiGoogleLine, RiLoader2Fill, RiAlertLine, RiCheckLine, RiCloseLine } from '@remixicon/react';
import { AuthMode, SignupFormData, SignupFormProps } from '@/types/auth';
import { FormField } from '@/components/auth/FormField';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { DividerWithText } from '@/components/auth/DividerWithText';
import { Progress } from '@/components/ui/progress';

/**
 * SignupForm component for user registration
 * 
 * @param props Component props
 * @param props.onModeChange Function to change authentication mode (login/signup/reset)
 * @returns Signup form component
 */
export default function SignupForm({ onModeChange }: SignupFormProps) {
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Auth hooks
  const signUp = useSignUp();
  const signInWithGoogle = useSignInWithGoogle();

  // Update form field handler
  const updateFormField = (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
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

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 20; // Has uppercase
    if (/[a-z]/.test(password)) score += 10; // Has lowercase
    if (/[0-9]/.test(password)) score += 20; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 20; // Has special char
    
    // Return score capped at 100
    return Math.min(score, 100);
  };

  // Get text based on password strength
  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 70) return 'Moderate';
    return 'Strong';
  };
  
  // Validate form on data change
  useEffect(() => {
    const errors: Partial<Record<keyof SignupFormData, string>> = {};
    let valid = true;
    
    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
        valid = false;
      }
    }
    
    // Confirm password validation
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Update password strength
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
    
    setValidationErrors(errors);
    setIsFormValid(
      valid && 
      Boolean(formData.email) && 
      Boolean(formData.password) && 
      Boolean(formData.confirmPassword) &&
      formData.password === formData.confirmPassword
    );
  }, [formData]);

  // Form submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    signUp.mutate({ 
      email: formData.email, 
      password: formData.password 
    }, {
      onError: (error) => {
        console.error("Signup error:", error);
      }
    });
  };
  
  // Current date info from props
  const currentDate = "2025-04-23 13:27:13";
  const currentUser = "abhisheksharm-3";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground text-sm">Sign up to get started with Resummarize</p>
      </div>

      {/* Error alert */}
      {signUp.error && (
        <Alert variant="destructive" className="text-sm animate-in fade-in-50">
          <RiAlertLine className="h-4 w-4 mr-2" />
          <AlertDescription>
            {signUp.error.message || 'Failed to create account. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Signup form */}
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
        
        <div className="space-y-4">
          <FormField 
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={updateFormField('password')}
            required
            error={validationErrors.password}
            autoComplete="new-password"
            aria-invalid={Boolean(validationErrors.password)}
            aria-describedby="password-strength"
          />
          
          {formData.password && (
            <div className="space-y-2" id="password-strength">
              <Progress
                value={passwordStrength}
                className="h-1.5"
              />
              <div className="flex justify-between items-center text-xs">
                <span className={`font-medium ${passwordStrength < 30 ? 'text-red-500' : passwordStrength < 70 ? 'text-amber-500' : 'text-green-500'}`}>
                  {getPasswordStrengthText(passwordStrength)}
                </span>
                
                <div className="space-x-2">
                  {[
                    { check: formData.password.length >= 8, text: "8+ chars" },
                    { check: /[A-Z]/.test(formData.password), text: "Uppercase" },
                    { check: /[0-9]/.test(formData.password), text: "Number" }
                  ].map((requirement, i) => (
                    <span key={i} className="inline-flex items-center">
                      {requirement.check ? (
                        <RiCheckLine className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <RiCloseLine className="h-3 w-3 text-muted-foreground mr-1" />
                      )}
                      <span className={requirement.check ? "text-green-500" : "text-muted-foreground"}>
                        {requirement.text}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <FormField 
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={updateFormField('confirmPassword')}
          required
          error={validationErrors.confirmPassword}
          autoComplete="new-password"
          aria-invalid={Boolean(validationErrors.confirmPassword)}
          aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
        />

        <LoadingButton
          type="submit"
          className="w-full font-medium"
          isPending={signUp.isPending}
          pendingText="Creating account..."
          defaultText="Create account"
          disabled={!isFormValid || signUp.isPending}
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

      {/* Sign in link */}
      <div className="text-center text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onModeChange(AuthMode.LOGIN)}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 font-medium"
        >
          Sign in
        </button>
      </div>
      
      {/* For debugging/testing - shows the current date and user info passed as props */}
      <div className="text-xs text-muted-foreground/50 text-center">
        <p className="hidden">{currentDate} - {currentUser}</p>
      </div>
    </div>
  );
}