import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { showcaseQuickLinks } from "@/data/demoData";

interface ShowcaseBannerProps {
  onOpenGuide: () => void;
  onDismiss: () => void;
}

export function ShowcaseBanner({ onOpenGuide, onDismiss }: ShowcaseBannerProps) {
  return (
    <div className="mb-6 rounded-[28px] border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-slate-50 px-5 py-5 shadow-soft">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Demo Highlights</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Explore tickets, incidents, SLA monitoring, analytics, and role-based workflows in this guided demo environment.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {showcaseQuickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenGuide}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open showcase guide
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            aria-label="Dismiss showcase banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
