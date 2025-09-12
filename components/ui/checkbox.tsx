"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group peer h-6 w-6 shrink-0 rounded-md border-2 border-primary/50 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      "transition-all duration-300 ease-in-out",
      // 3D effect
      "shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),_0_2px_4px_rgba(0,0,0,0.5)]",
      "hover:border-primary",
      "data-[state=checked]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),_0_0_10px_var(--primary)]"
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-5 w-5 text-primary-foreground transition-transform duration-300 ease-out group-data-[state=checked]:scale-110" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox }
