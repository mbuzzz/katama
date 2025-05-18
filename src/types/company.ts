
export interface Company {
  id: string;
  name: string;
  // Future properties: logoUrl, themeSettings, subscriptionStatus, ownerUserId, etc.
}

export interface CompanyFormData {
  name: string;
}
