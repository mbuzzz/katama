
export interface HeroSectionSettings {
  title: string;
  description: string;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
}

export interface FeatureItem {
  iconName: string; // Placeholder for icon selection logic later
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceSuffix: string;
  features: string[];
  ctaButtonText: string;
  isPopular?: boolean;
}

export interface LandingPageSettings {
  hero: HeroSectionSettings;
  featuresSectionTitle: string;
  features: FeatureItem[];
  pricingSectionTitle: string;
  pricingPlans: PricingPlan[];
  footerTextLine1: string;
  footerTextLine2: string;
  creatorCredit?: string; // New field for creator credit
}
