// Parse a history entry like "+50*3" or "+200" or "-100"
function parseEntry(entry: string): number {
  // Extract sign
  const sign = entry.startsWith('-') ? -1 : 1;
  const rest = entry.replace(/^[+-]/, '');

  // Check for multiplication
  if (rest.includes('*')) {
    const parts = rest.split('*');
    const base = parseFloat(parts[0]) || 0;
    const mul = parseFloat(parts[1]) || 1;
    return sign * base * mul;
  }

  return sign * (parseFloat(rest) || 0);
}

export function sumHistory(history: string[]): number {
  return history.reduce((sum, entry) => sum + parseEntry(entry), 0);
}
