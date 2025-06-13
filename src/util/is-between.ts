export function isBetween(x: number, [from, end]: [number, number]) {
  return from <= x && x <= end
}
