
export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  companyId: string; // Added for SaaS multi-tenancy
}
