import { ArrowRight, Layers3, LockKeyhole, ServerCog, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Problem it solves",
    copy: "SupportOps brings together ticket handling, incident coordination, SLA visibility, customer context, and staffing into one operational workspace.",
  },
  {
    icon: Layers3,
    title: "Who it is for",
    copy: "Support agents, team leads, and operations admins who need a serious internal tool for managing support work at speed.",
  },
  {
    icon: Sparkles,
    title: "Product focus",
    copy: "The project emphasizes realistic workflow depth, role-aware behavior, and a premium internal-SaaS presentation instead of generic admin-template patterns.",
  },
];

export function AboutProjectPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-8 shadow-2xl lg:p-12">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              Project Info
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">SupportOps is a full-stack support operations platform built to feel like a real internal SaaS product.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              The goal was to design and build a polished product that could realistically support customer issue handling,
              incidents, SLA management, staffing, and operational reporting without collapsing into a toy dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Open demo entry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Go to login
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="inline-flex rounded-2xl bg-white/10 p-3">
                  <Icon className="h-5 w-5 text-sky-200" />
                </div>
                <p className="mt-4 text-lg font-semibold">{pillar.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.copy}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Architecture Summary</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                <p className="text-sm font-semibold text-white">Frontend stack</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">React, TypeScript, Tailwind CSS, React Router, Framer Motion, typed API services, role-aware routing, and a premium dashboard-oriented component system.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                <p className="text-sm font-semibold text-white">Backend stack</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">Spring Boot, Spring Security, JPA, PostgreSQL, JWT authentication, seeded demo data, layered services, and DTO-driven APIs for frontend integration.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                <p className="text-sm font-semibold text-white">Authentication and security</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">JWT-based login, protected routes, role-aware backend authorization, BCrypt password encoding, and seeded demo roles for guided exploration.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                <p className="text-sm font-semibold text-white">Design decisions</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">The UI favors a premium internal-tool feel: strong hierarchy, rounded cards, professional tables, subtle motion, and believable operational density.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Main Features</p>
            <div className="mt-6 space-y-4">
              {[
                "Tickets with escalation, reassignment, resolution notes, reopen flow, comments, and mixed activity history",
                "Incidents linked to tickets with customer impact context",
                "SLA monitoring with operational urgency states",
                "Analytics for leadership review and team operations",
                "Team management for staffing and role updates",
                "In-app notifications and API-backed user preferences",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-7 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Challenge",
              copy: "Most support demos stop at dashboards. SupportOps was built to show the harder part: believable workflows, role-aware decisions, and operational density that still feels usable.",
            },
            {
              title: "Solution",
              copy: "The app combines tickets, incidents, SLA monitoring, customers, analytics, team administration, and guided demo layers on top of a typed frontend and secured Spring backend.",
            },
            {
              title: "What this demonstrates",
              copy: "Product thinking, full-stack architecture, JWT authentication, workflow design, backend modeling, and the ability to present a serious internal tool clearly.",
            },
          ].map((item) => (
            <section key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.copy}</p>
            </section>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <ServerCog className="h-5 w-5 text-sky-200" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Product Perspective</p>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              From a product standpoint, the focus was on operational realism: believable data relationships, support-friendly
              workflows, role clarity, queue pressure visibility, and UI copy that sounds like a real SaaS platform instead of placeholder admin language.
            </p>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-sky-200" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Future Improvements</p>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Natural next steps include database migrations, richer audit/event models, frontend component tests, live updates,
              attachments, stronger analytics visualizations, and deployment automation for production-style environments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
