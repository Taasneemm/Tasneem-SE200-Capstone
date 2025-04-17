"use server";

import { db } from "@/db";

export async function checkSubscriptionAmtFrmDB() {
  try {
    const totalSubscriptions = await db.policyHolderPolicy.count(); // use this as seen in your autocompletion

    return { count: totalSubscriptions };
  } catch (error) {
    console.error("DB Error:", error);
    return { error: "Error fetching subscription count" };
  }
}
