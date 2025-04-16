import "@/globals.css";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function dashBoardPage() {
  const session = await auth();

  // If there's no session, redirect to the home page.
  if (!session) {
    redirect("/");
  }

  return (
    <>
        <h1>Dashboard Page</h1>
        <h1 className="text-3xl">{session.user.name}</h1>
    </>
    
  );
}
