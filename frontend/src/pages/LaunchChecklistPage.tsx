import { CheckCircle2, ExternalLink, Globe, Layers3, LockKeyhole, MonitorSmartphone, Rocket, ServerCog, ShieldCheck, TabletSmartphone, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { demoAccounts } from "@/data/authData";

const readinessSections = [
  {
    title: "Configuration",
    icon: Globe,
    items: [
      "Frontend environment variables documented with `VITE_API_URL` for deployed API connectivity.",
      "Backend environment variables documented for PostgreSQL, JWT secret, frontend origin, and profile selection.",
      "Demo mode and production-style profiles are separated so launch behavior stays intentional.",
    ],
  },
  {
    title: "Build And Runtime",
    icon: Rocket,
    items: [
      "Frontend production build verified, route splitting enabled, and static deployment ready for GitHub Pages.",
      "Backend compile and test flows verified through Maven with deploy-friendly configuration.",
      "Protected routing, token restore, and session-expiry handling are part of the normal app shell.",
    ],
  },
  {
    title: "Security And Access",
    icon: LockKeyhole,
    items: [
      "JWT login, `/api/auth/me`, and route protection verified across Admin, Team Lead, and Support Agent roles.",
      "Role-aware access rules limit incidents, analytics, team management, and SLA tooling appropriately.",
      "Seeded demo credentials are aligned across backend seed data, README docs, and in-app demo guidance.",
    ],
  },
  {
    title: "Product Coverage",
    icon: Layers3,
    items: [
      "Dashboard, tickets, ticket detail, incidents, customers, SLA, analytics, team, settings, and docs routes are presentable as standalone screens.",
      "Create, update, comment, escalation, incident, and settings flows provide toast feedback and stable loading/error states.",
      "Demo guidance, showcase mode, and launch-facing docs support both live walkthroughs and async portfolio review.",
    ],
  },
];

const launchChecks = [
  { label: "Environment variables configured", state: "Ready", detail: "Frontend and backend examples match current runtime config." },
  { label: "Frontend build status", state: "Ready", detail: "Lint, tests, and production build verified in the final pass." },
  { label: "Backend build status", state: "Ready", detail: "Compile and Maven test flows complete cleanly after optimization work." },
  { label: "Auth flow verified", state: "Ready", detail: "Login, logout, restore-on-refresh, and unauthorized handling are wired." },
  { label: "Core routes verified", state: "Ready", detail: "All primary product routes render with production-quality layouts." },
  { label: "Role-based flows verified", state: "Ready", detail: "Admin, Team Lead, and Support Agent paths each expose the expected workspace." },
  { label: "Demo accounts verified", state: "Ready", detail: "Seeded credentials and role explanations are aligned in the app and docs." },
  { label: "API connectivity verified", state: "Ready", detail: "Frontend API layer handles auth, retry, and backend-unavailable messaging clearly." },
  { label: "Responsive checks done", state: "Ready", detail: "Shell, forms, filters, and drawers degrade cleanly across desktop and smaller widths." },
  { label: "README and docs completed", state: "Ready", detail: "Setup, deployment, CI, screenshots, and demo instructions are documented." },
];

const walkthroughScreens = [
  "Dashboard overview",
  "Ticket queue with saved views",
  "Ticket detail workflow",
  "Incident command center",
  "SLA monitor",
  "Analytics review",
  "Team management",
];

export function LaunchChecklistPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-8 shadow-2xl lg:p-12">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              Launch Checklist
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">SupportOps launch readiness and showcase confidence at a glance.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              This release checklist summarizes deployment readiness, verified product paths, demo access, and presentation quality so the project feels complete before it goes live or into a portfolio review.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/demo" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Open demo entry
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                View project overview
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Readiness Matrix</p>
            </div>
            <div className="mt-5 space-y-3">
              {launchChecks.map((check) => (
                <div key={check.label} className="rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{check.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{check.detail}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                      {check.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-sky-200" />
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Demo Accounts</p>
              </div>
              <div className="mt-5 space-y-3">
                {demoAccounts.map((account) => (
                  <div key={account.id} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{account.roleLabel}</p>
                        <p className="mt-1 text-sm text-slate-300">{account.email}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                        supportops
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{account.accessSummary}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-5 w-5 text-sky-200" />
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Walkthrough Priority</p>
              </div>
              <div className="mt-5 space-y-3">
                {walkthroughScreens.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-6 text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {readinessSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-2xl bg-white/10 p-3">
                    <Icon className="h-5 w-5 text-sky-200" />
                  </div>
                  <p className="text-lg font-semibold text-white">{section.title}</p>
                </div>
                <div className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Wifi,
              title: "API connectivity",
              copy: "Frontend connectivity notices, retry states, and environment docs are already aligned with backend API expectations.",
            },
            {
              icon: TabletSmartphone,
              title: "Responsive review",
              copy: "Primary workflow surfaces are stable on desktop, while the shell, filters, and overlays remain usable on smaller viewports.",
            },
            {
              icon: ServerCog,
              title: "Operational packaging",
              copy: "README docs, CI workflows, GitHub Pages deployment, and demo guidance are all in place for release and portfolio sharing.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <section key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="inline-flex rounded-2xl bg-white/10 p-3">
                  <Icon className="h-5 w-5 text-sky-200" />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.copy}</p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
