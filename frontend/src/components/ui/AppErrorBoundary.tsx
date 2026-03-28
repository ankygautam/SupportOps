import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

const shouldLogFrontendErrors = import.meta.env.DEV;

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (shouldLogFrontendErrors) {
      console.error("SupportOps frontend error boundary caught an error", error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
            <AlertTriangle className="h-8 w-8 text-sky-200" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Application recovery</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">SupportOps hit an unexpected frontend error.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Refresh the workspace to recover. If this happens repeatedly, verify the deployed frontend and backend are
            running the same API contract.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload SupportOps
          </button>
        </div>
      </div>
    );
  }
}
