import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SnakeBorderCardProps extends React.ComponentProps<typeof Card> {}

const SnakeBorderCard = React.forwardRef<
  HTMLDivElement,
  SnakeBorderCardProps
>(({ className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn("snake-border-card", className)}
      {...props}
    />
  )
})

SnakeBorderCard.displayName = "SnakeBorderCard"

export { SnakeBorderCard }
