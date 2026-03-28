import { motion } from "framer-motion";

interface SummaryStatCardProps {
  label: string;
  value: string | number;
  note: string;
  accent: string;
  delay?: number;
}

export function SummaryStatCard({ label, value, note, accent, delay = 0 }: SummaryStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22, ease: "easeOut" }}
      className="panel panel-hover overflow-hidden p-0"
    >
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <p className="section-label">{label}</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="max-w-[12rem] text-right text-sm leading-5 text-slate-500">{note}</p>
        </div>
      </div>
    </motion.div>
  );
}
