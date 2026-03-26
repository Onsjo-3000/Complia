"use client";

import { markNotificationReadAction } from "@/actions/notification-actions";

export default function MarkReadButton({
  notificationId,
}: {
  notificationId: string;
}) {
  return (
    <button
      onClick={() => markNotificationReadAction(notificationId)}
      className="text-xs text-gray-400 hover:text-gray-600 flex-shrink-0"
    >
      Markera läst
    </button>
  );
}
