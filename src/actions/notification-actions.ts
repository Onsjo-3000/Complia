"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(notificationId: string) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });

  revalidatePath("/notiser");
}

export async function markAllNotificationsReadAction() {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  revalidatePath("/notiser");
}
