// app/actions/signout.ts
"use server";

import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signout() {
  // Call your signOut function to clear the session cookies.
  await signOut();
  // If sign-out is successful, redirect to "/" (home page).
  redirect("/");
}
