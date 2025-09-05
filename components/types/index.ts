export const RoleEnum = {
  Farmer: 'Farmer',
    FermentaryOwner: 'Fermentary Owner',
    Warehouse: 'Warehouse',
    Organization: 'Organization',
} as const;

export type Role = keyof typeof RoleEnum;

export type AccountPayload = {
  name: string;
  email: string;
  role: Role;
  location: string;
  password?: string;
};
