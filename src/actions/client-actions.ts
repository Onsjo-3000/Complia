"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createClientAction(formData: FormData) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const legalAreas = formData.getAll("legalAreas").join(",");

  if (!name || !industry || !legalAreas) {
    return { error: "Namn, bransch och rättsområden krävs." };
  }

  await prisma.client.create({
    data: {
      userId,
      name,
      organizationNr: (formData.get("organizationNr") as string) || null,
      industry,
      legalAreas,
      contactEmail: (formData.get("contactEmail") as string) || null,
      contactPerson: (formData.get("contactPerson") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  });

  redirect("/klienter");
}

export async function updateClientAction(formData: FormData) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;
  const clientId = formData.get("clientId") as string;

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
  if (!client) return { error: "Klienten hittades inte." };

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const legalAreas = formData.getAll("legalAreas").join(",");

  if (!name || !industry || !legalAreas) {
    return { error: "Namn, bransch och rättsområden krävs." };
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name,
      organizationNr: (formData.get("organizationNr") as string) || null,
      industry,
      legalAreas,
      contactEmail: (formData.get("contactEmail") as string) || null,
      contactPerson: (formData.get("contactPerson") as string) || null,
      notes: (formData.get("notes") as string) || null,
      active: formData.get("active") === "true",
    },
  });

  redirect(`/klienter/${clientId}`);
}

export async function deleteClientAction(clientId: string) {
  const session = await getRequiredSession();
  const userId = session.user!.id!;

  await prisma.client.deleteMany({
    where: { id: clientId, userId },
  });

  redirect("/klienter");
}
