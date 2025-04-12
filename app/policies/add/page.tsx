// app/policies/add/page.tsx
import "@/globals.css";
import { db } from "@/db/index";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

/** Define the Zod validation schema */
const policySchema = z.object({
  id: z.string().nonempty("ID is required"),
  name: z.string().nonempty("Name is required"),
  price: z
    .string()
    .nonempty("Price is required")
    .regex(/^\d+$/, "Price must be a number"),
  type: z.string().nonempty("Please select a policy type"),
});

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

/**
 * Page Component that renders the form.
 *
 * It reads error messages (if any) from searchParams and displays them.
 * It also uses the `reset` query parameter (if present) as a key for the form,
 * forcing a remount so that the fields are cleared.
 */
export default function AddPolicyForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Parse errors from query parameters if available.
  let errors: { [key: string]: string[] } | null = null;
  if (searchParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(searchParams.errors));
    } catch (err) {
      console.error("Error parsing errors:", err);
    }
  }
  
  // Use the "reset" query param (if any) as a key to force remounting.
  const formKey = searchParams.reset || "default";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[700px] bg-white shadow-sm rounded-md p-6">
        {/* Heading & Subheading */}
        <h1 className="text-3xl font-bold mb-2">Add Policy</h1>
        <p className="text-lg text-gray-600 mb-6">Add a new policy</p>

        {/* HTML Form with autoComplete off and a unique key */}
        <form
          key={formKey}
          action={checkAndCreatePolicy}
          method="POST"
          autoComplete="off"
          className="space-y-6"
        >
          {/* ID Field */}
          <div className="sm:flex sm:items-center sm:gap-4">
            <label
              htmlFor="id"
              className="sm:w-20 block text-lg font-semibold text-gray-700 mb-1 sm:mb-0"
            >
              ID
            </label>
            <div className="w-full">
              <Input
                id="id"
                name="id"
                placeholder="20A123"
                defaultValue=""
                autoComplete="off"
                className="w-full"
              />
              {errors?.id && (
                <p className="text-red-500 text-sm mt-1">{errors.id[0]}</p>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="sm:flex sm:items-center sm:gap-4">
            <label
              htmlFor="name"
              className="sm:w-20 block text-lg font-semibold text-gray-700 mb-1 sm:mb-0"
            >
              Name
            </label>
            <div className="w-full">
              <Input
                id="name"
                name="name"
                placeholder="Basic Health Coverage"
                defaultValue=""
                autoComplete="off"
                className="w-full"
              />
              {errors?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
              )}
            </div>
          </div>

          {/* Price Field */}
          <div className="sm:flex sm:items-center sm:gap-4">
            <label
              htmlFor="price"
              className="sm:w-20 block text-lg font-semibold text-gray-700 mb-1 sm:mb-0"
            >
              Price
            </label>
            <div className="w-full">
              <Input
                id="price"
                name="price"
                placeholder="15"
                defaultValue=""
                autoComplete="off"
                className="w-full"
              />
              {errors?.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
              )}
            </div>
          </div>

          {/* Type Field (Dropdown) */}
          <div className="sm:flex sm:items-center sm:gap-4">
            <label
              htmlFor="type"
              className="sm:w-20 block text-lg font-semibold text-gray-700 mb-1 sm:mb-0"
            >
              Type
            </label>
            <div className="flex-1">
              <Select name="type">
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Select a policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Policy Types</SelectLabel>
                    <SelectItem value="Health Insurance">
                      Health Insurance
                    </SelectItem>
                    <SelectItem value="Travel Insurance">
                      Travel Insurance
                    </SelectItem>
                    <SelectItem value="Life Insurance">
                      Life Insurance
                    </SelectItem>
                    <SelectItem value="Accident">Accident</SelectItem>
                    <SelectItem value="Investment-Linked">
                      Investment-Linked
                    </SelectItem>
                    <SelectItem value="Car Insurance">
                      Car Insurance
                    </SelectItem>
                    <SelectItem value="Property Insurance">
                      Property Insurance
                    </SelectItem>
                    <SelectItem value="Critical Illness">
                      Critical Illness
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type[0]}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-32">
            <Button type="submit" variant="default" className="text-lg">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
