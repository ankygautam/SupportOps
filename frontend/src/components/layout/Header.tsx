import { Eye, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/forms/Button";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { routeHeaderCopy } from "@/routes/routeConfig";

interface HeaderProps {
  onOpenNavigation: () => void;
  showcaseAvailable: boolean;
  showcaseMode: boolean;
  onOpenShowcaseGuide: () => void;
  onToggleShowcaseMode: () => void;
}

export function Header({ onOpenNavigation, showcaseAvailable, showcaseMode, onOpenShowcaseGuide, onToggleShowcaseMode }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const headerCopy =
    location.pathname.startsWith("/tickets/")
      ? {
          title: "Ticket Detail",
          subtitle: "Review customer history, SLA risk, and support context for the selected case.",
        }
      : (routeHeaderCopy[location.pathname] ?? {
          title: "SupportOps",
          subtitle: "Support operations workspace",
        });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenNavigation}
            className="icon-btn icon-btn-sm mt-1 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="section-title">{headerCopy.title}</p>
            <p className="section-helper mt-1">{headerCopy.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="filter-search min-w-[250px] shadow-soft">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, customers, or incidents"
              className="w-full border-none bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>
          {showcaseAvailable ? (
            <div className="hidden items-center gap-2 rounded-3xl border border-slate-200 bg-white px-2 py-2 shadow-soft xl:flex">
              <Button type="button" variant={showcaseMode ? "ghost" : "secondary"} size="sm" onClick={onOpenShowcaseGuide}>
                <Eye className="h-4 w-4" />
                {showcaseMode ? "Showcase guide" : "Open showcase"}
              </Button>
              <button
                type="button"
                onClick={onToggleShowcaseMode}
                className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  showcaseMode
                    ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {showcaseMode ? "Mode on" : "Mode off"}
              </button>
            </div>
          ) : null}
          <NotificationBell />
          {user ? (
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sm font-bold text-sky-700">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {user.role} • {user.team}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
                className="icon-btn icon-btn-sm"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
