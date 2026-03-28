import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title?: string;
  headerMeta?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}

const widthClasses = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
} as const;

export function DetailPanel({
  open,
  onClose,
  eyebrow,
  title,
  headerMeta,
  children,
  size = "lg",
}: DetailPanelProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300",
          widthClasses[size],
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {(eyebrow || title || headerMeta) && (
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-5">
            <div>
              {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">{eyebrow}</p> : null}
              {title ? <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{title}</h2> : null}
              {headerMeta ? <div className="mt-3 flex flex-wrap items-center gap-2">{headerMeta}</div> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </>
  );
}
