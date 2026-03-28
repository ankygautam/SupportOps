import { SummaryStatCard } from "@/components/cards/SummaryStatCard";

interface TicketsStatsRowProps {
  allTickets: number;
  openTickets: number;
  waitingOnCustomer: number;
  criticalTickets: number;
  loading?: boolean;
}

export function TicketsStatsRow(props: TicketsStatsRowProps) {
  const stats = [
    { label: "All Tickets", value: props.allTickets, accent: "from-slate-950 to-slate-800", note: "Queue total" },
    { label: "Open", value: props.openTickets, accent: "from-sky-600 to-sky-500", note: "Active cases" },
    {
      label: "Waiting on Customer",
      value: props.waitingOnCustomer,
      accent: "from-violet-600 to-violet-500",
      note: "Awaiting reply",
    },
    { label: "Critical", value: props.criticalTickets, accent: "from-rose-600 to-rose-500", note: "Escalation watch" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <SummaryStatCard
          key={stat.label}
          label={stat.label}
          value={props.loading ? "..." : stat.value}
          note={stat.note}
          accent={stat.accent}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
