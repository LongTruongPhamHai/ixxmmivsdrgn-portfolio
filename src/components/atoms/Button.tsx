import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "bg-bg-elevated text-text-primary border border-border-default hover:border-border-active hover:text-accent-amber h-9 px-4 py-2 group",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="mr-2 text-accent-lime group-hover:animate-pulse">{'>'}</span>
        {children}
        <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:animate-pulse inline-block w-1.5 h-4 bg-accent-amber align-middle"></span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
