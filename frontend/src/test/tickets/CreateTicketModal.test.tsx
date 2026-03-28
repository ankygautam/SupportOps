import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal";
import { renderWithProviders } from "@/test/utils";

const customers = [
  {
    id: "cust-1",
    company: "Prairie Connect Services",
  },
] as const;

const users = [
  {
    id: "usr-1",
    name: "Daniel Kim",
  },
] as const;

describe("CreateTicketModal", () => {
  it("shows field validation and prevents an empty submit", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <CreateTicketModal open customers={customers as never} users={users as never} onClose={vi.fn()} onCreate={onCreate} />,
    );

    await user.click(screen.getByRole("button", { name: /create ticket/i }));

    expect(screen.getByText("Subject is required.")).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("submits a valid ticket payload once the form is complete", async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    renderWithProviders(
      <CreateTicketModal open customers={customers as never} users={users as never} onClose={vi.fn()} onCreate={onCreate} />,
    );

    await user.type(screen.getByLabelText(/subject/i), "Billing portal returns 500 error");
    await user.type(screen.getByLabelText(/description/i), "Finance users cannot export invoices from the portal.");
    await user.selectOptions(screen.getByLabelText(/customer/i), "cust-1");
    await user.selectOptions(screen.getByLabelText(/assigned agent/i), "usr-1");
    await user.type(screen.getByLabelText(/due date/i), "2026-03-29");
    await user.click(screen.getByRole("button", { name: /create ticket/i }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        subject: "Billing portal returns 500 error",
        description: "Finance users cannot export invoices from the portal.",
        customerId: "cust-1",
        priority: "Medium",
        status: "New",
        assignedAgentId: "usr-1",
        dueDate: "2026-03-29",
      }),
    );
  });
});
