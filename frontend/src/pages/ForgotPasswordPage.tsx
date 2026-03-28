import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("maya@supportops.local");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-white">
          <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
            SupportOps
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Recover workspace access</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This mock flow simulates an internal password recovery experience. We&apos;ll confirm the request and return
            you to the secure login screen.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Security note</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Password reset events would normally trigger audit visibility, session review, and identity verification.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Password Recovery</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Reset your password</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your work email and we&apos;ll simulate sending a secure reset link.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="inline-flex rounded-2xl bg-white p-3 shadow-soft">
                <MailCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900">Reset request queued</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A mock reset link was generated for <span className="font-semibold">{email}</span>. In the backend phase,
                this is where secure delivery and token validation would be connected.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to sign in
              </Link>
            </div>
          ) : (
            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Send reset link
              </button>
            </form>
          )}

          {!submitted ? (
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}
