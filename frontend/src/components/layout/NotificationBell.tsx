import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/api";
import { mapNotification } from "@/api/mappers";
import { useApiQuery } from "@/hooks/useApiQuery";

const notificationTone: Record<string, string> = {
  TICKET_ASSIGNED: "bg-sky-50 text-sky-700",
  TICKET_ESCALATED: "bg-rose-50 text-rose-700",
  SLA_BREACHED: "bg-amber-50 text-amber-700",
  INCIDENT_CREATED: "bg-indigo-50 text-indigo-700",
  INCIDENT_RESOLVED: "bg-emerald-50 text-emerald-700",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const notificationsQuery = useApiQuery([], async () => {
    const response = await getNotifications();
    return {
      unreadCount: response.unreadCount,
      items: response.items.map(mapNotification),
    };
  }, { enabled: true });

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;
  const previewItems = useMemo(() => (notificationsQuery.data?.items ?? []).slice(0, 8), [notificationsQuery.data?.items]);

  async function handleOpenNotification(id: string, link?: string) {
    const response = await markNotificationRead(id);
    notificationsQuery.setData({
      unreadCount: response.unreadCount,
      items: response.items.map(mapNotification),
    });
    if (link) {
      navigate(link);
      setOpen(false);
    }
  }

  async function handleMarkAllRead() {
    const response = await markAllNotificationsRead();
    notificationsQuery.setData({
      unreadCount: response.unreadCount,
      items: response.items.map(mapNotification),
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:border-slate-300 hover:bg-slate-50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount ? <span className="absolute right-2.5 top-2.5 min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{Math.min(unreadCount, 9)}{unreadCount > 9 ? "+" : ""}</span> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-50 w-[360px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_64px_rgba(15,23,42,0.16)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="mt-1 text-sm text-slate-500">Operational updates that need attention.</p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notificationsQuery.loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-3xl bg-slate-100" />
              ))
            ) : previewItems.length ? (
              previewItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenNotification(item.id, item.link)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50 ${
                    item.unread ? "border-sky-100 bg-sky-50/50" : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${notificationTone[item.type] ?? "bg-slate-100 text-slate-700"}`}>
                      {item.type.replace(/_/g, " ")}
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.createdAt}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-900">All clear</p>
                <p className="mt-2 text-sm text-slate-500">No unread operational events are waiting for you.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
