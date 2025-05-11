/* 
this tells next.js vercel deployment not to statically render this page
at build time, instead to render it dynamically as
per request.
*/
export const dynamic = "force-dynamic";

import "@/app/globals.css";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Import auth to check for session

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus, ChevronLeft, ChevronRight, Edit } from "lucide-react";
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
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default async function AllPolicyHoldersPage({
  searchParams,
}: {
  searchParams: { offset?: string };
}) {
  // Check the current session.
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  // Determine the current offset from the query string (default to 0)
  const offset = parseInt(searchParams?.offset ?? "0", 10);
  const holdersPerPage = 5;

  // Fetch policy holders with their joined insurance policies.
  const policyHolders = await db.policyHolder.findMany({
    skip: offset,
    take: holdersPerPage,
    include: {
      policies: {
        include: {
          insurancePolicy: true,
        },
      },
    },
  });

  // Count total policy holders.
  const totalHolders = await db.policyHolder.count();

  // Calculate previous and next offsets.
  const prevOffset = Math.max(offset - holdersPerPage, 0);
  const nextOffset = offset + holdersPerPage;

  return (
    <>
      {/* Container for the two primary buttons */}
      <div className="flex items-center gap-4 mt-8 ml-4">
        {/* "Add Policy Holder" button */}
        <Link href="/customers/add">
          <Button
            asChild
            type="button"
            variant="default"
            className="bg-black text-white text-lg h-15 w-60 flex items-center justify-center gap-2"
          >
            <span className="inline-flex items-center gap-2">
              <CirclePlus className="!w-7 !h-7" />
              Add Policy Holder
            </span>
          </Button>
        </Link>

        {/* "Update Policy Holder" button */}
        <Link href="/customers/update">
          <Button
            asChild
            type="button"
            variant="default"
            className="bg-black text-white text-lg h-15 w-60 flex items-center justify-center gap-2"
          >
            <span className="inline-flex items-center gap-2">
              <Edit className="!w-7 !h-7" />
              Update Policy Holder
            </span>
          </Button>
        </Link>
      </div>

      {/* Container for heading, subheading, and table */}
      <div className="mt-8 mx-4 bg-white shadow-sm rounded-md p-4">
        {/* Heading & Subheading */}
        <h2 className="text-3xl font-bold">Policy Holders</h2>
        <p className="text-lg text-gray-600 mb-4">
          Personal details of all policy holders
        </p>

        {/* Table */}
        <Table>
          {/* Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead>NRIC</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Policies Held</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {policyHolders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No policy holder record found
                </TableCell>
              </TableRow>
            ) : (
              policyHolders.map((holder) => (
                <TableRow key={holder.policy_holder_id}>
                  <TableCell>{holder.policy_holder_id}</TableCell>
                  <TableCell>{holder.policy_holder_email}</TableCell>
                  <TableCell>{holder.policy_holder_first_name}</TableCell>
                  <TableCell>{holder.policy_holder_last_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {holder.policies.map((relation) => (
                        <Badge
                          variant="outline"
                          key={relation.insurancePolicy.insurance_policy_id}
                        >
                          {relation.insurancePolicy.insurance_policy_name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          {/* Table Footer with Pagination */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p>
                    Showing {policyHolders.length > 0 ? offset + 1 : 0}–
                    {Math.min(offset + holdersPerPage, totalHolders)} of {totalHolders} policy holders
                  </p>
                  <div className="flex space-x-2 mr-2">
                    {/* Prev Button */}
                    {offset > 0 ? (
                      <Button variant="ghost" size="sm" type="button" asChild>
                        <Link href={`?offset=${prevOffset}`}>
                          <span className="inline-flex items-center">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Prev
                          </span>
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" type="button" disabled>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Prev
                      </Button>
                    )}

                    {/* Next Button */}
                    {offset + holdersPerPage < totalHolders ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        asChild
                        className="hover:bg-gray-100"
                      >
                        <Link href={`?offset=${nextOffset}`}>
                          <span className="inline-flex items-center">
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </span>
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
