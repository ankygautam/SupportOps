import { motion } from "framer-motion";
import { ArrowUpRight, Siren, UserRound, Timer } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ActivityLog } from "@/types/models";

const iconMap = {
  Ticket: ArrowUpRight,
  Incident: Siren,
  SLA: Timer,
  Customer: UserRound,
};

export function ActivityFeed({ items }: { items: ActivityLog[] }) {
  return (
    <div className="panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Recent Activity</p>
          <p className="mt-1 text-sm text-slate-500">Live queue and incident updates from the last hour.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
      </div>
      <div className="space-y-4">
        {items.length ? items.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex gap-4 rounded-2xl border border-slate-100 px-3 py-3 transition hover:border-slate-200 hover:bg-slate-50/80"
            >
              <div className="mt-1 rounded-2xl bg-slate-100 p-2 text-slate-700">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <span className="whitespace-nowrap text-xs text-slate-400">{activity.occurredAt}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{activity.description}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{activity.actor}</p>
              </div>
            </motion.div>
          );
        }) : <EmptyState title="No recent activity" description="Fresh ticket, customer, and incident changes will appear here." />}
      </div>
    </div>
  );
}
