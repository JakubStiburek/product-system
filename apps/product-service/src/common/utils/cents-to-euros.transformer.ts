export const centsToEurosTransformer = {
  to: (cents: number): string => (cents / 100).toFixed(2),
  from: (euros: string): number => Math.round(parseFloat(euros) * 100),
};
