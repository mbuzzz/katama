
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Package, BarChart3, Settings, Users, ShoppingCartIcon, Briefcase } from "lucide-react";
import { getMockLandingPageSettings } from "@/data/landing-page-settings";
import type { FeatureItem } from "@/types/landing-page";

// Helper untuk memetakan nama ikon ke komponen Lucide
const iconMap: { [key: string]: React.ElementType } = {
  ShoppingCart: ShoppingCartIcon,
  Package: Package,
  BarChart3: BarChart3,
  Users: Users,
  Settings: Settings,
  Briefcase: Briefcase,
};

export default function LandingPage() {
  const settings = getMockLandingPageSettings();

  return (
    <div className="flex flex-col min-h-screen items-center bg-gradient-to-br from-background to-blue-100 dark:to-blue-900/30">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
        <Logo className="h-10 w-auto" companyName="KATAMA" />
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="#fitur">Fitur</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#harga">Harga</Link>
          </Button>
          <Button asChild>
            <Link href={settings.hero.ctaButton1Link}>{settings.hero.ctaButton1Text}</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <Logo className="h-24 w-auto mb-6 md:mb-8 animate-pulse" companyName="KATAMA" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 md:mb-6">
          {settings.hero.title}
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 mb-8 md:mb-10 max-w-3xl">
          {settings.hero.description}
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href={settings.hero.ctaButton1Link}>{settings.hero.ctaButton1Text}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href={settings.hero.ctaButton2Link}>{settings.hero.ctaButton2Text}</Link>
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section id="fitur" className="w-full py-16 px-6 md:px-12 bg-card">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">{settings.featuresSectionTitle}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {settings.features.map((item: FeatureItem) => {
            const IconComponent = iconMap[item.iconName] || Package; // Default to Package if icon not found
            return (
              <div key={item.title} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow bg-background">
                <div className="flex justify-center mb-4"><IconComponent className="h-10 w-10 text-accent" /></div>
                <h3 className="text-xl font-semibold mb-2 text-center text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="harga" className="w-full py-16 px-6 md:px-12 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">{settings.pricingSectionTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {settings.pricingPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`border p-8 rounded-lg shadow-lg bg-card text-center ${plan.isPopular ? 'border-2 border-primary relative shadow-2xl' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Populer</div>
              )}
              <h3 className={`text-2xl font-semibold mb-4 ${plan.isPopular ? 'text-primary' : 'text-accent'}`}>{plan.name}</h3>
              <p className="text-4xl font-bold mb-2">{plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.priceSuffix}</span></p>
              <ul className="text-left space-y-2 my-6 text-muted-foreground text-sm">
                {plan.features.map(feature => <li key={feature}>{feature}</li>)}
              </ul>
              <Button size="lg" className="w-full" variant={plan.name === "Enterprise" ? "outline" : "default"}>
                {plan.ctaButtonText}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 text-center text-muted-foreground bg-card border-t">
        <p>{settings.footerTextLine1}</p>
        <p className="text-xs mt-1">{settings.footerTextLine2}</p>
      </footer>
    </div>
  );
}
