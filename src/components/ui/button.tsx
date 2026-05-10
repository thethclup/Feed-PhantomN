import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "ghost" | "phantom" | "danger"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      default: "bg-phantom-accent text-white hover:bg-phantom-accent/80 border border-phantom-accent/50 shadow-[0_0_10px_rgba(176,38,255,0.4)]",
      ghost: "bg-transparent text-white hover:bg-white/10",
      phantom: "bg-transparent text-phantom-cyan border border-phantom-cyan/50 hover:bg-phantom-cyan/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]",
      danger: "bg-phantom-danger text-white hover:bg-phantom-danger/80 shadow-[0_0_10px_rgba(255,42,42,0.4)]",
    }
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
