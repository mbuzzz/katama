
"use client";

import * as React from "react";
import { getMockCompanies, getMockCompanyById, type Company } from "@/data/companies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { Label } from "@/components/ui/label";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function CompanySwitcher() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadedCompanies = getMockCompanies();
    setCompanies(loadedCompanies);

    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId && loadedCompanies.some(c => c.id === storedCompanyId)) {
      setSelectedCompanyId(storedCompanyId);
    } else if (loadedCompanies.length > 0) {
      // Default to the first company if nothing stored or stored ID is invalid
      const defaultCompanyId = loadedCompanies[0].id;
      setSelectedCompanyId(defaultCompanyId);
      localStorage.setItem(SELECTED_COMPANY_ID_KEY, defaultCompanyId);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (selectedCompanyId) {
      const company = getMockCompanyById(selectedCompanyId);
      if (company) {
        // Dispatch an event so other components (like AppHeader) can react
        window.dispatchEvent(new CustomEvent('companySwitched', {
          detail: { companyId: company.id, companyName: company.name }
        }));
      }
    }
  }, [selectedCompanyId]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    localStorage.setItem(SELECTED_COMPANY_ID_KEY, companyId);
  };

  if (isLoading || companies.length === 0) {
    return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>Memuat Perusahaan...</span>
        </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="company-switcher-select" className="text-sm text-muted-foreground hidden md:inline">
        Perusahaan Aktif:
      </Label>
      <Select
        value={selectedCompanyId}
        onValueChange={handleCompanyChange}
        disabled={companies.length <= 1}
      >
        <SelectTrigger id="company-switcher-select" className="h-8 w-[180px] sm:w-[220px] text-xs sm:text-sm bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary/20 focus:ring-sidebar-ring">
          <SelectValue placeholder="Pilih Perusahaan" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground">
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id} className="text-xs sm:text-sm">
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                {company.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
