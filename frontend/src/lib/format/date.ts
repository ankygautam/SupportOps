const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnlyFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatDateOnly(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return dateOnlyFormatter.format(new Date(value));
}

export function formatRelativeTime(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const deltaMs = new Date(value).getTime() - Date.now();
  const absMinutes = Math.max(Math.round(Math.abs(deltaMs) / 60000), 1);

  if (absMinutes < 60) {
    return deltaMs >= 0 ? `in ${absMinutes}m` : `${absMinutes}m ago`;
  }

  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) {
    return deltaMs >= 0 ? `in ${absHours}h` : `${absHours}h ago`;
  }

  const absDays = Math.round(absHours / 24);
  return deltaMs >= 0 ? `in ${absDays}d` : `${absDays}d ago`;
}

export function formatWeekdayLabel(date: Date) {
  return weekdayFormatter.format(date);
}
