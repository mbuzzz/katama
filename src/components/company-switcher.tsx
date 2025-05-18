
"use client";

import * as React from "react";
import { getMockCompanies, getMockCompanyById, type Company } from "@/data/companies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function CompanySwitcher() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const loadAndSetCompanies = React.useCallback(() => {
    const loadedCompanies = getMockCompanies();
    setCompanies(loadedCompanies);
    setIsLoading(false);

    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    let currentCompanyId = selectedCompanyId;

    if (loadedCompanies.length === 0) {
      setSelectedCompanyId(undefined);
      localStorage.removeItem(SELECTED_COMPANY_ID_KEY);
      currentCompanyId = undefined;
    } else if (storedCompanyId && loadedCompanies.some(c => c.id === storedCompanyId)) {
      setSelectedCompanyId(storedCompanyId);
      currentCompanyId = storedCompanyId;
    } else {
      const defaultCompanyId = loadedCompanies[0].id;
      setSelectedCompanyId(defaultCompanyId);
      localStorage.setItem(SELECTED_COMPANY_ID_KEY, defaultCompanyId);
      currentCompanyId = defaultCompanyId;
    }
    
    // Dispatch event with the determined company ID
    if (currentCompanyId) {
      const company = getMockCompanyById(currentCompanyId);
      if (company) {
        window.dispatchEvent(new CustomEvent('companySwitched', {
          detail: { companyId: company.id, companyName: company.name }
        }));
      }
    } else {
        // No company selected or available
         window.dispatchEvent(new CustomEvent('companySwitched', {
          detail: { companyId: null, companyName: "Tidak Ada Perusahaan" }
        }));
    }

  }, [selectedCompanyId]); // Include selectedCompanyId as dependency to re-evaluate on its change too

  React.useEffect(() => {
    loadAndSetCompanies(); // Initial load

    // Listen for changes from company CRUD operations
    window.addEventListener('companyListChanged', loadAndSetCompanies);
    return () => {
      window.removeEventListener('companyListChanged', loadAndSetCompanies);
    };
  }, [loadAndSetCompanies]);


  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    localStorage.setItem(SELECTED_COMPANY_ID_KEY, companyId);
    const company = getMockCompanyById(companyId);
    if (company) {
      window.dispatchEvent(new CustomEvent('companySwitched', {
        detail: { companyId: company.id, companyName: company.name }
      }));
    }
    router.refresh(); // Refresh the page to ensure all data reflects the new company
  };

  if (isLoading) {
    return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4 animate-pulse" />
            <span>Memuat...</span>
        </div>
    );
  }
  
  if (companies.length === 0) {
    return (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>Belum Ada Perusahaan</span>
        </div>
    );
  }


  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="company-switcher-select" className="text-sm text-muted-foreground hidden md:inline">
        Perusahaan Aktif:
      </Label>
      <Select
        value={selectedCompanyId || ""}
        onValueChange={handleCompanyChange}
        disabled={companies.length === 0}
      >
        <SelectTrigger 
            id="company-switcher-select" 
            className="h-8 w-[180px] sm:w-[220px] text-xs sm:text-sm bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary/20 focus:ring-sidebar-ring"
            aria-label="Pilih perusahaan aktif"
        >
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
           {companies.length === 0 && (
            <div className="p-2 text-xs text-muted-foreground text-center">Belum ada perusahaan.</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
