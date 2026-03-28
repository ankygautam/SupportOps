import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "@/pages/LoginPage";
import { renderWithProviders } from "@/test/utils";

const navigateMock = vi.fn();
const authState = vi.hoisted(() => ({
  signIn: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    authState.signIn.mockReset();
    window.localStorage.clear();
  });

  it("submits credentials and routes to the protected workspace", async () => {
    authState.signIn.mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, "/login");

    await user.clear(screen.getByLabelText(/work email/i));
    await user.type(screen.getByLabelText(/work email/i), "lead@supportops.dev");
    await user.clear(screen.getByLabelText(/password/i));
    await user.type(screen.getByLabelText(/password/i), "supportops");
    await user.click(screen.getByRole("button", { name: /sign in to supportops/i }));

    await waitFor(() =>
      expect(authState.signIn).toHaveBeenCalledWith({
        email: "lead@supportops.dev",
        password: "supportops",
        remember: true,
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("shows backend-backed authentication errors without navigating away", async () => {
    authState.signIn.mockResolvedValue({ ok: false, error: "Invalid email or password." });
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />, "/login");

    await user.click(screen.getByRole("button", { name: /sign in to supportops/i }));

    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
