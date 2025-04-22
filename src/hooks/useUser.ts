'use client';

import { getCurrentUser, resetPassword, signIn, signInWithGoogle, signOut, signUp, updatePassword } from '@/controllers/AuthControllers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getCurrentUser(),
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['user'], data.user);
        router.push('/dashboard');
      }
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['user'], data.user);
        router.push('/dashboard');
      }
    },
  });
}

export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: () => signInWithGoogle(),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.clear();
      router.push('/');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => resetPassword(email),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => updatePassword(password),
  });
}