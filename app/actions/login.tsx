"use server";
import { auth, signOut } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function login(data) {
  const currentSession = await auth();

  if (currentSession?.user) {
    await signOut({ redirect: false }); // Clear session if one exists
  }
  
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