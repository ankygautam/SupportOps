import type { ReactNode } from "react";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { cn } from "@/utils/cn";

interface TableWrapperProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function TableWrapper({ title, description, children, emptyState, loading, className }: TableWrapperProps) {
  return (
    <div className={cn("panel overflow-hidden", className)}>
      {title || description ? (
        <div className="border-b border-slate-200/70 px-6 py-5">
          {title ? <p className="section-title">{title}</p> : null}
          {description ? <p className="section-helper mt-1">{description}</p> : null}
        </div>
      ) : null}
      {loading ? (
        <div className="space-y-4 px-6 py-5">
          <SkeletonBlock className="h-4 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50/70 px-4 py-4 lg:grid-cols-8">
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <SkeletonBlock key={cellIndex} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : children ? (
        children
      ) : (
        <div className="p-6">{emptyState}</div>
      )}
    </div>
  );
}
