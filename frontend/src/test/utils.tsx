import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/contexts/ToastContext";

interface RenderRouteOptions {
  path?: string;
  route?: string;
}

export function renderWithProviders(ui: ReactElement, route = "/") {
  return render(
    <ToastProvider>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </ToastProvider>,
  );
}

export function renderRoute(ui: ReactElement, options: RenderRouteOptions = {}) {
  const { path = "/", route = "/" } = options;

  return render(
    <ToastProvider>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path={path} element={ui} />
          <Route path="/login" element={<div>Login screen</div>} />
          <Route path="/dashboard" element={<div>Dashboard screen</div>} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>,
  );
}
