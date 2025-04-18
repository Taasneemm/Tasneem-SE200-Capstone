"use server";

import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function login(data) {
  try {
    await signIn("credentials", {
      redirectTo: "/dashboard",
      email: data.email,
      password: data.password,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      console.error("Standard Redirect Error:", error);
      throw error;
    }

    return { error: "Invalid credentials" };
  }
}