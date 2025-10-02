export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&')
}
