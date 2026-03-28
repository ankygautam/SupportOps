import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { RequireAuth, RequireRole } from "@/components/auth/RouteGuards";
import { renderWithProviders } from "@/test/utils";

const authState = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  hasRole: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

describe("Route guards", () => {
  it("redirects unauthenticated users to login", () => {
    authState.isAuthenticated = false;
    authState.isLoading = false;

    renderWithProviders(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/tickets" element={<div>Protected tickets</div>} />
        </Route>
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>,
      "/tickets",
    );

    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });

  it("redirects authenticated users without the required role back to the dashboard", () => {
    authState.isAuthenticated = true;
    authState.isLoading = false;
    authState.hasRole.mockReturnValue(false);

    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<div>Dashboard screen</div>} />
        <Route
          path="/analytics"
          element={
            <RequireRole allowedRoles={["ADMIN", "TEAM_LEAD"]}>
              <div>Analytics screen</div>
            </RequireRole>
          }
        />
      </Routes>,
      "/analytics",
    );

    expect(screen.getByText("Dashboard screen")).toBeInTheDocument();
  });
});
