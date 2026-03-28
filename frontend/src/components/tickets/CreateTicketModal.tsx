import { useEffect, useState } from "react";
import { Button } from "@/components/forms/Button";
import { DialogShell } from "@/components/forms/DialogShell";
import { Field } from "@/components/forms/Field";
import { SelectField } from "@/components/forms/SelectField";
import { TextInput } from "@/components/forms/TextInput";
import { TextareaField } from "@/components/forms/TextareaField";
import type { Customer, TicketPriority, TicketStatus, User } from "@/types/models";

export interface NewTicketFormValues {
  subject: string;
  description: string;
  customerId: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId: string;
  dueDate: string;
}

interface CreateTicketModalProps {
  open: boolean;
  customers: Customer[];
  users: User[];
  onClose: () => void;
  onCreate: (values: NewTicketFormValues) => Promise<void> | void;
}

const initialValues: NewTicketFormValues = {
  subject: "",
  description: "",
  customerId: "",
  priority: "Medium",
  status: "New",
  assignedAgentId: "",
  dueDate: "",
};

export function CreateTicketModal({ open, customers, users, onClose, onCreate }: CreateTicketModalProps) {
  const [values, setValues] = useState<NewTicketFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof NewTicketFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
      setSubmitting(false);
      setSubmitError("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function validate() {
    const nextErrors: Partial<Record<keyof NewTicketFormValues, string>> = {};

    if (!values.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!values.description.trim()) nextErrors.description = "Description is required.";
    if (!values.customerId) nextErrors.customerId = "Select a customer.";
    if (!values.assignedAgentId) nextErrors.assignedAgentId = "Assign an owner.";
    if (!values.dueDate) nextErrors.dueDate = "Pick a due date.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await onCreate(values);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create ticket.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      eyebrow="Create Ticket"
      title="Open a new support case"
      description="Capture the issue clearly so routing, SLA tracking, and customer follow-up can start immediately."
      maxWidthClass="max-w-3xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create ticket"}
          </Button>
        </>
      }
    >
        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          {submitError ? (
            <div className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}
          <Field label="Subject" error={errors.subject} className="md:col-span-2">
            <TextInput
              type="text"
              value={values.subject}
              onChange={(event) => setValues({ ...values, subject: event.target.value })}
              placeholder="Brief summary of the customer issue"
              hasError={Boolean(errors.subject)}
            />
          </Field>

          <Field label="Description" error={errors.description} className="md:col-span-2">
            <TextareaField
              value={values.description}
              onChange={(event) => setValues({ ...values, description: event.target.value })}
              rows={5}
              placeholder="Describe symptoms, customer impact, and any troubleshooting already completed"
              hasError={Boolean(errors.description)}
            />
          </Field>

          <Field label="Customer" error={errors.customerId}>
            <SelectField
              value={values.customerId}
              onChange={(event) => setValues({ ...values, customerId: event.target.value })}
              hasError={Boolean(errors.customerId)}
              disabled={submitting}
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.company}
                </option>
              ))}
            </SelectField>
          </Field>

          <Field label="Assigned agent" error={errors.assignedAgentId}>
            <SelectField
              value={values.assignedAgentId}
              onChange={(event) => setValues({ ...values, assignedAgentId: event.target.value })}
              hasError={Boolean(errors.assignedAgentId)}
              disabled={submitting}
            >
              <option value="">Select agent</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </SelectField>
          </Field>

          <Field label="Priority">
            <SelectField
              value={values.priority}
              onChange={(event) => setValues({ ...values, priority: event.target.value as TicketPriority })}
              disabled={submitting}
            >
              {["Low", "Medium", "High", "Critical"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </SelectField>
          </Field>

          <Field label="Status">
            <SelectField
              value={values.status}
              onChange={(event) => setValues({ ...values, status: event.target.value as TicketStatus })}
              disabled={submitting}
            >
              {["New", "In Progress", "Waiting on Customer", "Resolved", "Closed"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectField>
          </Field>

          <Field label="Due date" error={errors.dueDate} className="md:col-span-2">
            <TextInput
              type="date"
              value={values.dueDate}
              onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
              hasError={Boolean(errors.dueDate)}
              disabled={submitting}
            />
          </Field>
        </div>
    </DialogShell>
  );
}
