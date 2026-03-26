import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MarkReadButton from "@/components/notifications/MarkReadButton";
import MarkAllReadButton from "@/components/notifications/MarkAllReadButton";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Notiser</h1>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Inga notiser.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 flex items-start gap-3 ${
                !notification.read ? "bg-gray-50" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  !notification.read ? "bg-black" : "bg-transparent"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {notification.message}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">
                    {notification.createdAt.toLocaleDateString("sv-SE")}{" "}
                    {notification.createdAt.toLocaleTimeString("sv-SE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {notification.linkUrl && (
                    <Link
                      href={notification.linkUrl}
                      className="text-xs text-black hover:underline"
                    >
                      Visa
                    </Link>
                  )}
                </div>
              </div>
              {!notification.read && (
                <MarkReadButton notificationId={notification.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
