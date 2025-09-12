import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_4px_0_0_#8B0000] hover:bg-primary/90 active:shadow-none active:translate-y-1",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_#800000] hover:bg-destructive/90 active:shadow-none active:translate-y-1",
        outline:
          "border-2 border-input bg-transparent shadow-[0_3px_0_0_#444] hover:bg-accent hover:text-accent-foreground active:shadow-none active:translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_#B8860B] hover:bg-secondary/90 active:shadow-none active:translate-y-1",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
