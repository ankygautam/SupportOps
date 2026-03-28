import { SummaryStatCard } from "@/components/ui/SummaryStatCard";

interface SlaStatsRowProps {
  onTrack: number;
  dueSoon: number;
  breached: number;
  avgResolutionTime: string;
  loading?: boolean;
}

export function SlaStatsRow({ onTrack, dueSoon, breached, avgResolutionTime, loading }: SlaStatsRowProps) {
  const cards = [
    { label: "On Track", value: onTrack, note: "Healthy commitments", accent: "from-emerald-600 to-emerald-500" },
    { label: "Due Soon", value: dueSoon, note: "Needs action now", accent: "from-amber-500 to-amber-400" },
    { label: "Breached", value: breached, note: "Requires review", accent: "from-rose-600 to-rose-500" },
    { label: "Avg Resolution Time", value: avgResolutionTime, note: "Priority-weighted target", accent: "from-slate-950 to-slate-800" },
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
