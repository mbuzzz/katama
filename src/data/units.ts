
import type { Unit } from "@/types/unit";

// Assign units to mock companies for SaaS
let mockUnitsStore: Unit[] = [
  { id: "1", name: "Kilogram", abbreviation: "kg", companyId: "comp_es_teh_jaya" },
  { id: "2", name: "Liter", abbreviation: "L", companyId: "comp_es_teh_jaya" },
  { id: "3", name: "Buah", abbreviation: "pcs", companyId: "comp_es_teh_jaya" },
  { id: "4", name: "Pak", abbreviation: "pak", companyId: "comp_kopi_maju" },
  { id: "5", name: "Kotak", abbreviation: "box", companyId: "comp_kopi_maju" },
  { id: "6", name: "Gram", abbreviation: "g", companyId: "comp_es_teh_jaya" },
  { id: "7", name: "Mililiter", abbreviation: "ml", companyId: "comp_es_teh_jaya" },
  { id: "8", name: "Lembar", abbreviation: "lbr", companyId: "comp_roti_lezat_selalu" },
  { id: "9", name: "Butir", abbreviation: "btr", companyId: "comp_kopi_maju" },
  // Add more units assigned to different companies if needed
  { id: "10", name: "Kilogram Kopi", abbreviation: "kg", companyId: "comp_kopi_maju"},
  { id: "11", name: "Liter Susu", abbreviation: "L", companyId: "comp_kopi_maju"},
  { id: "12", name: "Pcs Roti", abbreviation: "pcs", companyId: "comp_roti_lezat_selalu"},
];

export const getMockUnits = (companyId?: string): Unit[] => {
  if (companyId) {
    return [...mockUnitsStore].filter(unit => unit.companyId === companyId);
  }
  return []; // Units should be company-specific
};

export const getMockUnitById = (id: string, companyId?: string): Unit | undefined => {
  const unit = mockUnitsStore.find(u => u.id === id);
  if (unit && companyId && unit.companyId !== companyId) {
    return undefined; // Not found for this company
  }
  return unit;
};

export const addMockUnit = (unitData: Omit<Unit, 'id' | 'companyId'>, companyId: string): Unit => {
  if (!companyId) {
    throw new Error("companyId is required to add a unit.");
  }
  const newUnit: Unit = {
    id: `unit-${mockUnitsStore.length + 1}-${Date.now().toString().slice(-3)}`,
    ...unitData,
    companyId: companyId,
  };
  mockUnitsStore.push(newUnit);
  return newUnit;
};

export const updateMockUnit = (id: string, updates: Partial<Omit<Unit, 'id' | 'companyId'>>, companyId: string): Unit | undefined => {
  const unitIndex = mockUnitsStore.findIndex(unit => unit.id === id && unit.companyId === companyId);
  if (unitIndex === -1) {
    return undefined;
  }
  mockUnitsStore[unitIndex] = { ...mockUnitsStore[unitIndex], ...updates, companyId }; // Ensure companyId is preserved
  return mockUnitsStore[unitIndex];
};

export const deleteMockUnit = (id: string, companyId: string): boolean => {
  const initialLength = mockUnitsStore.length;
  mockUnitsStore = mockUnitsStore.filter(unit => !(unit.id === id && unit.companyId === companyId));
  return mockUnitsStore.length < initialLength;
};

// These might not be as useful now that units are company-specific
// export const mockUnitNames: string[] = mockUnitsStore.map(u => u.name);
// export const mockUnitAbbreviations: string[] = mockUnitsStore.map(u => u.abbreviation);
