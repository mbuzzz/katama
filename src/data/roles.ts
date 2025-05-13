
import type { Role, RolePermission } from "@/types/role";
import { availableFeatures } from "@/types/role";

// Helper to create full permissions for admin
const allPermissionsTrue = (featureKey: string): RolePermission => ({
  feature: featureKey,
  create: true,
  read: true,
  update: true,
  delete: true,
});

// Helper to create read-only permissions
const readOnlyPermissions = (featureKey: string): RolePermission => ({
  feature: featureKey,
  create: false,
  read: true,
  update: false,
  delete: false,
});

let mockRolesStore: Role[] = [
  { 
    id: "1", 
    name: "Admin", 
    description: "Akses penuh ke semua fitur dan pengaturan.", 
    userCount: 1,
    permissions: availableFeatures.map(f => allPermissionsTrue(f.key)),
  },
  { 
    id: "2", 
    name: "Manajer", 
    description: "Mengelola operasional outlet, laporan, dan staf.", 
    userCount: 2,
    permissions: [
      ...["dashboard", "pos", "shifts", "products", "categories", "raw_materials", "units", "purchases", "settings_users", "settings_outlets", "settings_operating_hours"].map(fKey => allPermissionsTrue(fKey)),
      ...["reports_sales", "reports_purchases", "reports_stock", "reports_shifts"].map(fKey => readOnlyPermissions(fKey)),
      { feature: "settings_general", create: false, read: true, update: true, delete: false },
      { feature: "settings_struk", create: false, read: true, update: true, delete: false },
      { feature: "settings_roles", create: false, read: true, update: false, delete: false }, // Manajer can view roles but not edit them
    ]
  },
  { 
    id: "3", 
    name: "Kasir", 
    description: "Akses ke fitur Point of Sale dan laporan penjualan pribadi.", 
    userCount: 5,
    permissions: [
      allPermissionsTrue("pos"), // Full POS access
      readOnlyPermissions("products"), // Read products
      readOnlyPermissions("categories"), // Read categories
      readOnlyPermissions("shifts"), // Read their own shifts, perhaps create if they start their own
      { feature: "reports_sales", create: false, read: true, update: false, delete: false }, // Simplified: can see all sales reports for now
      { feature: "dashboard", create: false, read: true, update: false, delete: false }, // Can view dashboard
    ].filter(p => availableFeatures.some(f => f.key === p.feature)) // Ensure features exist
  },
  { 
    id: "4", 
    name: "Staf Dapur", 
    description: "Melihat pesanan dan mengelola stok bahan.", 
    userCount: 3,
    permissions: [
      readOnlyPermissions("products"), // Read products for recipes
      readOnlyPermissions("raw_materials"), // Read raw materials
      { feature: "raw_materials", create: false, read: true, update: true, delete: false }, // Can update stock
      { feature: "purchases", create: true, read: true, update: false, delete: false }, // Can record purchases
    ].filter(p => availableFeatures.some(f => f.key === p.feature))
  },
];

export const getMockRoles = (): Role[] => {
  return mockRolesStore.map(role => ({
    ...role,
  }));
};

export const getMockRoleById = (id: string): Role | undefined => {
  return mockRolesStore.find(role => role.id === id);
};

export const addMockRole = (roleData: Omit<Role, 'id' | 'userCount'>): Role => {
  const newRole: Role = {
    id: `role-${mockRolesStore.length + 1}-${Date.now().toString().slice(-4)}`,
    ...roleData,
    userCount: 0,
    permissions: roleData.permissions || availableFeatures.map(f => ({ ...readOnlyPermissions(f.key), read: false })), // Default to no permissions if not provided
  };
  mockRolesStore.push(newRole);
  return newRole;
};

export const updateMockRole = (id: string, updates: Partial<Omit<Role, 'id' | 'userCount'>>): Role | undefined => {
  const roleIndex = mockRolesStore.findIndex(role => role.id === id);
  if (roleIndex === -1) {
    return undefined;
  }
  mockRolesStore[roleIndex] = { 
    ...mockRolesStore[roleIndex], 
    ...updates 
  };
  return mockRolesStore[roleIndex];
};

export const deleteMockRole = (id: string): boolean => {
  const roleToDelete = mockRolesStore.find(role => role.id === id);
  if (roleToDelete?.name === "Admin") {
    console.warn("Tidak dapat menghapus peran Admin default.");
    return false; 
  }

  const initialLength = mockRolesStore.length;
  mockRolesStore = mockRolesStore.filter(role => role.id !== id);
  return mockRolesStore.length < initialLength;
};
