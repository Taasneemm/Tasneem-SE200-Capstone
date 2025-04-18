"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function GoogleLogin() {
  try {
    await signIn("google", { redirectTo: "/dashboard" });
  } catch (error) {
    if (isRedirectError(error)) {
      console.error("Redirect error during Google login:", error);
      throw error; // Let Next.js handle the redirect
    }

    console.error("Google login failed:", error);
    redirect("/"); // ✅ Redirect to home on any unexpected error
  }
}
