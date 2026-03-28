import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  fullWidth?: boolean;
}

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
} as const;

const sizeClasses = {
  sm: "btn-sm",
  md: "btn-md",
} as const;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-base",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
