
import type { User, UserFormData } from "@/types/user";
import { getMockOutletById } from "@/data/outlets"; 

// In-memory store for mock users
let mockUsersStore: User[] = [
  { id: "1", companyId: "comp_es_teh_jaya", name: "Ana Maria", email: "ana@katama.com", role: "Kasir", outlet: "KATAMA Pusat (Es Teh)", avatar: "https://placehold.co/40x40.png?text=AU", dataAiHint:"user avatar", points: 970, badge: "Pemula" },
  { id: "2", companyId: "comp_es_teh_jaya", name: "Budi Santoso", email: "budi@katama.com", role: "Admin", outlet: "KATAMA Pusat (Es Teh)", avatar: "https://placehold.co/40x40.png?text=BS", dataAiHint:"user avatar", points: 400, badge: "Pemula" },
  { id: "3", companyId: "comp_kopi_maju", name: "Candra Wijaya", email: "candra@katama.com", role: "Manajer", outlet: "Kedai Kopi Maju Jaya Pusat", avatar: "https://placehold.co/40x40.png?text=CW", dataAiHint:"user avatar", points: 2500, badge: "Veteran" },
  { id: "4", companyId: "comp_kopi_maju", name: "Dewi Lestari", email: "dewi@katama.com", role: "Kasir", outlet: "Kedai Kopi Maju Jaya Pusat", avatar: "https://placehold.co/40x40.png?text=DL", dataAiHint:"user avatar", points: 0, badge: "Pemula" },
  // Pengguna Super Admin (untuk konsistensi data, kita beri companyId mock)
  { id: "sa1", companyId: "comp_es_teh_jaya", name: "Ngadimin Payaman", email: "ngadmin@example.com", role: "Super Admin", outlet: "Kantor Pusat Sistem", avatar: "https://placehold.co/40x40.png?text=SA", dataAiHint:"user avatar", points: 0},
];

export const getMockUsers = (companyId?: string): User[] => {
  if (companyId) {
    return [...mockUsersStore].filter(user => user.companyId === companyId);
  }
  // Jika tidak ada companyId, kembalikan array kosong karena pengguna harus spesifik per perusahaan
  // kecuali untuk kasus Super Admin global yang mungkin ditangani secara berbeda.
  // Untuk halaman settings/users, kita selalu harapkan companyId.
  return []; 
};

export const getMockUserById = (id: string): User | undefined => {
  // Untuk getById, kita asumsikan ID user unik global
  return mockUsersStore.find(user => user.id === id);
};

export const addMockUser = (userData: UserFormData, companyId: string): User => {
  if (!companyId) {
    throw new Error("companyId diperlukan untuk menambahkan pengguna.");
  }
  // Outlet diambil berdasarkan outletId DAN companyId untuk memastikan outlet tersebut milik perusahaan yang benar
  const outletData = getMockOutletById(userData.outletId, companyId);

  const newUser: User = {
    id: `user-${mockUsersStore.length + 1}-${Date.now().toString().slice(-4)}`,
    companyId: companyId, // Simpan companyId
    name: userData.name,
    email: userData.email,
    role: userData.role,
    outlet: outletData?.name || "Outlet Tidak Diketahui", 
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
  
  // Pastikan companyId tidak terhapus jika tidak ada di 'updates'
  const existingCompanyId = mockUsersStore[userIndex].companyId;
  mockUsersStore[userIndex] = { 
    ...mockUsersStore[userIndex], 
    ...updates,
    companyId: updates.companyId || existingCompanyId, // Jaga companyId
    badge: updates.points !== undefined ? newBadge : mockUsersStore[userIndex].badge,
  };
  return mockUsersStore[userIndex];
};

export const deleteMockUser = (id: string): boolean => {
  // Untuk mock sederhana, ID dianggap unik global
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
