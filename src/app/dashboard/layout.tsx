
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import {
  SidebarProvider,
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
import { Menu, Bell, UserCircle, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast"; // Added useToast

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <SidebarInset>
            <ScrollArea className="h-full">
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </ScrollArea>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing session, calling API)
    toast({
      title: "Keluar Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    router.push("/"); // Redirect to login page
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
           <Logo />
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

  const isActive = item.href && pathname === item.href;
  const isParentActive = item.items?.some(subItem => pathname?.startsWith(subItem.href));

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
          isActive={isParentActive}
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
                    {/* <subItem.icon className="h-4 w-4" /> */}
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
          isActive={isActive}
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

  const handleLogout = () => {
    toast({
      title: "Keluar Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      {isMobile && <SidebarTrigger asChild><Button size="icon" variant="outline"><Menu className="h-5 w-5" /></Button></SidebarTrigger>}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Alihkan notifikasi</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/50/50" alt="Avatar Pengguna" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
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

