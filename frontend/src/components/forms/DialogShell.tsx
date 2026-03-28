import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  maxWidthClass?: string;
}

export function DialogShell({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
  maxWidthClass = "max-w-4xl",
}: DialogShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className={cn("dialog-shell overflow-hidden", maxWidthClass)}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
            <p className="section-helper mt-2">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto">{children}</div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/70 px-6 py-5 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  );
}
