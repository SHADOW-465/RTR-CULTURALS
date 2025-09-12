import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border-0 bg-black/30 px-4 py-2 text-base ring-offset-background",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-300 ease-in-out",
          // Inset glass effect
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.1)]",
          "focus-visible:bg-black/40 focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2),_0_0_10px_var(--secondary)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input }
