
import type { User, UserFormData } from "@/types/user";
import { mockOutlets } from "@/app/dashboard/settings/outlets/page"; // Untuk mendapatkan nama outlet

// In-memory store for mock users
let mockUsersStore: User[] = [
  { id: "1", name: "Ana Maria", email: "ana@katama.com", role: "Kasir", outlet: "KATAMA Pusat", avatar: "https://placehold.co/40x40.png?text=AU", dataAiHint:"user avatar", points: 970, badge: "Pemula" },
  { id: "2", name: "Budi Santoso", email: "budi@katama.com", role: "Admin", outlet: "KATAMA Pusat", avatar: "https://placehold.co/40x40.png?text=BS", dataAiHint:"user avatar", points: 400, badge: "Pemula" },
  { id: "3", name: "Candra Wijaya", email: "candra@katama.com", role: "Manajer", outlet: "KATAMA Cabang Sudirman", avatar: "https://placehold.co/40x40.png?text=CW", dataAiHint:"user avatar", points: 2500, badge: "Veteran" },
  { id: "4", name: "Dewi Lestari", email: "dewi@katama.com", role: "Kasir", outlet: "KATAMA Cabang Sudirman", avatar: "https://placehold.co/40x40.png?text=DL", dataAiHint:"user avatar", points: 0, badge: "Pemula" },
];

export const getMockUsers = (): User[] => {
  return [...mockUsersStore];
};

export const getMockUserById = (id: string): User | undefined => {
  return mockUsersStore.find(user => user.id === id);
};

export const addMockUser = (userData: UserFormData, companyId: string): User => {
  // Untuk mock data, kita akan mengambil nama outlet berdasarkan outletId dan companyId
  // Dalam sistem nyata, outletId sudah cukup.
  const outletData = mockOutlets.find(o => o.id === userData.outletId && o.companyId === companyId);

  const newUser: User = {
    id: `user-${mockUsersStore.length + 1}-${Date.now().toString().slice(-4)}`,
    name: userData.name,
    email: userData.email,
    // PENTING: Jangan simpan password plain text di dunia nyata! Ini hanya untuk mock.
    // Password seharusnya di-hash.
    role: userData.role,
    outlet: outletData?.name || "Outlet Tidak Diketahui", // Gunakan nama outlet
    avatar: `https://placehold.co/40x40.png?text=${userData.name.substring(0,2).toUpperCase()}`,
    dataAiHint: "user avatar",
    points: 0,
    badge: "Pemula",
  };
  mockUsersStore.push(newUser);
  return newUser;
};

export const updateMockUser = (id: string, updates: Partial<Omit<User, 'id'>>): User | undefined => {
  const userIndex = mockUsersStore.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  
  let newBadge = mockUsersStore[userIndex].badge;
  if (updates.points !== undefined && updates.points !== null) {
    if (updates.points < 500) newBadge = "Pemula";
    else if (updates.points < 1500) newBadge = "Pro";
    else newBadge = "Veteran";
  }
  
  mockUsersStore[userIndex] = { 
    ...mockUsersStore[userIndex], 
    ...updates,
    badge: updates.points !== undefined ? newBadge : mockUsersStore[userIndex].badge,
  };
  return mockUsersStore[userIndex];
};

export const deleteMockUser = (id: string): boolean => {
  const initialLength = mockUsersStore.length;
  mockUsersStore = mockUsersStore.filter(user => user.id !== id);
  return mockUsersStore.length < initialLength;
};

export const awardPointsToUser = (userId: string, pointsEarned: number): void => {
  const user = getMockUserById(userId);
  if (user) {
    const currentPoints = user.points || 0;
    updateMockUser(userId, { points: currentPoints + pointsEarned });
  }
};
