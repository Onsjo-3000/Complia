"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Ej inloggad." };
  }

  const email = formData.get("email") as string;
  const firmName = formData.get("firmName") as string;
  const phone = (formData.get("phone") as string) || null;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !firmName) {
    return { error: "E-post och byrånamn är obligatoriska." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) return { error: "Användaren hittades inte." };

    // Check if email is taken by another user
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return { error: "E-postadressen används redan av ett annat konto." };
      }
    }

    // Handle password change
    let passwordHash = user.passwordHash;
    if (newPassword) {
      if (!currentPassword) {
        return { error: "Ange nuvarande lösenord för att byta lösenord." };
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return { error: "Nuvarande lösenord är felaktigt." };
      }
      if (newPassword.length < 6) {
        return { error: "Nytt lösenord måste vara minst 6 tecken." };
      }
      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { email, firmName, phone, passwordHash },
    });

    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Profile update error:", message);
    return { error: "Kunde inte uppdatera profilen." };
  }
}
