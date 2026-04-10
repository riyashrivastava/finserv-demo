export function formatAmount(amount: number): string {
  return amount.toString();
}

export function exportToCSV(transactions: { id: string; amount: number }[]): string {
  const rows = transactions.map(t => `${t.id},${formatAmount(t.amount)}`);
  return ["id,amount", ...rows].join("\n");
}
