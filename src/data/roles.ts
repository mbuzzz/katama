
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

const adminSystemFeatures = ["admin_overview", "admin_companies"];

let mockRolesStore: Role[] = [
  {
    id: "0", // ID untuk Super Admin
    name: "Super Admin",
    description: "Akses absolut ke semua fitur dan pengaturan sistem.",
    userCount: 1, 
    permissions: availableFeatures.map(f => allPermissionsTrue(f.key)), // Superadmin gets all permissions by default
  },
  {
    id: "1",
    name: "Admin", // Ini bisa menjadi Admin Perusahaan (Tenant Admin)
    description: "Akses penuh ke fitur operasional dan pengaturan perusahaan.",
    userCount: 1,
    permissions: availableFeatures
      .filter(f => !adminSystemFeatures.includes(f.key)) // Filter out super admin specific system features
      .map(f => allPermissionsTrue(f.key)),
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
      { feature: "settings_roles", create: false, read: true, update: false, delete: false }, 
    ].filter(p => availableFeatures.some(f => f.key === p.feature && !adminSystemFeatures.includes(f.key)))
  },
  {
    id: "3",
    name: "Kasir",
    description: "Akses ke fitur Point of Sale dan laporan penjualan pribadi.",
    userCount: 5,
    permissions: [
      allPermissionsTrue("pos"), 
      readOnlyPermissions("products"), 
      readOnlyPermissions("categories"), 
      readOnlyPermissions("shifts"), 
      { feature: "reports_sales", create: false, read: true, update: false, delete: false }, 
      { feature: "dashboard", create: false, read: true, update: false, delete: false }, 
    ].filter(p => availableFeatures.some(f => f.key === p.feature && !adminSystemFeatures.includes(f.key)))
  },
  {
    id: "4",
    name: "Staf Dapur",
    description: "Melihat pesanan dan mengelola stok bahan.",
    userCount: 3,
    permissions: [
      readOnlyPermissions("products"), 
      readOnlyPermissions("raw_materials"), 
      { feature: "raw_materials", create: false, read: true, update: true, delete: false }, 
      { feature: "purchases", create: true, read: true, update: false, delete: false }, 
    ].filter(p => availableFeatures.some(f => f.key === p.feature && !adminSystemFeatures.includes(f.key)))
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
    permissions: roleData.permissions || availableFeatures.filter(f => !adminSystemFeatures.includes(f.key)).map(f => ({ ...readOnlyPermissions(f.key), read: false })),
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
  if (roleToDelete?.name === "Admin" || roleToDelete?.name === "Super Admin") {
    console.warn(`Tidak dapat menghapus peran default: ${roleToDelete.name}.`);
    return false;
  }

  const initialLength = mockRolesStore.length;
  mockRolesStore = mockRolesStore.filter(role => role.id !== id);
  return mockRolesStore.length < initialLength;
};

