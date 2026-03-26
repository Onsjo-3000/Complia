"use client";

import { markAllNotificationsReadAction } from "@/actions/notification-actions";

export default function MarkAllReadButton() {
  return (
    <button
      onClick={() => markAllNotificationsReadAction()}
      className="text-sm text-blue-700 hover:underline"
    >
      Markera alla som lästa
    </button>
  );
}
