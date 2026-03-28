import type { OperationalInsight } from "@/data/analyticsData";
import { Badge } from "@/components/ui/Badge";
import { InfoCard } from "@/components/ui/InfoCard";

interface OperationalInsightsCardProps {
  insights: OperationalInsight[];
}

const toneMap = {
  default: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;

export function OperationalInsightsCard({ insights }: OperationalInsightsCardProps) {
  return (
    <InfoCard title="Recent Operational Insights" description="Notable changes leadership may want to review before the next shift or business update.">
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{insight.description}</p>
              </div>
              <Badge tone={toneMap[insight.tone]}>{insight.tone === "default" ? "Watch" : insight.tone}</Badge>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
