let i = 0;
export const getId = (prefix: string): string => {
  return `${prefix}${(i++).toString(10).padStart(4, '0')}`
}
