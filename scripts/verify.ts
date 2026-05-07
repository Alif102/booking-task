import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const [openSlots, bookings, charges] =
    await Promise.all([
      db.slot.count({ where: { isOpen: true } }),
      db.booking.count(),
      db.charge.count(),
    ]);

  const slots = await db.slot.findMany({
    take: 5,
    orderBy: { startsAt: "asc" },
  });

  console.log(
    `Slots open: ${openSlots} | Bookings: ${bookings} | Charges: ${charges}`
  );

  console.log("Sample slots:");
  console.log(slots);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());