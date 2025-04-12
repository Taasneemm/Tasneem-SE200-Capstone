// app/customers/update/page.tsx (example path)

import "@/globals.css";
import { db } from "@/db/index";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** 
 * Zod schema for PolicyHolder info plus selected policy ID.
 */
const customerSchema = z.object({
  id: z.string().nonempty("NRIC is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  policy: z.string().nonempty("Please select a policy"),
});

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

/**
 * Page Component that fetches InsurancePolicy records,
 * displays them in a single-select dropdown, and shows any validation errors.
 */
export default async function UpdatePolicyHolderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // 1. Fetch policies from the InsurancePolicy table.
  const policyRecords = await db.insurancePolicy.findMany();

  // 2. Parse error messages from query parameters, if provided.
  let errors: { [key: string]: string[] } | null = null;
  if (searchParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(searchParams.errors));
    } catch (err) {
      console.error("Error parsing errors:", err);
    }
  }

  // 3. Use the "reset" or "success" query parameter to force form remount.
  const formKey = searchParams.reset || searchParams.success || "default";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-sm rounded-md p-6">
        {/* Updated Heading & Subheading */}
        <h1 className="text-2xl font-bold mb-4">Update Policy Holder Details</h1>
        <p className="text-gray-600 mb-6">Add or change details</p>

        <form
          key={formKey}
          action={checkAndUpdatePolicyHolder}
          method="POST"
          autoComplete="off"
          className="space-y-6"
        >
          {/* NRIC Field (Primary Key) */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label htmlFor="id" className="w-20 text-sm font-medium text-gray-700">
                NRIC
              </label>
              <Input
                id="id"
                name="id"
                type="text"
                placeholder="S1234567A"
                defaultValue=""
                autoComplete="off"
                className="flex-1"
              />
            </div>
            {errors?.id && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.id[0]}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label htmlFor="email" className="w-20 text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jerry@email.com"
                defaultValue=""
                autoComplete="off"
                className="flex-1"
              />
            </div>
            {errors?.email && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.email[0]}</p>
            )}
          </div>

          {/* First Name Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label htmlFor="firstName" className="w-20 text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jerry"
                defaultValue=""
                autoComplete="off"
                className="flex-1"
              />
            </div>
            {errors?.firstName && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.firstName[0]}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label htmlFor="lastName" className="w-20 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Tan"
                defaultValue=""
                autoComplete="off"
                className="flex-1"
              />
            </div>
            {errors?.lastName && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.lastName[0]}</p>
            )}
          </div>

          {/* Policies Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-700">Policies</label>
              <Select name="policy">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select a policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Policies</SelectLabel>
                    {policyRecords.map((policy) => (
                      <SelectItem
                        key={policy.insurance_policy_id}
                        value={policy.insurance_policy_id}
                      >
                        {policy.type_of_policy}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {errors?.policy && (
              <p className="text-red-500 text-sm mt-1 w-40 mx-auto text-center">
                {errors.policy[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-32">
            <Button type="submit" variant="default" className="w-30">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
