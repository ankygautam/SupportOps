import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, createHashRouter } from "react-router-dom";
import { storageKeys } from "@/app/config/storage";
import { RedirectIfAuthenticated, RequireAuth, RequireRole } from "@/components/auth/RouteGuards";
import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";
import { AppLayout } from "@/layouts/AppLayout";
import { getLocalStorageItem } from "@/lib/browserStorage";
import { LoginPage } from "@/pages/LoginPage";

const AboutProjectPage = lazy(() => import("@/pages/AboutProjectPage").then((module) => ({ default: module.AboutProjectPage })));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));
const CustomersPage = lazy(() => import("@/pages/CustomersPage").then((module) => ({ default: module.CustomersPage })));
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const DemoPage = lazy(() => import("@/pages/DemoPage").then((module) => ({ default: module.DemoPage })));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage })));
const IncidentsPage = lazy(() => import("@/pages/IncidentsPage").then((module) => ({ default: module.IncidentsPage })));
const LaunchChecklistPage = lazy(() => import("@/pages/LaunchChecklistPage").then((module) => ({ default: module.LaunchChecklistPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const SlaPage = lazy(() => import("@/pages/SlaPage").then((module) => ({ default: module.SlaPage })));
const TeamPage = lazy(() => import("@/pages/TeamPage").then((module) => ({ default: module.TeamPage })));
const TicketDetailPage = lazy(() => import("@/pages/TicketDetailPage").then((module) => ({ default: module.TicketDetailPage })));
const TicketsPage = lazy(() => import("@/pages/TicketsPage").then((module) => ({ default: module.TicketsPage })));

function suspensePage(element: ReactNode) {
  return <Suspense fallback={<RouteLoadingScreen />}>{element}</Suspense>;
}

function preferredLandingPage() {
  return getLocalStorageItem(storageKeys.landingPage) ?? "/dashboard";
}

export const router = createHashRouter([
  {
    path: "/demo",
    element: suspensePage(<DemoPage />),
  },
  {
    path: "/about",
    element: suspensePage(<AboutProjectPage />),
  },
  {
    path: "/project-info",
    element: suspensePage(<AboutProjectPage />),
  },
  {
    path: "/launch-checklist",
    element: suspensePage(<LaunchChecklistPage />),
  },
  {
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: suspensePage(<ForgotPasswordPage />),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={preferredLandingPage()} replace />,
          },
          {
            path: "dashboard",
            element: suspensePage(<DashboardPage />),
          },
          {
            path: "tickets",
            element: suspensePage(<TicketsPage />),
          },
          {
            path: "tickets/:id",
            element: suspensePage(<TicketDetailPage />),
          },
          {
            path: "incidents",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                {suspensePage(<IncidentsPage />)}
              </RequireRole>
            ),
          },
          {
            path: "customers",
            element: suspensePage(<CustomersPage />),
          },
          {
            path: "sla",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                {suspensePage(<SlaPage />)}
              </RequireRole>
            ),
          },
          {
            path: "analytics",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                {suspensePage(<AnalyticsPage />)}
              </RequireRole>
            ),
          },
          {
            path: "team",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                {suspensePage(<TeamPage />)}
              </RequireRole>
            ),
          },
          {
            path: "settings",
            element: suspensePage(<SettingsPage />),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: suspensePage(<NotFoundPage />),
  },
]);
