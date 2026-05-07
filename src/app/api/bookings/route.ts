import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        slot: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}