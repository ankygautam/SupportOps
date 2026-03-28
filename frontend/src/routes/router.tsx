import { Navigate, createHashRouter } from "react-router-dom";
import { RedirectIfAuthenticated, RequireAuth, RequireRole } from "@/components/auth/RouteGuards";
import { AppLayout } from "@/layouts/AppLayout";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { AboutProjectPage } from "@/pages/AboutProjectPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DemoPage } from "@/pages/DemoPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { IncidentsPage } from "@/pages/IncidentsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SlaPage } from "@/pages/SlaPage";
import { TeamPage } from "@/pages/TeamPage";
import { TicketDetailPage } from "@/pages/TicketDetailPage";
import { TicketsPage } from "@/pages/TicketsPage";

function preferredLandingPage() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  return window.localStorage.getItem("supportops:landing-page") ?? "/dashboard";
}

export const router = createHashRouter([
  {
    path: "/demo",
    element: <DemoPage />,
  },
  {
    path: "/about",
    element: <AboutProjectPage />,
  },
  {
    path: "/project-info",
    element: <AboutProjectPage />,
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
        element: <ForgotPasswordPage />,
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
            element: <DashboardPage />,
          },
          {
            path: "tickets",
            element: <TicketsPage />,
          },
          {
            path: "tickets/:id",
            element: <TicketDetailPage />,
          },
          {
            path: "incidents",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                <IncidentsPage />
              </RequireRole>
            ),
          },
          {
            path: "customers",
            element: <CustomersPage />,
          },
          {
            path: "sla",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                <SlaPage />
              </RequireRole>
            ),
          },
          {
            path: "analytics",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                <AnalyticsPage />
              </RequireRole>
            ),
          },
          {
            path: "team",
            element: (
              <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
                <TeamPage />
              </RequireRole>
            ),
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
