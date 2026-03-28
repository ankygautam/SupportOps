import type { DistributionDatum } from "@/data/analyticsData";
import { InfoCard } from "@/components/ui/InfoCard";

interface DistributionCardProps {
  title: string;
  description: string;
  items: DistributionDatum[];
}

export function DistributionCard({ title, description, items }: DistributionCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <InfoCard title={title} description={description}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <p className="font-medium text-slate-700">{item.label}</p>
              <div className="flex items-center gap-3">
                <span className="text-slate-900">{item.value}</span>
                <span className="text-slate-500">{Math.round((item.value / total) * 100)}%</span>
              </div>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className={`h-3 rounded-full ${item.toneClass}`} style={{ width: `${(item.value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
