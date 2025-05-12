import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Revenue", value: "Rp 12,345,000", icon: DollarSign, change: "+12.5%" },
    { title: "New Customers", value: "120", icon: Users, change: "+5.2%" },
    { title: "Total Orders", value: "850", icon: ShoppingCart, change: "+8.1%" },
    { title: "Products in Stock", value: "2,300", icon: Package, change: "-1.5%" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Selamat datang di TokoLite POS Anda." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sales chart will be displayed here.</p>
            {/* Placeholder for a chart */}
            <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center" data-ai-hint="sales chart">
              Chart Area
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">List of top selling products will be here.</p>
            {/* Placeholder for product list */}
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Product A</span><span>Rp 500,000</span></li>
              <li className="flex justify-between"><span>Product B</span><span>Rp 350,000</span></li>
              <li className="flex justify-between"><span>Product C</span><span>Rp 200,000</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
