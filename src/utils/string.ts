export const filterString = (val: unknown): string | null =>
  typeof val === 'string' && val.trim().length > 0 ? val : null

