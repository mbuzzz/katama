
import type { Role } from "@/types/role";

let mockRolesStore: Role[] = [
  { id: "1", name: "Admin", description: "Akses penuh ke semua fitur dan pengaturan.", userCount: 1 },
  { id: "2", name: "Manajer", description: "Mengelola operasional outlet, laporan, dan staf.", userCount: 2 },
  { id: "3", name: "Kasir", description: "Akses ke fitur Point of Sale dan laporan penjualan pribadi.", userCount: 5 },
  { id: "4", name: "Staf Dapur", description: "Melihat pesanan dan mengelola stok bahan.", userCount: 3 },
];

export const getMockRoles = (): Role[] => {
  // Simulate user count update (in a real app, this would be a join or separate query)
  return mockRolesStore.map(role => ({
    ...role,
    // userCount: mockUsers.filter(user => user.roleId === role.id).length // Example if users had roleId
  }));
};

export const getMockRoleById = (id: string): Role | undefined => {
  return mockRolesStore.find(role => role.id === id);
};

export const addMockRole = (roleData: Omit<Role, 'id' | 'userCount'>): Role => {
  const newRole: Role = {
    id: `role-${mockRolesStore.length + 1}-${Date.now().toString().slice(-4)}`, // More unique ID
    ...roleData,
    userCount: 0, // New roles start with 0 users
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
  // Basic check: prevent deleting Admin role for demo stability
  const roleToDelete = mockRolesStore.find(role => role.id === id);
  if (roleToDelete?.name === "Admin") {
    console.warn("Tidak dapat menghapus peran Admin default.");
    return false; 
  }

  const initialLength = mockRolesStore.length;
  mockRolesStore = mockRolesStore.filter(role => role.id !== id);
  return mockRolesStore.length < initialLength;
};
