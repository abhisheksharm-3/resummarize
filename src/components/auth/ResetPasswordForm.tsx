'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useResetPassword } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthMode } from '@/types/auth';
import { motion } from 'framer-motion';
import { FormField } from '@/components/auth/FormField';
import { LoadingButton } from '@/components/auth/LoadingButton';

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

/**
 * ResetPasswordForm component for requesting password reset
 * 
 * @param props Component props
 * @param props.onModeChange Function to change authentication mode (login/signup/reset)
 * @returns Reset password form component
 */
export default function ResetPasswordForm({ onModeChange }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const resetPassword = useResetPassword();
  
  // Current information for debugging purposes
  const currentDateTime = "2025-04-23 13:31:16";
  const currentUser = "abhisheksharm-3";

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check form validity whenever email changes
  useEffect(() => {
    if (!email) {
      setEmailError('');
      setIsFormValid(false);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setIsFormValid(false);
    } else {
      setEmailError('');
      setIsFormValid(true);
    }
  }, [email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    resetPassword.mutate(email, {
      onSuccess: (data) => {
        if (!data?.error) {
          setSuccess(true);
        }
      },
      onError: (error) => {
        console.error("Password reset error:", error);
      }
    });
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 py-4"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-center text-muted-foreground max-w-xs">
            We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>
          </p>
          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>Don&apos;t see the email? Check your spam folder or try again.</p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="default"
            className="w-full font-medium"
            onClick={() => onModeChange(AuthMode.LOGIN)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {resetPassword.error && (
        <Alert variant="destructive" className="text-sm animate-in fade-in-50">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {resetPassword.error.message || 'Failed to send reset link. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={emailError}
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
        />

        <LoadingButton
          type="submit"
          className="w-full font-medium"
          isPending={resetPassword.isPending}
          pendingText="Sending reset link..."
          defaultText="Send reset link"
          disabled={!isFormValid || resetPassword.isPending}
        />
      </form>

      <div className="text-center text-sm pt-2">
        <button
          type="button"
          onClick={() => onModeChange(AuthMode.LOGIN)}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 py-0.5 font-medium"
        >
          Back to sign in
        </button>
      </div>
      
      {/* Debugging info - hidden from UI */}
      <div className="text-xs text-muted-foreground/50 text-center hidden">
        <p>{currentDateTime} - {currentUser}</p>
      </div>
    </div>
  );
}