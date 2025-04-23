import { ChangeEvent, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  rightElement?: ReactNode;
  autoComplete?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

/**
 * Reusable form field component with label and error handling
 */
export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  rightElement = null,
  autoComplete,
  ...props
}: FormFieldProps) {
  return (
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
        autoComplete={autoComplete}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}