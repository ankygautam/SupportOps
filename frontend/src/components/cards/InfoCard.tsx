import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function InfoCard({ title, description, icon, children, className, muted }: InfoCardProps) {
  return (
    <section className={cn(muted ? "panel-muted p-5" : "panel p-6", className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 shadow-soft">{icon}</div> : null}
        <div>
          <p className="section-title">{title}</p>
          {description ? <p className="section-helper mt-1">{description}</p> : null}
        </div>
      </div>
      <div className={cn("mt-5", !icon && !description && "mt-0")}>{children}</div>
    </section>
  );
}
