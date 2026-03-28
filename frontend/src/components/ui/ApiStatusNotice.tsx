import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { getHealthStatus } from "@/api";

interface ApiStatusNoticeProps {
  compact?: boolean;
}

export function ApiStatusNotice({ compact = false }: ApiStatusNoticeProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    getHealthStatus()
      .then(() => {
        if (active) {
          setMessage("");
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        const fallback = error instanceof Error ? error.message : "SupportOps could not reach the backend API.";
        setMessage(fallback);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-3xl border border-amber-200 bg-amber-50 text-amber-900 shadow-soft ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white/80 p-2">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">API connection needs attention</p>
          <p className="mt-1 text-sm leading-6 text-amber-900/80">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-900 transition hover:bg-amber-100"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    </div>
  );
}
