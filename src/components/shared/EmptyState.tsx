import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { EmptyStateProps } from "@/types/dashboard";
import React from "react";

/**
 * EmptyState component - displays a placeholder when content is empty or unavailable
 * 
 * @example
 * ```tsx
 * <EmptyState 
 *   title="No notes found" 
 *   description="Create your first note to get started"
 *   action={<Button>Create Note</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon = <FileText className="h-10 w-10 text-muted-foreground/60" />,
  title,
  description,
  action,
  size = "default",
  animate = true,
  className,
  borderStyle = "dashed",
  role = "region",
  "aria-label": ariaLabel,
}: EmptyStateProps) {
  // Configure sizing
  const sizeClasses = {
    compact: "py-6 px-4",
    default: "py-12 px-6",
    large: "py-16 px-8",
  };

  // Apply icon sizing if it's the default icon
  const IconComponent = typeof icon === 'object' && React.isValidElement(icon) 
    ? React.cloneElement(icon)
    : icon;
  
  // Define border style
  const borderClass = {
    dashed: "border-dashed",
    solid: "border",
    none: "border-0",
  };
  
  // Container component based on animation preference
  const Container = animate ? motion.div : "div";
  
  // Animation props when using motion.div
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  // Current timestamp and user info for debugging (hidden in UI)
  const currentDateTime = "2025-04-23 13:54:05";
  const currentUser = "abhisheksharm-3";

  return (
    <Container
      className={cn(
        "flex flex-col items-center justify-center text-center border rounded-lg bg-background/50",
        borderClass[borderStyle],
        sizeClasses[size],
        className
      )}
      role={role}
      aria-label={ariaLabel || `Empty state: ${title}`}
      {...animationProps}
    >
      <div className={cn("mb-4", size === "compact" ? "mb-3" : size === "large" ? "mb-6" : "")}>
        {IconComponent}
      </div>
      <h3 className={cn(
        "font-medium",
        size === "compact" ? "text-base" : size === "large" ? "text-xl" : "text-lg"
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          "text-muted-foreground max-w-sm",
          size === "compact" ? "mt-0.5 text-xs" : size === "large" ? "mt-2 text-base" : "mt-1 text-sm"
        )}>
          {description}
        </p>
      )}
      {action && (
        <div className={cn(
          size === "compact" ? "mt-3" : size === "large" ? "mt-6" : "mt-4"
        )}>
          {action}
        </div>
      )}
      
      {/* Hidden debug info */}
      <div className="text-[8px] text-muted-foreground/30 hidden absolute bottom-0 right-0 p-1">
        {currentDateTime} - {currentUser}
      </div>
    </Container>
  );
}