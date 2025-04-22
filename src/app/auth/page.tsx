'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Navbar } from '@/components/layout/Navbar';
import { useUser } from '@/hooks/useUser';
import { redirect } from 'next/navigation';
import { AuthMode } from '@/types/auth';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const modeParam = searchParams?.get('mode') || 'login';
  const [authMode, setAuthMode] = useState<AuthMode>(
    modeParam === 'signup' 
      ? AuthMode.SIGNUP 
      : modeParam === 'reset' 
        ? AuthMode.RESET 
        : AuthMode.LOGIN
  );
  
  const { data: user, isLoading } = useUser();
  
  useEffect(() => {
    if (!isLoading && user) {
      redirect('/dashboard');
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md border-border/60 shadow-md animate-in fade-in-50 duration-500">
          <CardContent className="p-6 pt-6 md:p-8 md:pt-8">
            {authMode === AuthMode.LOGIN && <LoginForm onModeChange={setAuthMode} />}
            {authMode === AuthMode.SIGNUP && <SignupForm onModeChange={setAuthMode} />}
            {authMode === AuthMode.RESET && <ResetPasswordForm onModeChange={setAuthMode} />}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}