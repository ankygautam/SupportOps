import { AlertTriangle, CheckCircle2, TimerReset } from "lucide-react";
import { InfoCard } from "@/components/ui/InfoCard";

interface QueueHealthWidgetProps {
  onTrack: number;
  dueSoon: number;
  breached: number;
}

export function QueueHealthWidget({ onTrack, dueSoon, breached }: QueueHealthWidgetProps) {
  return (
    <InfoCard title="Queue Health" description="Fast read on where intervention is needed across the active support queue.">
      <div className="mt-5 space-y-4">
        <div className="rounded-2xl bg-emerald-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">{onTrack} on track</p>
              <p className="mt-1 text-sm text-emerald-700">Healthy timers still have room before risk increases.</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <TimerReset className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">{dueSoon} due soon</p>
              <p className="mt-1 text-sm text-amber-700">These items need fresh customer updates or rebalancing now.</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-rose-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-semibold text-rose-800">{breached} breached</p>
              <p className="mt-1 text-sm text-rose-700">Immediate review required to close customer and leadership gaps.</p>
            </div>
          </div>
        </div>
      </div>
    </InfoCard>
  );
}
