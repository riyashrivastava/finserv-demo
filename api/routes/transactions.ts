export async function searchTransactions(query: string) {
  const results = await db.transactions.find({ query });
  return results;
}

const db = {
  transactions: {
    find: async ({ query }: { query: string }) => []
  }
};
