import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function SelectField({ className, hasError, ...props }: SelectFieldProps) {
  return (
    <select
      className={cn(
        "field-select",
        hasError && "border-rose-300 bg-rose-50/60 text-slate-900",
        className,
      )}
      {...props}
    />
  );
}
