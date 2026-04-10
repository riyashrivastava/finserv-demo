export async function searchTransactions(query: string) {
  if (!query || !query.trim()) {
    return [];
  }

  const results = await db.transactions.find({ query: query.trim() });
  return results;
}

const db = {
  transactions: {
    find: async ({ query }: { query: string }) => []
  }
};
