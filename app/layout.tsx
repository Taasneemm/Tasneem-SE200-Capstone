"use client"

import Link from "next/link"
import { usePathname } from "next/navigation" // App Router import
import { Home, Wallet, Users2, LogOut } from "lucide-react"
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentPath = usePathname()

  // Helper functions to determine if a navigation item should be active
  const isActiveHome = () => currentPath === "/"
  const isActivePolicies = () =>
    ["/policies", "/policies/add"].includes(currentPath)
  const isActiveCustomers = () =>
    ["/customers", "/customers/add", "/customers/update"].includes(currentPath)

  // Styles for active and non-active links
  const baseClass =
    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
  const activeClass =
    "bg-accent text-black scale-110 shadow-md" // extra scale and shadow for active icon
  const inactiveClass = "text-muted-foreground hover:text-foreground"

  return (
    <html lang="en">
      <body className="min-h-screen">
        <TooltipProvider>
          <div className="flex min-h-screen">
            {/* Left Column (8% width, white background) */}
            <aside className="w-[8%] bg-white p-4">
              <nav className="flex flex-col items-center gap-10 pl-4 py-36">
                {/* Home Navigation */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
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

            {/* Right Column (92% width, light grey background) */}
            <main className="relative w-[92%] bg-gray-200 p-4">
              {/* Top-right container for the avatar dropdown menu */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-12 w-12">
                      {/* Replace /path/to/image.jpg with your actual image path */}
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
                    <DropdownMenuItem className="text-md flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Page content from child components */}
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
