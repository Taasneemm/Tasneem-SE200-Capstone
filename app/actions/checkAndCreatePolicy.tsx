import { policySchema } from "@/app/schemas"
import { redirect } from "next/navigation";
import { db } from "@/db"
/**
 * Server Action triggered on form submission.
 *
 * - If validation fails, it redirects to /policies/add with error messages.
 * - On success, it creates the record and redirects to /policies/add?reset=[timestamp],
 *   ensuring a remount of the form with cleared inputs.
 */
export async function checkAndCreatePolicy(formData: FormData) {
  "use server";

  // Convert form data to a plain object.
  const formObject = Object.fromEntries(formData.entries());

  // Validate using the Zod schema.
  const result = policySchema.safeParse(formObject);
  if (!result.success) {
    // Serialize errors and redirect with query parameters.
    const errors = JSON.stringify(result.error.flatten().fieldErrors);
    redirect(`/policies/add?errors=${encodeURIComponent(errors)}`);
  }

  // If valid, create a new record in the database.
  await db.insurancePolicy.create({
    data: {
      insurance_policy_id: result.data.id,
      insurance_policy_name: result.data.name,
      base_price_sgd: parseInt(result.data.price, 10),
      type_of_policy: result.data.type,
    },
  });

  // On success, redirect with a unique reset query parameter.
  redirect(`/policies/add?reset=${Date.now()}`);
}