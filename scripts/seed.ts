import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.charge.deleteMany();
  await db.booking.deleteMany();
  await db.slot.deleteMany();
  await db.user.deleteMany();

  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      db.user.create({ data: { name: `User ${i + 1}` } })
    )
  );

  const slot = await db.slot.create({
    data: {
      startsAt: new Date(Date.now() + 60 * 60 * 1000),
      isOpen: true,
    },
  });

  console.log("Slot:", slot.id, "startsAt:", slot.startsAt);
  console.log("Users:", users.map((u) => `${u.name} (${u.id})`).join(", "));
  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
