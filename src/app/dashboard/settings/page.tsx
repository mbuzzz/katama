import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const settingsNav = siteConfig.sidebarNav.find(item => item.href === "/dashboard/settings");

  return (
    <div>
      <PageHeader title="Pengaturan" description="Konfigurasi aplikasi dan data bisnis Anda." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsNav?.items?.map((item) => (
          <Link href={item.href} key={item.title} legacyBehavior>
            <a className="block hover:no-underline">
              <Card className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  {item.icon && <item.icon className="h-6 w-6 text-muted-foreground" />}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                 <CardContent className="pt-0">
                   <div className="text-sm font-medium text-primary flex items-center">
                    Buka Pengaturan <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
