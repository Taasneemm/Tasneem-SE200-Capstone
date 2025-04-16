// app/customers/add/page.tsx

import "@/globals.css";
import { db } from "@/db/index";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Import auth to get session

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
 * Zod schema for basic PolicyHolder info plus selected policy ID.
 */
const customerSchema = z.object({
  id: z.string().nonempty("NRIC is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  policy: z.string().nonempty("Please select a policy"),
});

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

/**
 * Page Component that fetches InsurancePolicy records,
 * validates any errors from query parameters,
 * and renders the "Add Policy Holder" form.
 */
export default async function AddPolicyHolderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // 1. Get the current session.
  const session = await auth();
  if (!session) {
    // If no session is found, redirect to the home page.
    redirect("/");
  }

  // 2. Fetch policies from the InsurancePolicy table.
  const policyRecords = await db.insurancePolicy.findMany();

  // 3. Parse any error messages from the query parameters, if provided.
  let errors: { [key: string]: string[] } | null = null;
  if (searchParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(searchParams.errors));
    } catch (err) {
      console.error("Error parsing errors:", err);
    }
  }

  // 4. Use the "reset" query parameter as the key to force the form to remount.
  const formKey = searchParams.reset || "default";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-sm rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4">Add Policy Holder</h1>
        <p className="text-gray-600 mb-6">Add a new policy holder</p>

        <form
          key={formKey}
          action={checkAndCreatePolicyHolder}
          method="POST"
          autoComplete="off"
          className="space-y-6"
        >
          {/* NRIC Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label
                htmlFor="id"
                className="w-20 text-sm font-medium text-gray-700"
              >
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.id[0]}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label
                htmlFor="email"
                className="w-20 text-sm font-medium text-gray-700"
              >
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.email[0]}
              </p>
            )}
          </div>

          {/* First Name Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label
                htmlFor="firstName"
                className="w-20 text-sm font-medium text-gray-700"
              >
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.firstName[0]}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label
                htmlFor="lastName"
                className="w-20 text-sm font-medium text-gray-700"
              >
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
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.lastName[0]}
              </p>
            )}
          </div>

          {/* Policies Field */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-700">
                Policies
              </label>
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
