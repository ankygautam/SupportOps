import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/90",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/90",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/90",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/90",
  info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/90",
  neutral: "bg-slate-900 text-slate-100 ring-1 ring-inset ring-slate-700",
};

export function Badge({ children, tone = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold tracking-wide transition-colors",
        "data-[size=md]:px-3 data-[size=md]:py-1.5 data-[size=md]:text-xs",
        "data-[size=sm]:px-2.5 data-[size=sm]:py-1 data-[size=sm]:text-[11px]",
        toneClasses[tone],
        className,
      )}
      data-size={size}
    >
      {children}
    </span>
  );
}
