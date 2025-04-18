"use server";

import { db } from "@/db";

export async function checkRevByMonthFrmDB() {
  try {
    // Step 1: Fetch all purchase records with related insurance prices
    const records = await db.policyHolderPolicy.findMany({
      include: {
        insurancePolicy: {
          select: {
            base_price_sgd: true,
          },
        },
      },
    });

    // Step 2: Create a revenue-by-month map
    const revenueByMonth: Record<string, number> = {};

    for (const record of records) {
      const basePrice = record.insurancePolicy.base_price_sgd;
      const localDate = new Date(record.purchase_date.toLocaleString("en-US", { timeZone: "Asia/Singapore" }));

      // Format month as "Apr", "May", etc.
      const month = localDate.toLocaleString("en-US", {
        timeZone: "Asia/Singapore",
        month: "short",
      });

      revenueByMonth[month] = (revenueByMonth[month] || 0) + basePrice;
    }

    // Step 3: Convert to array of objects
    const result = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month, // e.g., "Apr"
      revenue,
    }));

    return result;
  } catch (error) {
    console.error("DB Error (Monthly Revenue):", error);
    return { error: "Error calculating revenue by month" };
  }
}
