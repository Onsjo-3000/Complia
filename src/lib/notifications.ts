import { prisma } from "./prisma";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "new_law" | "match" | "system",
  linkUrl?: string
) {
  return prisma.notification.create({
    data: { userId, title, message, type, linkUrl },
  });
}

export async function createMatchNotifications(
  userId: string,
  lawTitle: string,
  matchCount: number,
  lawId: string
) {
  return createNotification(
    userId,
    `Ny lag: ${lawTitle}`,
    `${matchCount} av dina kunder kan påverkas av denna lag.`,
    "match",
    `/lagar/${lawId}`
  );
}
