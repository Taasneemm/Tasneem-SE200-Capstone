import "@/app/globals.css";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Import auth to check for session

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AllInsurancePolicyPage({
  searchParams,
}: {
  searchParams: { offset?: string };
}) {
  // Check for a valid session.
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  // Determine the current offset from the query string (default to 0)
  const offset = parseInt(searchParams?.offset ?? "0", 10);
  const policiesPerPage = 5;

  // Fetch the current page records using pagination parameters
  const insuranceDetails = await db.insurancePolicy.findMany({
    skip: offset,
    take: policiesPerPage,
  });

  // Get total number of policies from the DB for pagination logic
  const totalPolicies = await db.insurancePolicy.count();

  // Calculate previous and next offsets.
  const prevOffset = Math.max(offset - policiesPerPage, 0);
  const nextOffset = offset + policiesPerPage;

  return (
    <>
      {/* "Add Policy" button wrapped in a Link to redirect to /policies/add */}
      <div className="mt-8 ml-4">
        <Link href="/policies/add" passHref legacyBehavior>
          <Button
            type="button"
            variant="default"
            className="bg-black text-white text-lg h-15 w-60 flex items-center justify-center gap-2"
          >
            <CirclePlus className="!w-7 !h-7" />
            Add Policy
          </Button>
        </Link>
      </div>

      {/* Unified Container for heading, subheading and table */}
      <div className="mt-8 mx-4 bg-white shadow-sm rounded-md p-4">
        {/* Heading & Subheading */}
        <h2 className="text-3xl font-bold">Insurance Policies</h2>
        <p className="text-lg text-gray-600 mb-4">
          Critical details of insurance policies
        </p>

        {/* Table */}
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Base Price (SGD)</TableHead>
              <TableHead>Type of Policy</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {insuranceDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No insurance policy record found
                </TableCell>
              </TableRow>
            ) : (
              insuranceDetails.map((policy) => (
                <TableRow key={policy.insurance_policy_id}>
                  <TableCell>{policy.insurance_policy_id}</TableCell>
                  <TableCell>{policy.insurance_policy_name}</TableCell>
                  <TableCell>{policy.base_price_sgd.toString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {policy.type_of_policy}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* Table Footer with Pagination */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  {/* Pagination Summary Text */}
                  <p>
                    {totalPolicies === 0
                      ? "Showing 0–0 of 0 policies"
                      : `Showing ${offset + 1}–${Math.min(
                          offset + policiesPerPage,
                          totalPolicies
                        )} of ${totalPolicies} policies`}
                  </p>

                  {/* Prev & Next Buttons */}
                  <div className="flex space-x-2 mr-2">
                    {offset > 0 ? (
                      <Button variant="ghost" size="sm" type="button" asChild>
                        <Link href={`?offset=${prevOffset}`}>
                          <>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Prev
                          </>
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" type="button" disabled>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Prev
                      </Button>
                    )}

                    {offset + policiesPerPage < totalPolicies ? (
                      <Button variant="ghost" size="sm" type="button" asChild>
                        <Link href={`?offset=${nextOffset}`}>
                          <>
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" type="button" disabled>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
