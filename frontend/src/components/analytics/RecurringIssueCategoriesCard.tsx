import type { IssueCategoryDatum } from "@/data/analyticsData";
import { InfoCard } from "@/components/ui/InfoCard";

interface RecurringIssueCategoriesCardProps {
  items: IssueCategoryDatum[];
}

export function RecurringIssueCategoriesCard({ items }: RecurringIssueCategoriesCardProps) {
  return (
    <InfoCard title="Top Recurring Issue Categories" description="Repeated support themes driving volume across the queue.">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.category} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.category}</p>
              <p className="mt-1 text-sm text-slate-500">{item.count} related tickets in the selected window</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.toneClass}`}>{item.delta}</span>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
