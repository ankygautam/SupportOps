import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mapCustomer, mapIncident, mapTicket, mapUser } from "@/api/mappers";
import { TicketDetailPage } from "@/pages/TicketDetailPage";
import {
  makeCustomerDetailDto,
  makeIncidentSummaryDto,
  makeTicketDetailDto,
  makeTicketSummaryDto,
  makeUserSummaryDto,
} from "@/test/factories";
import { renderRoute } from "@/test/utils";

const apiMocks = vi.hoisted(() => ({
  createTicketComment: vi.fn(),
  updateTicket: vi.fn(),
}));

const useApiQueryMock = vi.hoisted(() => vi.fn());

const authState = vi.hoisted(() => ({
  hasRole: vi.fn(() => true),
}));

vi.mock("@/api", () => apiMocks);
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => authState,
}));
vi.mock("@/hooks/useApiQuery", () => ({
  useApiQuery: useApiQueryMock,
}));

describe("TicketDetailPage", () => {
  it("renders ticket details, customer context, and timeline data from the backend", async () => {
    const users = [
      makeUserSummaryDto(),
      makeUserSummaryDto({
        id: "usr-lead-1",
        fullName: "Nina Patel",
        email: "lead@supportops.dev",
        role: "TEAM_LEAD",
        team: "Command Center",
      }),
    ].map(mapUser);
    const mappedTicket = mapTicket(
      makeTicketDetailDto({
        comments: [
          {
            id: "comment-1",
            authorId: "usr-agent-1",
            authorName: "Daniel Kim",
            content: "We have reproduced the export failure in production.",
            internalNote: false,
            createdAt: "2026-03-28T15:00:00Z",
          },
        ],
      }),
      users,
    );
    const relatedTickets = [mapTicket(makeTicketSummaryDto(), users)];
    const mappedCustomer = mapCustomer(makeCustomerDetailDto(), users, relatedTickets);

    const responses = [
      { data: users, loading: false, error: "", retry: vi.fn(), setData: vi.fn() },
      {
        data: [mapIncident(makeIncidentSummaryDto(), users)],
        loading: false,
        error: "",
        retry: vi.fn(),
        setData: vi.fn(),
      },
      { data: mappedTicket, loading: false, error: "", retry: vi.fn(), setData: vi.fn() },
      {
        data: {
          customer: mappedCustomer,
          relatedTickets,
        },
        loading: false,
        error: "",
        retry: vi.fn(),
        setData: vi.fn(),
      },
      { data: null, loading: false, error: "", retry: vi.fn(), setData: vi.fn() },
    ];
    let queryCall = 0;
    useApiQueryMock.mockImplementation(() => {
      const response = responses[queryCall % responses.length];
      queryCall += 1;
      return response;
    });

    apiMocks.createTicketComment.mockResolvedValue(undefined);
    apiMocks.updateTicket.mockResolvedValue(makeTicketSummaryDto());

    renderRoute(<TicketDetailPage />, {
      path: "/tickets/:id",
      route: "/tickets/SUP-4102",
    });

    expect(await screen.findByText("Customer info")).toBeInTheDocument();
    expect(screen.getAllByText("Billing portal returns 500 error").length).toBeGreaterThan(0);
    expect(screen.getByText("We have reproduced the export failure in production.")).toBeInTheDocument();
    expect(screen.getByText("Ticket summary")).toBeInTheDocument();
  });
});
