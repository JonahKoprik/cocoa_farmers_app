// Expressive frontend roles for onboarding UI
export const roles = [
  'Farmer',
  'Fermentary Owner',
  'Warehouse',
  'Organization',

] as const;

export type Role = typeof roles[number]; // UI-facing role type
