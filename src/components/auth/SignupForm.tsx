'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useSignUp, useSignInWithGoogle } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiGoogleLine, RiLoader2Fill } from '@remixicon/react';
import { AuthMode, DividerWithTextProps, LoadingButtonProps, SignupFormData, SignupFormFieldProps } from '@/types/auth';


const FormField: React.FC<SignupFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={type === 'email' ? 'name@example.com' : undefined}
      value={value}
      onChange={onChange}
      className="bg-background"
      required={required}
    />
  </div>
);

// Loading button component
const LoadingButton: React.FC<LoadingButtonProps> = ({
  isPending,
  pendingText,
  defaultText,
  type = 'button',
  className = '',
  disabled = false,
  onClick,
}) => (
  <Button
    type={type}
    className={className}
    disabled={disabled || isPending}
    onClick={onClick}
  >
    {isPending ? (
      <>
        <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
        {pendingText}
      </>
    ) : (
      defaultText
    )}
  </Button>
);

// Divider with text component
const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-border/60" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-2 text-muted-foreground">
        {text}
      </span>
    </div>
  </div>
);

interface SignupFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export default function SignupForm({ onModeChange }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string>('');
  
  const signUp = useSignUp();
  const signInWithGoogle = useSignInWithGoogle();

  const updateFormField = (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validatePassword = (): boolean => {
    setPasswordError('');
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    signUp.mutate({ 
      email: formData.email, 
      password: formData.password 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground text-sm">Sign up to get started with Resummarize</p>
      </div>

      {/* Error alerts */}
      {signUp.error && (
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>
            {signUp.error.message || 'Failed to create account. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
      
      {passwordError && (
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>{passwordError}</AlertDescription>
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
        />
        
        <FormField 
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={updateFormField('password')}
          required
        />

        <FormField 
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={updateFormField('confirmPassword')}
          required
        />

        <LoadingButton
          type="submit"
          className="w-full font-medium"
          isPending={signUp.isPending}
          pendingText="Creating account..."
          defaultText="Create account"
        />
      </form>

      <DividerWithText text="Or continue with" />

      {/* Social login */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 font-medium border-border"
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
          className="text-primary hover:text-primary/90 transition-colors font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}