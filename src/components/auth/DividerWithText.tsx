export interface DividerWithTextProps {
    text: string;
  }
  
  /**
   * Divider line with centered text
   */
  export function DividerWithText({ text }: DividerWithTextProps) {
    return (
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
  }