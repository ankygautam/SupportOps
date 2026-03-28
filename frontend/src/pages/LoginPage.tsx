import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, TimerReset, Waves } from "lucide-react";
import { ApiStatusNotice } from "@/components/ui/ApiStatusNotice";
import { demoAccounts, defaultDemoAccount } from "@/data/authData";
import { useAuth } from "@/contexts/AuthContext";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Incident-ready",
    copy: "Escalations, bridges, executive updates, and service impact managed from one workspace.",
  },
  {
    icon: TimerReset,
    title: "SLA aware",
    copy: "Queue urgency stays visible so leads can intervene before commitments breach.",
  },
  {
    icon: Waves,
    title: "Operational context",
    copy: "Customer history, ownership, and service signals stay attached to every case.",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const preferredLandingPage = typeof window !== "undefined" ? window.localStorage.getItem("supportops:landing-page") : null;
  const redirectTo = (location.state as { from?: string } | null)?.from ?? preferredLandingPage ?? "/dashboard";
  const [email, setEmail] = useState(defaultDemoAccount.email);
  const [password, setPassword] = useState(defaultDemoAccount.password);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const authFeedback = window.localStorage.getItem("supportops:auth-feedback");
    if (!authFeedback) {
      return;
    }

    setNotice(authFeedback);
    window.localStorage.removeItem("supportops:auth-feedback");
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");

    const result = await signIn({ email, password, remember });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  function applyDemoRole(accountId: string) {
    const account = demoAccounts.find((item) => item.id === accountId);
    if (!account) {
      return;
    }

    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-8 shadow-2xl lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.55),transparent_34%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                SupportOps
              </div>
              <h1 className="mt-8 max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Run support operations with the clarity of a control room.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Coordinate tickets, incidents, customers, and SLA commitments from one premium internal workspace built
                for high-pressure support teams.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition hover:text-white"
                >
                  Open guided demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  About the project
                </Link>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Live Workspace Snapshot</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Open queue", value: "42" },
                    { label: "Critical incidents", value: "2" },
                    { label: "Breaches pending review", value: "3" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4">
                      <p className="text-2xl font-bold tracking-tight text-white">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featureCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="inline-flex rounded-2xl bg-white/10 p-3">
                      <Icon className="h-5 w-5 text-sky-200" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl lg:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Secure Sign In</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to explore a premium full-stack support workspace with realistic ticketing, incident response, analytics, and team operations.
              </p>
            </div>

            <div className="mb-6">
              <ApiStatusNotice />
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => applyDemoRole(account.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    email === account.email
                      ? "border-sky-300 bg-sky-50 shadow-soft"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{account.roleLabel}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{account.description}</p>
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="field-label">Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setNotice("");
                  }}
                  className={error ? "field-input border-rose-300 bg-rose-50/60" : "field-input"}
                />
              </label>

              <label className="block">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                    setNotice("");
                  }}
                  className={error ? "field-input border-rose-300 bg-rose-50/60" : "field-input"}
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-sky-700 transition hover:text-sky-800">
                  Forgot password?
                </Link>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
              ) : null}
              {!error && notice ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">{notice}</div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Signing in..." : "Sign in to SupportOps"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Demo Access</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Use any listed role with password `supportops`</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">JWT Auth</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                After sign-in you&apos;ll receive a demo JWT-backed session and be routed into the protected workspace.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
