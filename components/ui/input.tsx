import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 ease-in-out",
        "hover:border-white/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
