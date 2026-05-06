import { PrismaClient } from "@prisma/client";

const gatewayDb = new PrismaClient();

export async function chargePayment(bookingId: string, amount: number): Promise<{ chargeId: string }> {
  const delay = 100 + Math.floor(Math.random() * 200);
  await new Promise((r) => setTimeout(r, delay));
  const charge = await gatewayDb.charge.create({
    data: { bookingId, amount },
  });
  return { chargeId: charge.id };
}
