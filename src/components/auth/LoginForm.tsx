'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useSignIn, useSignInWithGoogle } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiGoogleLine, RiLoader2Fill } from '@remixicon/react';
import { AuthMode, DividerWithTextProps, FormData, FormFieldProps, LoadingButtonProps } from '@/types/auth';

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  rightElement = null,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {rightElement}
    </div>
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

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isPending,
  pendingText,
  defaultText,
  className,
  ...props
}) => (
  <Button 
    disabled={isPending} 
    className={className}
    {...props}
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

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export default function LoginForm({ onModeChange }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const signIn = useSignIn();
  const signInWithGoogle = useSignInWithGoogle();

  const updateFormField = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn.mutate(formData);
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
        <Alert variant="destructive" className="text-sm">
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
        />
        
        <FormField 
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={updateFormField('password')}
          required
          rightElement={
            <button 
              type="button"
              onClick={() => onModeChange(AuthMode.RESET)}
              className="text-xs text-primary hover:text-primary/90 transition-colors font-medium"
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

      {/* Sign up link */}
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => onModeChange(AuthMode.SIGNUP)}
          className="text-primary hover:text-primary/90 transition-colors font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}