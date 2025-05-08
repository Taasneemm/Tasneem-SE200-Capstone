import { redirect } from "next/navigation";
import { customerSchema } from "@/app/schemas";
import { db } from "@/db"

/**
 * Server Action that validates the form data and creates a PolicyHolder record.
 * Optionally, it associates the new holder with the selected policy.
 */
export async function checkAndCreatePolicyHolder(formData: FormData) {
  "use server";

  // Convert the form data to an object.
  const formObject = Object.fromEntries(formData.entries());
  const result = customerSchema.safeParse(formObject);

  if (!result.success) {
    const errors = JSON.stringify(result.error.flatten().fieldErrors);
    redirect(`/customers/add?errors=${encodeURIComponent(errors)}`);
  }

  // Extract the selected policy ID from the form.
  const selectedInsurancePolicyId = formData.get("policy") as string | undefined;

  // Create the new PolicyHolder record.
  const newHolder = await db.policyHolder.create({
    data: {
      policy_holder_id: result.data.id,
      policy_holder_email: result.data.email,
      policy_holder_first_name: result.data.firstName,
      policy_holder_last_name: result.data.lastName,
    },
  });

  // (Optional) Associate the new holder with the selected policy.
  if (selectedInsurancePolicyId && selectedInsurancePolicyId.trim() !== "") {
    await db.policyHolderPolicy.create({
      data: {
        policy_holder_id: newHolder.policy_holder_id,
        insurance_policy_id: selectedInsurancePolicyId,
      },
    });
  }

  // Redirect with a unique reset parameter to force a remount (clearing fields).
  redirect(`/customers/add?reset=${Date.now()}`);
}