"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firmName = formData.get("firmName") as string;
  const phone = (formData.get("phone") as string) || undefined;

  if (!email || !password || !firmName) {
    return { error: "Alla obligatoriska fält måste fyllas i." };
  }

  if (password.length < 6) {
    return { error: "Lösenordet måste vara minst 6 tecken." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "En användare med denna e-postadress finns redan." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, passwordHash, firmName, phone },
    });

    return { success: true };
  } catch (e) {
    console.error("Register error:", e);
    return { error: "Kunde inte skapa konto. Försök igen." };
  }
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/oversikt",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Felaktig e-postadress eller lösenord." };
    }
    throw error;
  }
}
