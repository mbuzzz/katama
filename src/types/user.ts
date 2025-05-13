
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Could be an enum or linked to Role type
  outlet: string; // Could be linked to Outlet type
  avatar?: string;
  points?: number;
  badge?: string; // e.g., "Pemula", "Pro", "Veteran"
}
