import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [openSlots, bookings, charges] = await Promise.all([
    db.slot.count({ where: { isOpen: true } }),
    db.booking.count(),
    db.charge.count(),
  ]);

  console.log(`Slots open: ${openSlots} | Bookings: ${bookings} | Charges: ${charges}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
