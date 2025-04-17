// app/(app)/examples/dashboard/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { checkSubscriptionAmtFrmDB } from "@/app/actions/checkSubscriptionAmtDB";
import { checkTotlRevOfPolciesFrmDB } from "@/app/actions/checkTotalRevOfPolicyFrmDB";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  RevenueIcon,
  SubscriptionIcon,
} from "@/components/icons/dashboard-icons";

import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Overview } from "@/components/ui/overview";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const subscriptionResult = await checkSubscriptionAmtFrmDB();
  const revenueResult = await checkTotlRevOfPolciesFrmDB();

  const subscriptionCount = subscriptionResult?.count ?? 0;
  const totalRevenue = revenueResult?.totalRevenue ?? 0;

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* User Name Badge */}
      <div className="px-8">
        <Badge variant="secondary" className="text-3xl">
          {session.user.name}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
            <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
            <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {/* Total Revenue Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <RevenueIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue}</div>
                </CardContent>
              </Card>

              {/* Subscriptions Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                  <SubscriptionIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscriptionCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Overview Chart */}
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
