
"use client"; // Keep this if any child or this component uses client features like hooks

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider, // Keep for useSidebar hook
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig, type SidebarNavItem } from "@/config/site";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Menu as MenuIconLucide, Bell, UserCircle, LogOut, ChevronDown, ChevronUp, Building } from 'lucide-react'; // Renamed Menu to avoid conflict
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AppBottomNav } from "@/components/mobile-bottom-nav";
import CompanySwitcher from "@/components/company-switcher"; // Import CompanySwitcher

const LOGO_STORAGE_KEY = 'katama-pos-custom-logo';
const COMPANY_NAME_STORAGE_KEY = 'katama-pos-company-name';
const DEFAULT_COMPANY_NAME = 'KATAMA';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen> {/* defaultOpen true for desktop */}
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <div className="flex min-h-screen w-full">
      {!isMobile && <AppSidebar />}

      <div className="flex flex-1 flex-col">
        <AppHeader />
        <SidebarInset className={cn(isMobile && "pb-20")}>
          <ScrollArea className="h-full">
            <div className="h-full p-4 md:p-6 lg:p-8">{children}</div>
          </ScrollArea>
        </SidebarInset>
      </div>
      {isMobile && <AppBottomNav navItems={siteConfig.sidebarNav} />}
    </div>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [customLogoUrl, setCustomLogoUrl] = React.useState<string | null>(null);
  const [companyName, setCompanyName] = React.useState<string>(DEFAULT_COMPANY_NAME);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const storedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
      if (storedLogo) {
        setCustomLogoUrl(storedLogo);
      }
      const storedCompanyName = localStorage.getItem(COMPANY_NAME_STORAGE_KEY);
      if (storedCompanyName) {
        setCompanyName(storedCompanyName);
      }

      const handleStorageChange = (event: StorageEvent | CustomEvent) => {
        if (event instanceof StorageEvent) {
          if (event.key === LOGO_STORAGE_KEY) {
            setCustomLogoUrl(event.newValue);
          }
          if (event.key === COMPANY_NAME_STORAGE_KEY) {
            setCompanyName(event.newValue || DEFAULT_COMPANY_NAME);
          }
        } else if (event instanceof CustomEvent) {
          if (event.type === 'logoChanged') {
            setCustomLogoUrl((event as CustomEvent<string>).detail);
          }
          if (event.type === 'companyNameChanged') {
            setCompanyName((event as CustomEvent<string>).detail || DEFAULT_COMPANY_NAME);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('logoChanged', handleStorageChange as EventListener);
      window.addEventListener('companyNameChanged', handleStorageChange as EventListener);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('logoChanged', handleStorageChange as EventListener);
        window.removeEventListener('companyNameChanged', handleStorageChange as EventListener);
      };
    }
  }, []);

  const handleLogout = () => {
     // Clear sensitive localStorage items on logout
    localStorage.removeItem('katama-pos-active-session');
    localStorage.removeItem('katama-pos-selectedCompanyId');
    // Potentially other user-specific data
    
    toast({
      title: "Keluar Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    router.push("/login"); // Redirect to the new login page
  };

  if (!hasMounted) {
     // Return a placeholder or null during SSR to avoid hydration mismatch
    return (
       <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-center">
           <div className="flex items-center gap-2">
             {/* Placeholder for logo, ensure dimensions match */}
            <div className="h-8 w-24 bg-muted rounded"></div>
          </div>
        </SidebarHeader>
         <SidebarContent className="p-2">
           {/* Skeleton loaders for menu items */}
         </SidebarContent>
        <SidebarFooter className="p-4 border-t">
           {/* Placeholder for logout button */}
        </SidebarFooter>
      </Sidebar>
    );
  }


  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link href="/dashboard" className="flex items-center gap-2">
           <Logo customLogoUrl={customLogoUrl} companyName={companyName} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <ScrollArea className="h-full">
          <SidebarMenu>
            {siteConfig.sidebarNav.map((item, index) => (
              <NavItem key={index} item={item} pathname={pathname} />
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Keluar</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavItem({ item, pathname }: { item: SidebarNavItem; pathname: string | null }) {
  const { open, state } = useSidebar();
  const [isSubmenuOpen, setIsSubmenuOpen] = React.useState(
    item.items?.some(subItem => pathname?.startsWith(subItem.href)) || false
  );

  React.useEffect(() => {
    const shouldBeOpen = item.items?.some(subItem => pathname?.startsWith(subItem.href)) || false;
    if (shouldBeOpen !== isSubmenuOpen) {
      setIsSubmenuOpen(shouldBeOpen);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, item.items]);

  const isActive = item.href && pathname === item.href;
  
  let isParentActive = false;
  if (item.href && item.items && item.items.length > 0) {
    // A parent is active if the current path starts with its href,
    // OR if the current path matches any of its sub-items' hrefs.
    isParentActive = pathname?.startsWith(item.href) || item.items.some(subItem => pathname?.startsWith(subItem.href));
  } else if (item.href) {
    // For items without sub-items, active state is a direct match.
    isParentActive = isActive;
  }


  const toggleSubmenu = () => {
    if (item.items) {
      setIsSubmenuOpen(!isSubmenuOpen);
    }
  };

  if (item.items && item.items.length > 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={toggleSubmenu}
          className="justify-between"
          isActive={!!isParentActive}
          tooltip={item.title}
        >
          <div className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
          </div>
          {state === "expanded" && (isSubmenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
        </SidebarMenuButton>
        {isSubmenuOpen && open && (
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.href}>
                <Link href={subItem.href} legacyBehavior passHref>
                  <SidebarMenuSubButton
                    isActive={pathname === subItem.href}
                     className={cn(pathname === subItem.href && "bg-sidebar-accent text-sidebar-accent-foreground")}
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </Link>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Link href={item.href || "#"} legacyBehavior passHref>
        <SidebarMenuButton
          isActive={!!isActive}
          tooltip={item.title}
          className={cn(isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90")}
        >
          <item.icon className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}


function AppHeader() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleCompanySwitch = (event: Event) => {
      const customEvent = event as CustomEvent<{ companyId: string, companyName: string }>;
      setActiveCompanyName(customEvent.detail.companyName);
    };

    // Initial load of company name if already set
    const initialCompanyId = localStorage.getItem('katama-pos-selectedCompanyId');
    if (initialCompanyId) {
        // This is a mock data example; in a real app, fetch company details by ID
        // For now, let's assume we can derive it or it was set by CompanySwitcher itself
        // This part can be improved if getMockCompanyById is accessible here or CompanySwitcher provides the name initially.
        // A simpler approach is to let CompanySwitcher manage the display, but to show it here:
        const companyData = localStorage.getItem(initialCompanyId); // Example, if you store company details
        if (companyData) {
            try {
                // const parsed = JSON.parse(companyData); // if you stored an object
                // setActiveCompanyName(parsed.name);
            } catch(e) { /* ignore */ }
        } else {
            // If only ID is stored, and name is needed, CompanySwitcher should provide it.
            // For now, a placeholder if just switched.
        }
    }


    window.addEventListener('companySwitched', handleCompanySwitch);
    return () => {
      window.removeEventListener('companySwitched', handleCompanySwitch);
    };
  }, []);

  const handleLogout = () => {
    // Clear sensitive localStorage items on logout
    localStorage.removeItem('katama-pos-active-session');
    localStorage.removeItem('katama-pos-selectedCompanyId');
    // Potentially other user-specific data
    
    toast({
      title: "Keluar Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    router.push("/login"); // Redirect to the new login page
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      {isMobile ? (
         <div className="w-5 h-5 md:hidden"></div> // Placeholder for mobile, consider title or actions
      ) : (
         <SidebarTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Toggle Sidebar">
            <MenuIconLucide className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      )}

      {!isMobile && <CompanySwitcher />} {/* Show CompanySwitcher on desktop */}
      
      {activeCompanyName && !isMobile && (
        <div className="ml-2 hidden items-center md:flex text-sm font-medium text-muted-foreground">
          <Building className="mr-1.5 h-4 w-4" />
          <span>{activeCompanyName}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Alihkan notifikasi</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/50x50.png" alt="Avatar Pengguna" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings/general')}>Pengaturan</DropdownMenuItem>
            <DropdownMenuItem>Dukungan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

