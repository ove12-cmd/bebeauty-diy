"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Sisesta kasutajanimi ja parool." };
  }

  if (!checkCredentials(username, password)) {
    return { error: "Vale kasutajanimi või parool." };
  }

  await createSession();
  redirect("/dashboard");
}
