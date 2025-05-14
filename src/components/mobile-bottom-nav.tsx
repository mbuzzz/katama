
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon } from "lucide-react"; 

interface AppBottomNavProps {
  navItems: SidebarNavItem[]; 
}

// Helper function to get shorter titles for specific bottom nav items
const getShortTitle = (href: string, defaultTitle: string): string => {
  if (href === "/dashboard/pos") return "POS";
  if (href === "/dashboard/products") return "Produk";
  return defaultTitle;
};

export function AppBottomNav({ navItems }: AppBottomNavProps) {
  const pathname = usePathname();

  const mainItemHrefs = [
    "/dashboard",
    "/dashboard/pos",
    "/dashboard/products",
  ];

  const bottomNavItems = mainItemHrefs
    .map(href => navItems.find(item => item.href === href))
    .filter(item => item !== undefined) as SidebarNavItem[];

  const morePageCandidateHrefs = [
    "/dashboard/settings", 
    "/dashboard/reports", 
    "/dashboard/shifts", 
    "/dashboard/purchases",
    "/dashboard/categories",
    "/dashboard/raw-materials",
    "/dashboard/units"
    // Add any other hrefs that should activate the "More" button
  ];
  
  // Determine if any of the main bottom nav items are active
  const isMainItemActive = bottomNavItems.some(item => {
    if (!item.href) return false;
    // The main "/dashboard" item is only active on its exact path
    if (item.href === "/dashboard") {
      return pathname === item.href;
    }
    // Other main items are active if the current path starts with their href
    return pathname.startsWith(item.href);
  });

  // Determine if the current path is one of the "More" section pages
  const moreItemActive = morePageCandidateHrefs.some(href => pathname.startsWith(href));


  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 items-center px-2">
        {bottomNavItems.map((item) => {
          if (!item.href) return null;
          const Icon = item.icon;
          
          // Corrected active state logic for individual main items
          let isActive: boolean;
          if (item.href === "/dashboard") {
            isActive = pathname === item.href;
          } else {
            isActive = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 rounded-md p-1 text-center transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                item.disabled && "pointer-events-none opacity-50"
              )}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-tight tracking-tight font-medium truncate max-w-[70px]">
                {getShortTitle(item.href, item.title)}
              </span>
            </Link>
          );
        })}
        
        <Link
            href="/dashboard/settings" // "More" button links to settings page
            className={cn(
                "flex h-full flex-col items-center justify-center gap-1 rounded-md p-1 text-center transition-colors",
                moreItemActive && !isMainItemActive 
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="text-[10px] leading-tight tracking-tight font-medium">Lainnya</span>
        </Link>
      </div>
    </nav>
  );
}
