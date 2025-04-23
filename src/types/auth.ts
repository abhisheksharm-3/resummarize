import { AuthError, Session, User } from "@supabase/supabase-js";
import { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react";

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }

  export enum AuthMode {
    LOGIN = 'login',
    SIGNUP = 'signup',
    RESET = 'reset'
  }

  export interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    rightElement?: ReactNode;
  }
  export interface SignupFormFieldProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }
  export interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isPending: boolean;
    pendingText: string;
    defaultText: string;
    className?: string;
    disabled?: boolean;
  }
  export interface SignupFormProps {
    onModeChange: (mode: AuthMode) => void;
  }
  export interface DividerWithTextProps {
    text: string;
  }
  
  export interface FormData {
    email: string;
    password: string;
  }

  export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
  }