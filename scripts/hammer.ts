import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const slot = await db.slot.findFirst({ where: { isOpen: true } });
  if (!slot) {
    console.error("No open slot found. Run pnpm seed first.");
    process.exit(1);
  }

  const users = await db.user.findMany();
  if (users.length === 0) {
    console.error("No users found. Run pnpm seed first.");
    process.exit(1);
  }

  await db.$disconnect();

  const total = 50;
  const requests = Array.from({ length: total }, (_, i) => {
    const user = users[i % users.length];
    return fetch("http://localhost:3000/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: slot.id, userId: user.id }),
    }).then(async (res) => {
      return { status: res.status };
    }).catch(() => {
      return { status: 0 };
    });
  });

  const results = await Promise.allSettled(requests);

  const statuses: Record<number, number> = {};
  let successCount = 0;
  let failureCount = 0;

  for (const r of results) {
    if (r.status === "fulfilled") {
      const code = r.value.status;
      statuses[code] = (statuses[code] ?? 0) + 1;
      if (code >= 200 && code < 300) {
        successCount++;
      } else {
        failureCount++;
      }
    } else {
      statuses[0] = (statuses[0] ?? 0) + 1;
      failureCount++;
    }
  }

  console.log(`Total requests: ${total}`);
  console.log(`Success (2xx): ${successCount}`);
  console.log(`Failure (non-2xx): ${failureCount}`);
  console.log("Status code breakdown:", statuses);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
