import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  supportingText: string;
  className?: string;
}

export function StatCard({ label, value, delta, trend, supportingText, className }: StatCardProps) {
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendClass = trend === "up" ? "text-emerald-600 bg-emerald-50" : "text-sky-700 bg-sky-50";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("panel panel-hover p-5", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-helper text-sm font-medium">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold", trendClass)}>
          <Icon className="h-4 w-4" />
          {delta}
        </div>
      </div>
      <p className="section-helper mt-5">{supportingText}</p>
    </motion.div>
  );
}
