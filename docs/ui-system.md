# SupportOps UI System

SupportOps uses a compact internal-SaaS visual system designed for dense operational work without feeling heavy or generic.

## Layout rhythm

- Keep primary app content inside the shared `max-w-[1600px]` shell.
- Use `space-y-6` as the default page rhythm between major sections.
- Start most pages with `PageHeader`, then summary cards or filters, then the main working surface.
- Prefer `panel` for primary content surfaces and `panel-muted` for supporting or lower-priority blocks.

## Typography

- Use `page-title` for route-level titles.
- Use `page-helper` for route-level helper text under titles.
- Use `section-title` for card and table headings.
- Use `section-helper` for supporting text inside cards and panels.
- Use `meta-label` for uppercase labels above metadata values.
- Keep body copy at `text-sm` unless a stronger emphasis is needed.

## Cards and surfaces

- Primary surfaces should use `panel`.
- Secondary surfaces should use `panel-muted`.
- Keep normal card padding at `p-6`; use `p-5` only when the layout is especially dense.
- Avoid introducing new custom radii unless a component truly needs a different shape.

## Tables

- Use `TableWrapper` for data-heavy surfaces.
- Use `table-head`, `table-cell`, `table-meta`, `table-kicker`, and `table-row-interactive` for queue tables.
- Prefer `table-action-pill` for lightweight row actions instead of ad hoc button styling.
- Show secondary metadata beneath primary values rather than creating extra columns when space is tight.

## Forms

- Use `field-label` for form labels.
- Use `field-input`, `field-select`, and `field-textarea` for controls.
- Keep submit rows aligned with shared `Button` variants and sizes.
- Use compact helper or error copy below fields instead of inline placeholder-style explanations.

## Badges

- Reserve badges for concise state signals: status, priority, severity, SLA, role, and high-signal counts.
- Prefer neutral or info tones for context, warning/danger for urgency, and success for confirmed healthy states.
- Keep badge copy short and title-cased.

## Motion

- Motion should be subtle and operationally calm.
- Small lift on cards is acceptable for summary surfaces.
- Tables should favor background/focus feedback over movement.
- Dialogs and drawers should feel smooth but not theatrical.

## Copy

- Keep helper text concise, professional, and workflow-oriented.
- Prefer operational phrasing like “queue”, “ownership”, “follow-up”, and “workflow”.
- Avoid filler, playful language, or generic dashboard wording.
