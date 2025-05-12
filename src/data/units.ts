
import type { Unit } from "@/types/unit";

let mockUnitsStore: Unit[] = [
  { id: "1", name: "Kilogram", abbreviation: "kg" },
  { id: "2", name: "Liter", abbreviation: "L" },
  { id: "3", name: "Pcs", abbreviation: "pcs" },
  { id: "4", name: "Pack", abbreviation: "pack" },
  { id: "5", name: "Box", abbreviation: "box" },
  { id: "6", name: "Gram", abbreviation: "g" },
  { id: "7", name: "Mililiter", abbreviation: "ml" },
  { id: "8", name: "Lembar", abbreviation: "lbr" },
  { id: "9", name: "Butir", abbreviation: "btr" },
];

export const getMockUnits = (): Unit[] => {
  return [...mockUnitsStore];
};

export const getMockUnitById = (id: string): Unit | undefined => {
  return mockUnitsStore.find(unit => unit.id === id);
};

export const addMockUnit = (unitData: Omit<Unit, 'id'>): Unit => {
  const newUnit: Unit = {
    id: (mockUnitsStore.length + 1).toString(), // Simple ID generation
    ...unitData,
  };
  mockUnitsStore.push(newUnit);
  return newUnit;
};

export const updateMockUnit = (id: string, updates: Partial<Omit<Unit, 'id'>>): Unit | undefined => {
  const unitIndex = mockUnitsStore.findIndex(unit => unit.id === id);
  if (unitIndex === -1) {
    return undefined;
  }
  mockUnitsStore[unitIndex] = { ...mockUnitsStore[unitIndex], ...updates };
  return mockUnitsStore[unitIndex];
};

export const deleteMockUnit = (id: string): boolean => {
  const initialLength = mockUnitsStore.length;
  mockUnitsStore = mockUnitsStore.filter(unit => unit.id !== id);
  return mockUnitsStore.length < initialLength;
};

export const mockUnitNames: string[] = mockUnitsStore.map(u => u.name);
export const mockUnitAbbreviations: string[] = mockUnitsStore.map(u => u.abbreviation);
