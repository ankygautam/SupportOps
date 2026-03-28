import { useState } from "react";
import { ArrowRight, CheckCircle2, PlayCircle, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { demoRoleGuides, showcaseQuickLinks } from "@/data/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const demoStoryCards = [
  {
    icon: Ticket,
    title: "Operational depth",
    copy: "Show realistic ticket escalation, SLA pressure, incident linkage, and mixed activity history without leaving the queue.",
  },
  {
    icon: ShieldCheck,
    title: "Role-aware behavior",
    copy: "Move between Admin, Team Lead, and Support Agent perspectives to show how access and workflows adapt by responsibility.",
  },
  {
    icon: Sparkles,
    title: "Portfolio-ready presentation",
    copy: "Use guided entry, showcase prompts, polished seeded data, and screenshot-friendly screens to present the product clearly.",
  },
];

export function DemoPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { pushToast } = useToast();
  const [submittingRole, setSubmittingRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function quickSignIn(email: string, password: string, roleTitle: string) {
    setSubmittingRole(email);
    setError("");
    const result = await signIn({ email, password, remember: true });
    setSubmittingRole(null);

    if (!result.ok) {
      setError(result.error);
      pushToast({ tone: "error", title: "Demo sign-in failed", description: result.error });
      return;
    }

    pushToast({ tone: "success", title: `${roleTitle} demo ready`, description: "You’re signed in with a seeded demo account." });
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-8 shadow-2xl lg:p-12">
          <div className="max-w-5xl">
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              Guided Demo Entry
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Explore SupportOps through realistic support, reliability, and operations workflows.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              SupportOps is built for support organizations managing customer issues, incidents, SLA deadlines, staffing, and operational reporting.
              Choose a demo role below to jump into the product with a presentation-friendly path.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                About the project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Go to login
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {demoStoryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="inline-flex rounded-2xl bg-white/10 p-3">
                      <Icon className="h-5 w-5 text-sky-200" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">{card.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{card.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          {demoRoleGuides.map((guide) => (
            <div key={guide.role} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{guide.title}</p>
                  <p className="mt-1 text-sm text-sky-200">{guide.subtitle}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <PlayCircle className="h-5 w-5 text-sky-200" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{guide.summary}</p>
              <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/40 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How to explore this role</p>
                <div className="mt-3 space-y-3">
                  {guide.checklist.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                <p className="font-semibold">{guide.email}</p>
                <p className="mt-1 text-slate-400">Password: {guide.password}</p>
              </div>
              <button
                type="button"
                onClick={() => quickSignIn(guide.email, guide.password, guide.title)}
                disabled={submittingRole === guide.email}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submittingRole === guide.email ? "Signing in..." : `Enter as ${guide.title}`}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Recommended walkthrough</p>
            <div className="mt-4 space-y-3">
              {[
                "Start on the dashboard to frame queue pressure, incidents, and SLA risk in one view.",
                "Open the ticket queue, use a saved view, and drill into a detailed case to show escalation and collaboration.",
                "Move into incidents, SLA, analytics, or team management based on the role you selected.",
              ].map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm leading-6 text-slate-200">
                  {step}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">Best screens to capture</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {showcaseQuickLinks.map((link) => (
                <span
                  key={link.to}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200"
                >
                  {link.label}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The strongest showcase flow is dashboard, tickets list, ticket detail, incidents, analytics, and team management. Each view is populated with related seeded data so screenshots and walkthroughs feel coherent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
