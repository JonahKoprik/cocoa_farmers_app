// types/PriceCard.ts
export interface PriceCard {
  label: string;
  value: number | null | undefined;
  gradient: readonly [string, string, ...string[]];
  currency: string;
}
