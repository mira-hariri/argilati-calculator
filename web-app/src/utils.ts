export function sumHistory(history: string[]): number {
  return history.reduce((sum, entry) => {
    const val = parseFloat(entry);
    return isNaN(val) ? sum : sum + val;
  }, 0);
}
