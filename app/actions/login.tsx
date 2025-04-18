"use server";

import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

type LoginData = {
  email: string;
  password: string;
};

export async function login(data: LoginData) {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // 👈 prevents server-side redirect
    });

    console.log("  expecting result: ", result)
    if (!result || result.error) {
      console.warn("Login failed:", result?.error);
      return { error: "Invalid email or password." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      console.error("Redirect error during login:", error);
      throw error;
    }

    console.error("Unexpected error during login:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
