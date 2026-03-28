import { SummaryStatCard } from "@/components/ui/SummaryStatCard";

interface IncidentsStatsRowProps {
  active: number;
  critical: number;
  monitoring: number;
  resolvedToday: number;
  loading?: boolean;
}

export function IncidentsStatsRow({ active, critical, monitoring, resolvedToday, loading }: IncidentsStatsRowProps) {
  const cards = [
    { label: "Active Incidents", value: active, note: "Open reliability work", accent: "from-slate-950 to-slate-800" },
    { label: "Critical", value: critical, note: "Highest customer impact", accent: "from-rose-600 to-rose-500" },
    { label: "Monitoring", value: monitoring, note: "Post-mitigation watch", accent: "from-amber-500 to-amber-400" },
    { label: "Resolved Today", value: resolvedToday, note: "Closed since midnight", accent: "from-emerald-600 to-emerald-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <SummaryStatCard
          key={card.label}
          label={card.label}
          value={loading ? "..." : card.value}
          note={card.note}
          accent={card.accent}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
