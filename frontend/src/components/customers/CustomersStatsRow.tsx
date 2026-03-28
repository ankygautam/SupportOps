import { SummaryStatCard } from "@/components/ui/SummaryStatCard";

interface CustomersStatsRowProps {
  totalCustomers: number;
  atRiskAccounts: number;
  enterpriseAccounts: number;
  recentTickets: number;
  loading?: boolean;
}

export function CustomersStatsRow({
  totalCustomers,
  atRiskAccounts,
  enterpriseAccounts,
  recentTickets,
  loading,
}: CustomersStatsRowProps) {
  const cards = [
    { label: "Total Customers", value: totalCustomers, note: "Tracked support records", accent: "from-slate-950 to-slate-800" },
    { label: "At Risk", value: atRiskAccounts, note: "Needs proactive follow-up", accent: "from-rose-600 to-rose-500" },
    { label: "Enterprise", value: enterpriseAccounts, note: "Highest-touch accounts", accent: "from-sky-600 to-sky-500" },
    { label: "Recent Tickets", value: recentTickets, note: "Currently open issues", accent: "from-emerald-600 to-emerald-500" },
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
