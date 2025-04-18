"use server";

import { auth } from "@/lib/auth"; 

export async function checkSessObjDetail() {
  try {
    const sess = await auth();

    if (!sess) {
      return {
        isAuthenticated: false,
        error: "Session not found",
      };
    }

    return {
      isAuthenticated: true,
      session: sess,
    };
  } catch (error) {
    console.error("Failed to retrieve session:", error);
    return {
      isAuthenticated: false,
      error: "Failed to retrieve session",
    };
  }
}
