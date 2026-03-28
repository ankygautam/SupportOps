import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SettingsPage } from "@/pages/SettingsPage";
import { makeUserPreferencesDto } from "@/test/factories";
import { renderRoute } from "@/test/utils";

const apiMocks = vi.hoisted(() => ({
  getUserPreferences: vi.fn(),
  updateUserPreferences: vi.fn(),
}));

const authState = vi.hoisted(() => ({
  user: {
    initials: "SC",
  },
  hasRole: vi.fn(() => true),
}));

vi.mock("@/api", () => apiMocks);
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

describe("SettingsPage", () => {
  it("loads preferences and saves profile changes through the backend API", async () => {
    const preferences = makeUserPreferencesDto();
    apiMocks.getUserPreferences.mockResolvedValue(preferences);
    apiMocks.updateUserPreferences.mockResolvedValue({
      ...preferences,
      profile: {
        ...preferences.profile,
        timezone: "Europe/London",
      },
    });
    const user = userEvent.setup();

    renderRoute(<SettingsPage />, { path: "/settings", route: "/settings" });

    expect(await screen.findByDisplayValue("America/Edmonton")).toBeInTheDocument();

    await user.selectOptions(screen.getAllByRole("combobox")[1], "Europe/London");
    await user.click(screen.getAllByRole("button", { name: /save changes/i })[0]);

    await waitFor(() =>
      expect(apiMocks.updateUserPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.objectContaining({
            timezone: "Europe/London",
          }),
        }),
      ),
    );

    expect(await screen.findByText("Your workspace preferences were updated successfully.")).toBeInTheDocument();
  });
});
