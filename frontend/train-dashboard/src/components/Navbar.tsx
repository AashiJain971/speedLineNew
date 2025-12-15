"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bell, Loader2, Train as TrainIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type NotificationItem = {
  id: string | number;
  title?: string;
  message?: string;
  severity?: "info" | "warning" | "error" | string;
  timestamp?: string | number;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Disruptions", href: "/disruptions" },
  { label: "Live Route", href: "/optimization" },
  { label: "Simulation", href: "/simulation" },
  { label: "Optimization Engine", href: "/optimization-engine" },
  { label: "System Health", href: "/health" },
];

export default function Navbar() {
  const pathname = usePathname();
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    []
  );

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [lastViewedAt, setLastViewedAt] = useState<number>(0);

  const tsToMs = (t: unknown): number => {
    if (typeof t === "number") return t;
    if (typeof t === "string") {
      const ms = Date.parse(t);
      return Number.isNaN(ms) ? 0 : ms;
    }
    return 0;
  };

  const unreadCount = useMemo(() => {
    if (!notifications || notifications.length === 0) return 0;
    return notifications.filter((n) => tsToMs(n.timestamp) > lastViewedAt).length;
  }, [notifications, lastViewedAt]);

  // Fetch notifications from disruptions endpoint on mount and interval
  useEffect(() => {
    let active = true;
    const fetchNotifications = async () => {
      try {
        setNotifLoading(true);
        setNotifError(null);
        // Use real backend disruptions as notifications
        const res = await fetch(`${apiBase}/api/disruptions`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Expected shape: { active_disruptions: { [sectionId]: { type, severity, start_time, end_time, ... } }, timestamp }
        const items: NotificationItem[] = [];
        const map = data?.active_disruptions || {};
        for (const [sectionId, d] of Object.entries<any>(map)) {
          items.push({
            id: `${sectionId}-${d?.start_time || "now"}`,
            title: `Disruption at ${sectionId}`,
            message: `${(d?.type || "issue").toString().replaceAll("_", " ")} • Severity: ${d?.severity || "unknown"}`,
            severity: d?.severity || "info",
            timestamp: d?.start_time || data?.timestamp || Date.now(),
          });
        }
        if (!active) return;
        setNotifications(items);
      } catch (e: any) {
        if (!active) return;
        setNotifError(e?.message || "Failed to load notifications");
      } finally {
        if (active) setNotifLoading(false);
      }
    };

    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [apiBase]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <TrainIcon className="h-4 w-4 text-white" />
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900">SpeedLine</span>
            </Link>
          </div>

          {/* Primary nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                    (isActive
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Notifications */}
          <div className="flex items-center gap-2 relative">
            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() =>
                setNotifOpen((v) => {
                  const next = !v;
                  if (next) {
                    // Mark all as viewed when opening the panel
                    setLastViewedAt(Date.now());
                  }
                  return next;
                })
              }
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {Math.min(99, unreadCount)}
                </span>
              ) : null}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-10 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <div className="border-b px-3 py-2 text-sm font-semibold text-gray-800">Notifications</div>
                <div className="max-h-80 overflow-auto">
                  {notifLoading ? (
                    <div className="flex items-center gap-2 px-3 py-4 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                  ) : notifError ? (
                    <div className="px-3 py-4 text-sm text-red-600">{notifError}</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={String(n.id)} className="border-b last:border-b-0 px-3 py-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="capitalize">{n.severity || "info"}</span>
                          {n.timestamp ? (
                            <time>{new Date(n.timestamp).toLocaleString()}</time>
                          ) : null}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{n.title || "Notification"}</div>
                        {n.message ? (
                          <div className="text-sm text-gray-700">{n.message}</div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
