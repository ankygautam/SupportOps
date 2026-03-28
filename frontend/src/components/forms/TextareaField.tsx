import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function TextareaField({ className, hasError, ...props }: TextareaFieldProps) {
  return (
    <textarea
      className={cn(
        "field-textarea",
        hasError && "border-rose-300 bg-rose-50/60 text-slate-900",
        className,
      )}
      {...props}
    />
  );
}
