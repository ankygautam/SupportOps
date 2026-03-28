import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiRole } from "@/types/models";

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <SkeletonBlock className="h-20 w-full" />
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <SkeletonBlock className="h-[720px] w-full" />
            <SkeletonBlock className="h-[720px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function RequireRole({ allowedRoles, children }: { allowedRoles: ApiRole[]; children?: ReactNode }) {
  const { isLoading, hasRole } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
