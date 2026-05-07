import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
      // where: {
      //   isOpen: true,
      // },
      orderBy: {
        startsAt: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}