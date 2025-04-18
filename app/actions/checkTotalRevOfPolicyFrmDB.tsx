"use server";

import { db } from "@/db";

export async function checkTotlRevOfPolciesFrmDB() {
  try {
    // 1. Get count of each insurance_policy_id
    const policyCounts = await db.policyHolderPolicy.groupBy({
      by: ["insurance_policy_id"],
      _count: {
        insurance_policy_id: true,
      },
    });

    // 2. Get base_price_sgd for all matching policies
    const allPolicies = await db.insurancePolicy.findMany({
      where: {
        insurance_policy_id: {
          in: policyCounts.map(p => p.insurance_policy_id),
        },
      },
      select: {
        insurance_policy_id: true,
        base_price_sgd: true,
      },
    });

    // 3. Calculate total revenue: count * base_price_sgd
    let totalRevenue = 0;

    for (const policy of policyCounts) {
      const priceObj = allPolicies.find(
        p => p.insurance_policy_id === policy.insurance_policy_id
      );
      if (priceObj) {
        totalRevenue += policy._count.insurance_policy_id * priceObj.base_price_sgd;
      }
    }

    return { totalRevenue };
  } catch (error) {
    console.error("DB Error:", error);
    return { error: "Error calculating total revenue" };
  }
}
