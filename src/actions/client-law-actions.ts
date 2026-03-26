"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addLawToClientAction(clientId: string, lawId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Ej inloggad." };

  // Verify client belongs to user
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id },
  });
  if (!client) return { error: "Klienten hittades inte." };

  // Check if already exists
  const existing = await prisma.lawMatch.findFirst({
    where: { lawId, clientId },
  });
  if (existing) return { error: "Lagen är redan kopplad till klienten." };

  const law = await prisma.law.findUnique({ where: { id: lawId } });
  if (!law) return { error: "Lagen hittades inte." };

  await prisma.lawMatch.create({
    data: {
      lawId,
      clientId,
      relevanceScore: 100,
      matchReason: "Manuellt tillagd",
      recommendation: "bevaka",
      manual: true,
    },
  });

  revalidatePath(`/klienter/${clientId}`);
  return { success: true };
}

export async function removeLawFromClientAction(matchId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Ej inloggad." };

  const match = await prisma.lawMatch.findFirst({
    where: { id: matchId },
    include: { client: true },
  });
  if (!match || match.client.userId !== session.user.id) {
    return { error: "Matchningen hittades inte." };
  }

  await prisma.lawMatch.delete({ where: { id: matchId } });

  revalidatePath(`/klienter/${match.clientId}`);
  return { success: true };
}

export async function searchLawsAction(query: string) {
  if (!query || query.length < 2) return [];

  const laws = await prisma.law.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { designation: { contains: query } },
      ],
    },
    take: 10,
    orderBy: { publishedDate: "desc" },
  });

  return laws.map((l) => ({
    id: l.id,
    designation: l.designation,
    title: l.title,
    publishedDate: l.publishedDate.toISOString(),
  }));
}
