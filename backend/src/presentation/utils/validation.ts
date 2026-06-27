export function isValidId(val: unknown): boolean {
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return /^\d+$/.test(val) && n >= 1 && n <= 2147483647;
  }
  if (typeof val === 'number') {
    return Number.isInteger(val) && val >= 1 && val <= 2147483647;
  }
  return false;
}
