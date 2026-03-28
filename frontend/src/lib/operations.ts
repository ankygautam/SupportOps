import type { SLARecord } from "@/types/models";
export {
  customerHealthTone,
  incidentSeverityTone,
  incidentStatusTone,
  slaDisplayTone,
} from "@/utils/badges";

export function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function computeSlaPercent(record: SLARecord) {
  return Math.min((record.elapsedMinutes / record.targetMinutes) * 100, 100);
}
