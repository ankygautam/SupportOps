import { useEffect, useState } from "react";
import { Button } from "@/components/forms/Button";
import { DialogShell } from "@/components/forms/DialogShell";
import { Field } from "@/components/forms/Field";
import { SelectField } from "@/components/forms/SelectField";
import { TextInput } from "@/components/forms/TextInput";
import { TextareaField } from "@/components/forms/TextareaField";
import type { IncidentSeverity, IncidentStatus, User } from "@/types/models";

export interface NewIncidentValues {
  title: string;
  affectedService: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  ownerId: string;
  summary: string;
  rootCause: string;
  mitigation: string;
  startedAt: string;
}

interface CreateIncidentModalProps {
  open: boolean;
  users: User[];
  onClose: () => void;
  onCreate: (values: NewIncidentValues) => Promise<void> | void;
}

const initialValues: NewIncidentValues = {
  title: "",
  affectedService: "",
  severity: "Medium",
  status: "Investigating",
  ownerId: "",
  summary: "",
  rootCause: "",
  mitigation: "",
  startedAt: "",
};

export function CreateIncidentModal({ open, users, onClose, onCreate }: CreateIncidentModalProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof NewIncidentValues, string>>>({});
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
    const nextErrors: Partial<Record<keyof NewIncidentValues, string>> = {};

    if (!values.title.trim()) nextErrors.title = "Title is required.";
    if (!values.affectedService.trim()) nextErrors.affectedService = "Affected service is required.";
    if (!values.ownerId) nextErrors.ownerId = "Select an owner.";
    if (!values.summary.trim()) nextErrors.summary = "Summary is required.";
    if (!values.rootCause.trim()) nextErrors.rootCause = "Root cause is required.";
    if (!values.mitigation.trim()) nextErrors.mitigation = "Mitigation is required.";
    if (!values.startedAt) nextErrors.startedAt = "Start time is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onCreate(values);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create incident.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      eyebrow="Create Incident"
      title="Declare a new incident"
      description="Capture the service impact and mitigation path clearly so response work can move quickly."
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Creating..." : "Create incident"}
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
          <Field label="Title" error={errors.title} className="md:col-span-2">
            <TextInput
              type="text"
              value={values.title}
              onChange={(event) => setValues({ ...values, title: event.target.value })}
              placeholder="Short operational summary of the incident"
              hasError={Boolean(errors.title)}
              disabled={submitting}
            />
          </Field>
          <Field label="Affected service" error={errors.affectedService}>
            <TextInput
              type="text"
              value={values.affectedService}
              onChange={(event) => setValues({ ...values, affectedService: event.target.value })}
              placeholder="Public API Gateway"
              hasError={Boolean(errors.affectedService)}
              disabled={submitting}
            />
          </Field>
          <Field label="Owner" error={errors.ownerId}>
            <SelectField
              value={values.ownerId}
              onChange={(event) => setValues({ ...values, ownerId: event.target.value })}
              hasError={Boolean(errors.ownerId)}
              disabled={submitting}
            >
              <option value="">Select owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Severity">
            <SelectField
              value={values.severity}
              onChange={(event) => setValues({ ...values, severity: event.target.value as IncidentSeverity })}
              disabled={submitting}
            >
              {["Low", "Medium", "High", "Critical"].map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Status">
            <SelectField
              value={values.status}
              onChange={(event) => setValues({ ...values, status: event.target.value as IncidentStatus })}
              disabled={submitting}
            >
              {["Investigating", "Identified", "Monitoring", "Resolved"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Summary" error={errors.summary} className="md:col-span-2">
            <TextareaField
              rows={4}
              value={values.summary}
              onChange={(event) => setValues({ ...values, summary: event.target.value })}
              hasError={Boolean(errors.summary)}
              placeholder="Describe what users are seeing and which services are affected"
              disabled={submitting}
            />
          </Field>
          <Field label="Root cause" error={errors.rootCause} className="md:col-span-2">
            <TextareaField
              rows={3}
              value={values.rootCause}
              onChange={(event) => setValues({ ...values, rootCause: event.target.value })}
              hasError={Boolean(errors.rootCause)}
              placeholder="Known or suspected root cause"
              disabled={submitting}
            />
          </Field>
          <Field label="Mitigation" error={errors.mitigation} className="md:col-span-2">
            <TextareaField
              rows={3}
              value={values.mitigation}
              onChange={(event) => setValues({ ...values, mitigation: event.target.value })}
              hasError={Boolean(errors.mitigation)}
              placeholder="Temporary mitigation or recovery plan"
              disabled={submitting}
            />
          </Field>
          <Field label="Started at" error={errors.startedAt} className="md:col-span-2">
            <TextInput
              type="datetime-local"
              value={values.startedAt}
              onChange={(event) => setValues({ ...values, startedAt: event.target.value })}
              hasError={Boolean(errors.startedAt)}
              disabled={submitting}
            />
          </Field>
        </div>
    </DialogShell>
  );
}
