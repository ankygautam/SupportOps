import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IncidentsPage } from "@/pages/IncidentsPage";
import { makeIncidentDetailDto, makeIncidentSummaryDto, makeUserSummaryDto } from "@/test/factories";
import { renderRoute } from "@/test/utils";

const apiMocks = vi.hoisted(() => ({
  getUsers: vi.fn(),
  getIncidents: vi.fn(),
  getIncident: vi.fn(),
  createIncident: vi.fn(),
}));

vi.mock("@/api", () => apiMocks);

describe("IncidentsPage", () => {
  it("renders the incident command queue from backend data", async () => {
    apiMocks.getUsers.mockResolvedValue([
      makeUserSummaryDto({
        id: "usr-lead-1",
        fullName: "Nina Patel",
        email: "lead@supportops.dev",
        role: "TEAM_LEAD",
        team: "Command Center",
      }),
    ]);
    apiMocks.getIncidents.mockResolvedValue([makeIncidentSummaryDto()]);
    apiMocks.getIncident.mockResolvedValue(makeIncidentDetailDto());
    apiMocks.createIncident.mockResolvedValue(makeIncidentSummaryDto());

    renderRoute(<IncidentsPage />, { path: "/incidents", route: "/incidents" });

    expect(await screen.findByText("API gateway latency spike")).toBeInTheDocument();
    expect(screen.getByText("Incident command queue")).toBeInTheDocument();
    expect(screen.getByText(/1 incidents visible/i)).toBeInTheDocument();
  });
});
