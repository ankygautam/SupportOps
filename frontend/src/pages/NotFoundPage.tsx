import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Workspace not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          The route you tried to open does not exist in this SupportOps workspace.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
