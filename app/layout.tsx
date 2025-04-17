// app/layout.tsx
"use client";

import "@/app/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Users2, LogOut } from "lucide-react";
import { signout } from "@/app/actions/signout"; // Import the signout action
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
  const currentPath = usePathname();

  // Minimal layout for the "/" or "/register" routes.
  if (currentPath === "/" || currentPath === "/register") {
    return (
      <html lang="en">
        <body className="min-h-screen">{children}</body>
      </html>
    );
  }

  // Helper functions for active navigation items
  const isActiveHome = () => currentPath === "/";
  const isActivePolicies = () =>
    ["/policies", "/policies/add"].includes(currentPath);
  const isActiveCustomers = () =>
    ["/customers", "/customers/add", "/customers/update"].includes(currentPath);

  // Base styling for the navigation links
  const baseClass =
    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8";
  const activeClass = "bg-accent text-black scale-110 shadow-md";
  const inactiveClass = "text-muted-foreground hover:text-foreground";

  return (
    <html lang="en">
      <body className="min-h-screen">
        <TooltipProvider>
          <div className="flex min-h-screen">
            {/* Left Column (Navigation) */}
            <aside className="w-[8%] bg-white p-4">
              <nav className="flex flex-col items-center gap-10 pl-4 py-36">
                {/* Home Navigation */}
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

                {/* Policies Navigation */}
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

                {/* Customers Navigation */}
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

            {/* Right Column (Main Content) */}
            <main className="relative w-[92%] bg-gray-200 p-4">
              {/* Top-right container for the avatar dropdown menu */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/path/to/image.jpg"
                        alt="User avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 w-64" sideOffset={12}>
                    <DropdownMenuLabel className="text-md text-left">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Wrap the logout item in a form that calls the signout server action */}
                    <DropdownMenuItem asChild>
                      <form action={signout} method="POST">
                        <button type="submit" className="text-md flex items-center gap-2 w-full">
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Render child content */}
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
