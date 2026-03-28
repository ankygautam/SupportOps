import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TicketCommentsSection } from "@/components/tickets/TicketCommentsSection";
import { renderWithProviders } from "@/test/utils";

const authState = vi.hoisted(() => ({
  user: {
    id: "usr-1",
    name: "Daniel Kim",
    initials: "DK",
  },
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

describe("TicketCommentsSection", () => {
  it("creates an internal note and keeps the activity feed readable", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(<TicketCommentsSection initialComments={[]} onSend={onSend} />);

    await user.click(screen.getByRole("button", { name: /internal note/i }));
    await user.type(screen.getByPlaceholderText(/add an internal note/i), "Escalating billing logs to the platform team.");
    await user.click(screen.getByRole("button", { name: /^send$/i }));

    await waitFor(() =>
      expect(onSend).toHaveBeenCalledWith({
        message: "Escalating billing logs to the platform team.",
        internal: true,
      }),
    );

    expect(screen.getAllByText("Internal note").length).toBeGreaterThan(0);
    expect(screen.getByText("Escalating billing logs to the platform team.")).toBeInTheDocument();
  });
});
