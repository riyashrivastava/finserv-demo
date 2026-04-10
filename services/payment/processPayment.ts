export async function processPayment(cardNumber: string, expiryDate: string, amount: number) {
  const payment = await chargeCard(cardNumber, amount);
  return payment;
}

async function chargeCard(cardNumber: string, amount: number) {
  return { success: true, transactionId: Math.random().toString() };
}
