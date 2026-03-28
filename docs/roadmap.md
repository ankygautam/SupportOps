# SupportOps Roadmap

This roadmap keeps likely future work aligned with the current architecture without implying that all items are already implemented.

## Short-term enhancements

- Ticket attachments with upload metadata and secure download handling
- Ticket tags and issue categories for better queue slicing
- Richer team filters and staffing coverage summaries
- Stronger analytics date filters and export options

## Medium-term product upgrades

- Customer-facing support portal backed by the same ticket domain
- Knowledge base integration for case deflection and agent context
- Real-time notification delivery on top of the current notification model
- Audit exports and operational report downloads

## Long-term platform opportunities

- Public service status page linked to incident workflows
- AI-assisted ticket summaries and case handoff notes
- Advanced reporting warehouse or historical trend snapshots
- Expanded permission model with more granular operational roles

## Guardrails for future work

- Prefer extending existing domains instead of creating parallel feature silos.
- Keep detail responses rich and list responses lean.
- Keep demo/showcase helpers isolated from production-safe core flows.
- Add new workflow rules in services and DTOs first, not directly in controllers or pages.
