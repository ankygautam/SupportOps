import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function TextInput({ className, hasError, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "field-input",
        hasError && "border-rose-300 bg-rose-50/60 text-slate-900",
        className,
      )}
      {...props}
    />
  );
}
