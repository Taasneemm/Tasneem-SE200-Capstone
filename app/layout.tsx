"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import "@/app/globals.css";
import { Home, Wallet, Users2, LogOut } from "lucide-react";
import { signout } from "@/app/actions/signout";
import { checkSessObjDetail } from "@/app/actions/checkSessObjectDetail";

import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const [initial, setInitial] = useState("U");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (currentPath === "/" || currentPath === "/register") {
        setLoading(false);
        return;
      }

      try {
        const result = await checkSessObjDetail();

        if (!result?.isAuthenticated) {
          router.replace("/");
          return;
        }

        const name = result.session?.user?.name ?? "";
        const firstChar = name.charAt(0).toUpperCase() || "U";
        setInitial(firstChar);
      } catch (error) {
        console.error("Session check failed:", error);
        router.replace("/");
        return;
      }

      setLoading(false);
    };

    verifySession();
  }, [router, currentPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (currentPath === "/" || currentPath === "/register") {
    return (
      <html lang="en">
        <body className="min-h-screen">{children}</body>
      </html>
    );
  }

  const isActiveHome = () => ["/", "/dashboard"].includes(currentPath);
  const isActivePolicies = () => ["/policies", "/policies/add"].includes(currentPath);
  const isActiveCustomers = () =>
    ["/customers", "/customers/add", "/customers/update"].includes(currentPath);

  const baseClass =
    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8";
  const activeClass = "bg-accent text-black scale-110 shadow-md";
  const inactiveClass = "text-muted-foreground hover:text-foreground";

  return (
    <html lang="en">
      <body className="min-h-screen">
        <TooltipProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-[8%] bg-white p-4">
              <nav className="flex flex-col items-center gap-10 pl-4 py-36">
                {/* Home */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      className={`${baseClass} ${
                        isActiveHome() ? activeClass : inactiveClass
                      }`}
                    >
                      <Home
                        className={`transition-transform duration-200 ${
                          isActiveHome() ? "h-10 w-10" : "h-8 w-8"
                        }`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-black text-lg">
                    Home
                  </TooltipContent>
                </Tooltip>

                {/* Policies */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/policies"
                      className={`${baseClass} ${
                        isActivePolicies() ? activeClass : inactiveClass
                      }`}
                    >
                      <Wallet
                        className={`transition-transform duration-200 ${
                          isActivePolicies() ? "h-10 w-10" : "h-8 w-8"
                        }`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-black text-lg">
                    Policies
                  </TooltipContent>
                </Tooltip>

                {/* Customers */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/customers"
                      className={`${baseClass} ${
                        isActiveCustomers() ? activeClass : inactiveClass
                      }`}
                    >
                      <Users2
                        className={`transition-transform duration-200 ${
                          isActiveCustomers() ? "h-10 w-10" : "h-8 w-8"
                        }`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-black text-lg">
                    Customers
                  </TooltipContent>
                </Tooltip>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="relative w-[92%] bg-gray-200 p-4">
              {/* Avatar */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/path/to/image.jpg"
                        alt="User avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>{initial}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 w-64" sideOffset={12}>
                    <DropdownMenuLabel className="text-md text-left">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={signout} method="POST">
                        <button
                          type="submit"
                          className="text-md flex items-center gap-2 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Page Content */}
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
