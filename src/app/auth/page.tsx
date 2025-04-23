'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Navbar } from '@/components/layout/Navbar';
import { useUser } from '@/hooks/useUser';
import { AuthMode } from '@/types/auth';

// Extract the component that uses useSearchParams into a separate component
function AuthContent() {
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useUser();
  
  // Determine initial auth mode from URL parameters
  const initialAuthMode = useMemo(() => {
    const modeParam = searchParams?.get('mode');
    
    switch (modeParam) {
      case 'signup': return AuthMode.SIGNUP;
      case 'reset': return AuthMode.RESET;
      default: return AuthMode.LOGIN;
    }
  }, [searchParams]);
  
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      redirect('/dashboard');
    }
  }, [user, isLoading]);

  // Show loading state during authentication check
  if (isLoading) {
    return <AuthPageSkeleton />;
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-md animate-in fade-in-50 duration-500">
      <CardContent className="p-6 pt-6 md:p-8 md:pt-8">
        {renderAuthForm(authMode, setAuthMode)}
      </CardContent>
    </Card>
  );
}

/**
 * Authentication page component that handles login, signup, and password reset workflows
 * 
 * @description Renders the appropriate authentication form based on the URL query parameter 
 * or user selection. Automatically redirects authenticated users to dashboard.
 * 
 * @returns The authentication page with the appropriate form based on current mode
 */
export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Suspense fallback={<AuthPageSkeleton />}>
          <AuthContent />
        </Suspense>
      </main>
    </div>
  );
}

/**
 * Renders the appropriate authentication form based on current mode
 * 
 * @param mode - Current authentication mode
 * @param onModeChange - Function to change the authentication mode
 * @returns The appropriate form component
 */
function renderAuthForm(mode: AuthMode, onModeChange: (mode: AuthMode) => void) {
  switch (mode) {
    case AuthMode.SIGNUP:
      return <SignupForm onModeChange={onModeChange} />;
    case AuthMode.RESET:
      return <ResetPasswordForm onModeChange={onModeChange} />;
    case AuthMode.LOGIN:
    default:
      return <LoginForm onModeChange={onModeChange} />;
  }
}

/**
 * Skeleton loader displayed while checking authentication status
 * 
 * @returns Skeleton UI for the authentication page using Shadcn Skeleton component
 */
function AuthPageSkeleton() {
  return (
    <Card className="w-full max-w-md border-border/60 shadow-md">
      <CardContent className="p-6 pt-6 md:p-8 md:pt-8 space-y-4">
        {/* Form title skeleton */}
        <Skeleton className="h-8 w-3/4 mx-auto" />
        
        {/* Form fields skeletons */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full mt-6" />
        
        {/* Links skeleton */}
        <div className="pt-4 flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}