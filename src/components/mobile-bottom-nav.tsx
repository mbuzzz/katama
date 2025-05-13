
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon } from "lucide-react"; 

interface AppBottomNavProps {
  navItems: SidebarNavItem[]; 
}

export function AppBottomNav({ navItems }: AppBottomNavProps) {
  const pathname = usePathname();

  // Define specific hrefs for the main bottom navigation items
  const mainItemHrefs = [
    "/dashboard",
    "/dashboard/pos",
    "/dashboard/products",
  ];

  const bottomNavItems = mainItemHrefs
    .map(href => navItems.find(item => item.href === href))
    .filter(item => item !== undefined) as SidebarNavItem[];

  // Define hrefs that would make the "More" button active
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
  const moreItemActive = morePageCandidateHrefs.some(href => pathname.startsWith(href));
  // Ensure that if one of the main bottomNavItems is active, "More" is not also marked active,
  // unless the active path *is* one of the morePageCandidateHrefs and *not* one of the mainItemHrefs.
  const isMainItemActive = bottomNavItems.some(item => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));


  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 items-center px-2">
        {bottomNavItems.map((item) => {
          if (!item.href) return null;
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && !item.items);

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
              <span className="text-[10px] leading-tight tracking-tight font-medium truncate max-w-[70px]">{item.title}</span>
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
