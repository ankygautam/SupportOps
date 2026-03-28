import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TicketsPage } from "@/pages/TicketsPage";
import {
  makeCustomerSummaryDto,
  makeTicketSummaryDto,
  makeUserSummaryDto,
} from "@/test/factories";
import { renderRoute } from "@/test/utils";

const apiMocks = vi.hoisted(() => ({
  getUsers: vi.fn(),
  getCustomers: vi.fn(),
  getTickets: vi.fn(),
  createTicket: vi.fn(),
}));

const authState = vi.hoisted(() => ({
  user: {
    id: "usr-agent-1",
    name: "Daniel Kim",
    initials: "DK",
    role: "Support Agent",
    roleKey: "SUPPORT_AGENT",
    team: "Core Support",
    email: "agent1@supportops.dev",
    status: "Online",
  },
}));

vi.mock("@/api", () => apiMocks);
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));

describe("TicketsPage", () => {
  it("renders the ticket queue from API data and updates the search query", async () => {
    apiMocks.getUsers.mockResolvedValue([makeUserSummaryDto()]);
    apiMocks.getCustomers.mockResolvedValue([makeCustomerSummaryDto()]);
    apiMocks.getTickets.mockResolvedValue([
      makeTicketSummaryDto(),
      makeTicketSummaryDto({
        id: "SUP-4103",
        subject: "Mobile app login timeout",
        priority: "CRITICAL",
        slaState: "BREACHED",
      }),
    ]);

    const user = userEvent.setup();
    renderRoute(<TicketsPage />, { path: "/tickets", route: "/tickets" });

    expect(await screen.findByText("Billing portal returns 500 error")).toBeInTheDocument();
    expect(screen.getByText("Mobile app login timeout")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search ticket id, subject, customer/i), "billing");

    await waitFor(() =>
      expect(apiMocks.getTickets).toHaveBeenLastCalledWith(
        expect.objectContaining({
          q: "billing",
        }),
      ),
    );
  });
});
