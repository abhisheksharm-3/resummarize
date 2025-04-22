'use client';

import { useState } from 'react';
import { useResetPassword } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AuthMode } from '@/types/auth';

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export default function ResetPasswordForm({ onModeChange }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const resetPassword = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    resetPassword.mutate(email, {
      onSuccess: (data) => {
        if (!data.error) {
          setSuccess(true);
        }
      }
    });
  };

  if (success) {
    return (
      <div className="space-y-6 py-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-center text-muted-foreground text-sm max-w-xs">
            We&apos;ve sent a password reset link to {email}
          </p>
        </div>

        <Button
          type="button"
          className="w-full font-medium"
          onClick={() => onModeChange(AuthMode.LOGIN)}
        >
          Back to sign in
        </Button>
      </div>
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
        <Alert variant="destructive" className="text-sm">
          <AlertDescription>
            {resetPassword.error.message || 'Failed to send reset link. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full font-medium"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => onModeChange(AuthMode.LOGIN)}
          className="text-primary hover:text-primary/90 transition-colors font-medium"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}