export const getId = (prefix: string): string => {
  const arr = new Uint8Array(4)
  crypto.getRandomValues(arr)
  return `${prefix}-${Array.from(arr).map((i): string => i.toString(16)).join("")}`
}
