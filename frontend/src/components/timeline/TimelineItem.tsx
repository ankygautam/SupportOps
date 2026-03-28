import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface TimelineItemProps {
  title: string;
  description: string;
  actor?: string;
  occurredAt: string;
  icon?: ReactNode;
  className?: string;
}

export function TimelineItem({ title, description, actor, occurredAt, icon, className }: TimelineItemProps) {
  return (
    <div className={cn("relative pl-8", className)}>
      <div className="absolute left-3 top-0 h-full w-px bg-slate-200" />
      <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-soft">
        {icon ?? <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 transition duration-200 hover:border-slate-200 hover:bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            {actor ? <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">{actor}</p> : null}
          </div>
          <p className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-400">{occurredAt}</p>
        </div>
      </div>
    </div>
  );
}
