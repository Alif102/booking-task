import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SlotSchema = z.object({
  startsAt: z.string(),
  endsAt: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = SlotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid slot data" },
        { status: 400 }
      );
    }

    const slot = await prisma.slot.create({
      data: {
        startsAt: new Date(parsed.data.startsAt),
        endsAt: new Date(parsed.data.endsAt),
        isOpen: true,
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create slot" },
      { status: 500 }
    );
  }
}