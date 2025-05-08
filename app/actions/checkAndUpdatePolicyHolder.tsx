import { redirect } from "next/navigation";
import { customerSchema } from "@/app/schemas";
import { db } from "@/db"

/**
 * Server Action that validates form data and updates a PolicyHolder record.
 * It also checks if a policy (via the join table) already exists.
 * If the selected policy exists, a specific error message is returned.
 */
export async function checkAndUpdatePolicyHolder(formData: FormData) {
    "use server";
  
    // Convert the form data to an object.
    const formObject = Object.fromEntries(formData.entries());
    const result = customerSchema.safeParse(formObject);
  
    if (!result.success) {
      const errors = JSON.stringify(result.error.flatten().fieldErrors);
      redirect(`/customers/update?errors=${encodeURIComponent(errors)}`);
    }
  
    // Extract typed form data.
    const { id, email, firstName, lastName, policy } = result.data;
  
    // 1. Fetch the existing policy holder by NRIC, including their related policies.
    const existingHolder = await db.policyHolder.findUnique({
      where: { policy_holder_id: id },
      include: {
        policies: {
          include: {
            insurancePolicy: true,
          },
        },
      },
    });
  
    // 2. If the policy holder does not exist, create a new record.
    if (!existingHolder) {
      const createdHolder = await db.policyHolder.create({
        data: {
          policy_holder_id: id,
          policy_holder_email: email,
          policy_holder_first_name: firstName,
          policy_holder_last_name: lastName,
        },
      });
  
      // Associate the new holder with the chosen policy.
      await db.policyHolderPolicy.create({
        data: {
          policy_holder_id: createdHolder.policy_holder_id,
          insurance_policy_id: policy,
        },
      });
  
      redirect(`/customers/update?success=Created new holder with chosen policy`);
    }
  
    // 3. If the email in the database is different from the submitted email, update it.
    if (existingHolder.policy_holder_email !== email) {
      await db.policyHolder.update({
        where: { policy_holder_id: id },
        data: { policy_holder_email: email },
      });
    }
  
    // 4. Check if the selected policy already exists for this policy holder.
    const holderPolicies = existingHolder?.policies || [];
    const existingPolicyRelation = holderPolicies.find(
      (rel) => rel.insurance_policy_id === policy
    );
  
    if (existingPolicyRelation) {
      // Build a detailed error message with the type_of_policy.
      const policyType = existingPolicyRelation.insurancePolicy.type_of_policy;
      const errorMsg = `${policyType} policy already exists for this policy holder.`;
      const errors = JSON.stringify({ policy: [errorMsg] });
      redirect(`/customers/update?errors=${encodeURIComponent(errors)}`);
    } else {
      // Otherwise, associate the new policy.
      await db.policyHolderPolicy.create({
        data: {
          policy_holder_id: id,
          insurance_policy_id: policy,
        },
      });
    }
  
    // 5. Optionally update first name and last name if they've changed.
    if (
      existingHolder.policy_holder_first_name !== firstName ||
      existingHolder.policy_holder_last_name !== lastName
    ) {
      await db.policyHolder.update({
        where: { policy_holder_id: id },
        data: {
          policy_holder_first_name: firstName,
          policy_holder_last_name: lastName,
        },
      });
    }
  
    // 6. Redirect with a success or reset parameter.
    redirect(`/customers/update?success=Details updated at ${Date.now()}`);
  }