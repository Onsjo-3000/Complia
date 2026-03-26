"use client";

import { markAllNotificationsReadAction } from "@/actions/notification-actions";

export default function MarkAllReadButton() {
  return (
    <button
      onClick={() => markAllNotificationsReadAction()}
      className="text-sm text-black hover:underline"
    >
      Markera alla som lästa
    </button>
  );
}
