
import type { User } from "@/types/user";

// In-memory store for mock users
// Points and badges are now manually adjusted to be plausible based on mock sales data.
// For example:
// Ana Maria (Kasir): Total sales from mockSalesDataFull = 36000 + 45000 + 16000 = 97000. Assuming 1 point per Rp 100, this is 970 points. Badge "Pemula".
// Budi Santoso (Admin, but listed as Kasir Budi in some sales): Sales S002 (22000) + S005 (18000) = 40000. Points = 400. Badge "Pemula".
// Candra Wijaya (Manajer): No direct sales as kasir in mock data. Points could be from team performance or other metrics. Keeping existing.
// Dewi Lestari (Kasir): No sales in mockSalesDataFull. Points = 0. Badge "Pemula".

let mockUsersStore: User[] = [
  { id: "1", name: "Ana Maria", email: "ana@katama.com", role: "Kasir", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user1", points: 970, badge: "Pemula" },
  { id: "2", name: "Budi Santoso", email: "budi@katama.com", role: "Admin", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user2", points: 400, badge: "Pemula" },
  { id: "3", name: "Candra Wijaya", email: "candra@katama.com", role: "Manajer", outlet: "Outlet Cabang A", avatar: "https://picsum.photos/40/40?random=user3", points: 2500, badge: "Veteran" },
  { id: "4", name: "Dewi Lestari", email: "dewi@katama.com", role: "Kasir", outlet: "Outlet Cabang A", avatar: "https://picsum.photos/40/40?random=user4", points: 0, badge: "Pemula" },
];

export const getMockUsers = (): User[] => {
  return [...mockUsersStore];
};

export const getMockUserById = (id: string): User | undefined => {
  return mockUsersStore.find(user => user.id === id);
};

export const addMockUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: `user-${mockUsersStore.length + 1}-${Date.now().toString().slice(-4)}`,
    points: 0, // New users start with 0 points
    badge: "Pemula", // New users start with "Pemula" badge
    ...userData,
  };
  mockUsersStore.push(newUser);
  return newUser;
};

export const updateMockUser = (id: string, updates: Partial<Omit<User, 'id'>>): User | undefined => {
  const userIndex = mockUsersStore.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  // If points are being updated, potentially update badge too
  let newBadge = mockUsersStore[userIndex].badge;
  if (updates.points !== undefined && updates.points !== null) {
    if (updates.points < 500) newBadge = "Pemula";
    else if (updates.points < 1500) newBadge = "Pro";
    else newBadge = "Veteran";
  }
  
  mockUsersStore[userIndex] = { 
    ...mockUsersStore[userIndex], 
    ...updates,
    badge: updates.points !== undefined ? newBadge : mockUsersStore[userIndex].badge, // Apply new badge if points changed
  };
  return mockUsersStore[userIndex];
};

export const deleteMockUser = (id: string): boolean => {
  const initialLength = mockUsersStore.length;
  mockUsersStore = mockUsersStore.filter(user => user.id !== id);
  return mockUsersStore.length < initialLength;
};

// Example function to simulate point updates - this would be called from a relevant place
// e.g., after a sale is processed or a shift ends.
export const awardPointsToUser = (userId: string, pointsEarned: number): void => {
  const user = getMockUserById(userId);
  if (user) {
    const currentPoints = user.points || 0;
    updateMockUser(userId, { points: currentPoints + pointsEarned });
  }
};
