import { Button } from '@/components/ui/button';
import { LoadingButtonProps } from '@/types/auth';
import { RiLoader2Fill } from '@remixicon/react';

/**
 * Button component with loading state
 */
export function LoadingButton({
  isPending,
  pendingText,
  defaultText,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button 
      disabled={isPending || props.disabled} 
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
}