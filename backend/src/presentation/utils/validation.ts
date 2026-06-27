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

export function parsePositiveIntParam(
  val: unknown,
  max = 2147483647
): { ok: true; value: number } | { ok: false; error: string } {
  const str = String(val);
  if (!/^\d+$/.test(str)) return { ok: false, error: 'Invalid parameter format' };
  const num = parseInt(str, 10);
  if (num <= 0 || num > max) return { ok: false, error: `Parameter must be between 1 and ${max}` };
  return { ok: true, value: num };
}
