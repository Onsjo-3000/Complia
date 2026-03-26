"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markContactedAction(matchId: string) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  await prisma.lawMatch.updateMany({
    where: { id: matchId, client: { userId } },
    data: { contacted: true },
  });

  revalidatePath("/matchningar");
  revalidatePath("/oversikt");
}

export async function markDismissedAction(matchId: string) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  await prisma.lawMatch.updateMany({
    where: { id: matchId, client: { userId } },
    data: { dismissed: true },
  });

  revalidatePath("/matchningar");
  revalidatePath("/oversikt");
}
