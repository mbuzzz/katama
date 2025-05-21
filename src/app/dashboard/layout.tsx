
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
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [filteredSidebarNav, setFilteredSidebarNav] = React.useState<SidebarNavItem[]>(siteConfig.sidebarNav);


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
      
      const currentIsSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
      setIsSuperAdmin(currentIsSuperAdmin);

      // Filter sidebar nav items based on superadmin status
      if (!currentIsSuperAdmin) {
        setFilteredSidebarNav(siteConfig.sidebarNav.filter(item => item.href !== `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL || '/dashboard'}/admin/overview`));
      } else {
        setFilteredSidebarNav(siteConfig.sidebarNav);
      }


      const handleStorageChange = (event: StorageEvent | CustomEvent) => {
        if (event instanceof StorageEvent) {
          if (event.key === LOGO_STORAGE_KEY) {
            setCustomLogoUrl(event.newValue);
          }
          if (event.key === COMPANY_NAME_STORAGE_KEY) {
            setCompanyName(event.newValue || DEFAULT_COMPANY_NAME);
          }
          if (event.key === 'isSuperAdmin') {
            const newIsSuperAdmin = event.newValue === 'true';
            setIsSuperAdmin(newIsSuperAdmin);
            if (!newIsSuperAdmin) {
                setFilteredSidebarNav(siteConfig.sidebarNav.filter(item => item.href !== `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL || '/dashboard'}/admin/overview`));
            } else {
                setFilteredSidebarNav(siteConfig.sidebarNav);
            }
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
    localStorage.removeItem('isSuperAdmin'); // Remove superadmin flag
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
            {filteredSidebarNav.map((item, index) => (
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
    () => item.items?.some(subItem => pathname?.startsWith(subItem.href)) || false
  );

  React.useEffect(() => {
    const shouldBeOpen = item.items?.some(subItem => pathname?.startsWith(subItem.href)) || false;
    if (shouldBeOpen !== isSubmenuOpen) {
        setIsSubmenuOpen(shouldBeOpen);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, item.items, isSubmenuOpen]); // isSubmenuOpen added to dep array

  const isActive = item.href && pathname === item.href;
  
  let isParentActive = false;
  if (item.href && item.items && item.items.length > 0) {
    isParentActive = pathname?.startsWith(item.href) || item.items.some(subItem => pathname?.startsWith(subItem.href));
  } else if (item.href) {
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
          className={cn(
            "justify-between",
            isParentActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          )}
          isActive={!!isParentActive} // This sets data-active for internal styling (e.g. accent)
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
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);


  React.useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
        const currentIsSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
        setIsSuperAdmin(currentIsSuperAdmin);

        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === 'isSuperAdmin') {
            setIsSuperAdmin(event.newValue === 'true');
          }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);


  React.useEffect(() => {
    const handleCompanySwitch = (event: Event) => {
      const customEvent = event as CustomEvent<{ companyId: string, companyName: string }>;
      setActiveCompanyName(customEvent.detail.companyName);
    };

    // Initial load of company name if already set
    const initialCompanyId = localStorage.getItem('katama-pos-selectedCompanyId');
    if (initialCompanyId) {
        const companyData = getMockCompanyById(initialCompanyId); 
        if (companyData) {
            setActiveCompanyName(companyData.name);
        }
    }


    window.addEventListener('companySwitched', handleCompanySwitch);
    return () => {
      window.removeEventListener('companySwitched', handleCompanySwitch);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('katama-pos-active-session');
    localStorage.removeItem('katama-pos-selectedCompanyId');
    localStorage.removeItem('isSuperAdmin'); // Remove superadmin flag
    
    toast({
      title: "Keluar Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    router.push("/login"); 
  };

  if (!hasMounted) {
    // Return a simplified header or null during SSR to avoid hydration mismatch
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
        {/* Placeholder content */}
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      {isMobile ? (
         <div className="w-5 h-5 md:hidden"></div> 
      ) : (
         <SidebarTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Toggle Sidebar">
            <MenuIconLucide className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      )}

      {!isMobile && isSuperAdmin && <CompanySwitcher />}
      
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

// Helper to get company details by ID, as CompanySwitcher might not always be mounted.
// This function can be moved to a utils file if needed elsewhere.
function getMockCompanyById(companyId: string): { id: string; name: string } | null {
    // In a real app, this would fetch from a data source. For mock data:
    const companies = [ // This should ideally come from a shared data source like `src/data/companies.ts`
        { id: 'comp_es_teh_jaya', name: 'Perusahaan Es Teh Jaya' },
        { id: 'comp_kopi_maju', name: 'Kedai Kopi Maju Jaya' },
        { id: 'comp_roti_lezat', name: 'Toko Roti Lezat Selalu' },
    ];
    const company = companies.find(c => c.id === companyId);
    return company || null;
}

