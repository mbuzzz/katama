
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "@/config/site";
import { siteConfig } from "@/config/site"; // Import siteConfig
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

  // Define the hrefs for the main visible tabs in the bottom nav
  const mainTabHrefs = [
    "/dashboard",
    "/dashboard/pos",
    "/dashboard/products",
  ];

  // Get the actual SidebarNavItem objects for these main tabs
  const mainTabNavItems = mainTabHrefs
    .map(href => navItems.find(item => item.href === href))
    .filter(item => item !== undefined) as SidebarNavItem[];

  let isAnyMainTabActive = false;
  const activeStatesForMainTabs: { [href: string]: boolean } = {};

  mainTabNavItems.forEach(item => {
    if (!item.href) return;
    let isActive = false;
    if (item.href === "/dashboard") {
      isActive = pathname === item.href;
    } else if (item.href === "/dashboard/pos") {
      isActive = pathname.startsWith(item.href);
    } else if (item.href === "/dashboard/products") {
      // "Produk" section includes its main href and all its sub-item hrefs
      const productMainHref = item.href; // e.g., /dashboard/products
      const productSubItemHrefs = item.items?.map(sub => sub.href).filter(Boolean) as string[] || [];
      
      // isActive if pathname starts with the main product href, OR any of its defined sub-item hrefs
      if (pathname.startsWith(productMainHref)) {
        isActive = true;
      } else {
        isActive = productSubItemHrefs.some(subHref => pathname.startsWith(subHref));
      }
    }
    activeStatesForMainTabs[item.href] = isActive;
    if (isActive) {
      isAnyMainTabActive = true;
    }
  });

  // "Lainnya" (More) tab is active if no main tab is active
  const isMoreTabActive = !isAnyMainTabActive;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 items-center px-2">
        {mainTabNavItems.map((item) => {
          if (!item.href) return null;
          const Icon = item.icon;
          const isActive = activeStatesForMainTabs[item.href] || false;

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
        
        {/* "Lainnya" (More) Tab */}
        <Link
            href="/dashboard/settings" // "More" button links to settings page
            className={cn(
                "flex h-full flex-col items-center justify-center gap-1 rounded-md p-1 text-center transition-colors",
                isMoreTabActive
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
