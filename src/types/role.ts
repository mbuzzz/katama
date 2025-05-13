
export interface RolePermission {
  feature: string; // e.g., "products", "pos", "reports.sales"
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  // permissions?: RolePermission[]; // For future detailed permissions, keep simple for now
  userCount?: number; // This would typically be derived, but mock for now
}
