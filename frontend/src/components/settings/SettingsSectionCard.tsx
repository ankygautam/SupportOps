import type { ReactNode } from "react";
import { InfoCard } from "@/components/ui/InfoCard";

interface SettingsSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function SettingsSectionCard({ title, description, children, actions }: SettingsSectionCardProps) {
  return (
    <InfoCard title={title} description={description}>
      <div className="space-y-4">{children}</div>
      {actions ? <div className="mt-6 flex flex-wrap items-center justify-end gap-3">{actions}</div> : null}
    </InfoCard>
  );
}
