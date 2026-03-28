import { X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { demoRoleGuides, productTourByRoute } from "@/data/demoData";
import { useAuth } from "@/contexts/AuthContext";

interface ProductTourCardProps {
  open: boolean;
  onClose: () => void;
}

export function ProductTourCard({ open, onClose }: ProductTourCardProps) {
  const location = useLocation();
  const { user } = useAuth();

  if (!open) {
    return null;
  }

  const routeKey = location.pathname.startsWith("/tickets/") ? "/tickets/:id" : location.pathname;
  const routeGuide = productTourByRoute[routeKey] ?? productTourByRoute["/dashboard"];
  const roleGuide = demoRoleGuides.find((guide) => guide.role === user?.roleKey) ?? demoRoleGuides[0];

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden w-[360px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_64px_rgba(15,23,42,0.16)] xl:block">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Showcase guide</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{routeGuide.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{routeGuide.description}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          aria-label="Close showcase guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {routeGuide.bullets.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-slate-100 bg-sky-50/60 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{roleGuide.title} demo checklist</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {roleGuide.checklist.slice(0, 3).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
