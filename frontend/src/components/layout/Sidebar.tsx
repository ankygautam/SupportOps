import {
  ClipboardCheck,
  Compass,
  LogOut,
  NotebookTabs,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { appFeatureFlags } from "@/app/config/features";
import { Button } from "@/components/forms/Button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/cn";
import { navigationRoutes } from "@/routes/routeConfig";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const visibleRoutes = navigationRoutes.filter((item) => !item.allowedRoles || (user?.roleKey && item.allowedRoles.includes(user.roleKey)));

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-slate-950 px-5 py-6 text-slate-100 shadow-2xl transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              SupportOps
            </div>
            <p className="mt-3 text-xl font-semibold tracking-tight text-white">Operations Command</p>
            <p className="mt-1 text-sm text-slate-400">Enterprise support workspace</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-sm border-slate-800 bg-slate-950 text-slate-300 shadow-none lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active Workspace</p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">North America Queue</p>
              <p className="text-sm text-slate-400">Shift handoff at 15:00</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        <nav className="space-y-1.5">
          {visibleRoutes.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-white text-slate-950 shadow-soft"
                      : "text-slate-300 hover:bg-slate-900/90 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-5 w-5", isActive ? "text-sky-600" : "text-slate-500 group-hover:text-slate-200")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {appFeatureFlags.demoExperience ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Showcase</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Guided demo", to: "/demo", icon: Compass },
                { label: "Launch checklist", to: "/launch-checklist", icon: ClipboardCheck },
                { label: "Project overview", to: "/about", icon: NotebookTabs },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-slate-500 transition group-hover:text-sky-300" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-sm font-semibold text-white">SLA Review</p>
                <p className="mt-1 text-sm text-slate-400">3 breaches need approval before shift close.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-sm font-semibold text-white">Incident Briefing</p>
                <p className="mt-1 text-sm text-slate-400">Critical API latency update in 12 minutes.</p>
              </div>
            </div>
          </div>

          {user ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sm font-bold text-sky-300">
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                  <p className="truncate text-sm text-slate-400">{user.role}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current team</p>
                <p className="mt-2 text-sm font-semibold text-white">{user.team}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-4 w-full border-slate-700 bg-slate-950 text-slate-100 hover:border-slate-600 hover:bg-slate-900 hover:text-white"
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
