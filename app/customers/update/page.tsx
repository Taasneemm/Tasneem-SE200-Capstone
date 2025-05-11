/* 
this tells next.js vercel deployment not to statically render this page
at build time, instead to render it dynamically as
per request.
*/
export const dynamic = "force-dynamic";

import "@/app/globals.css";
import { db } from "@/db/index";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth"; // <-- Import auth to check for session

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
import { checkAndUpdatePolicyHolder } from "@/app/actions/checkAndUpdatePolicyHolder"

/**
 * Page Component that fetches InsurancePolicy records,
 * displays them in a dropdown, and shows any validation errors.
 */
export default async function UpdatePolicyHolderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Check current session.
  const session = await auth();
  if (!session) {
    redirect("/");
  }

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
