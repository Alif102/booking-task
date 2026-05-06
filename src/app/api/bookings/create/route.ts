import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chargePayment } from "@/lib/charge";
import { z } from "zod";

const BookingSchema = z.object({
  slotId: z.string(),
  userId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = BookingSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { slotId, userId } = validation.data;

    // ১. ট্রানজেকশনে শুধু বুকিং কনফার্ম করা
    const booking = await prisma.$transaction(async (tx:any) => {
      const updatedSlot = await tx.slot.updateMany({
        where: { id: slotId, isOpen: true },
        data: { isOpen: false },
      });

      if (updatedSlot.count === 0) {
        throw new Error("SLOT_ALREADY_BOOKED");
      }

      return await tx.booking.create({
        data: {
          slotId,
          userId,
          status: "confirmed",
        },
      });
    });

    // ২. ট্রানজেকশন সফল হওয়ার পর চার্জ করা
    // এখন 'booking.id' ডাটাবেসে দৃশ্যমান, তাই chargePayment আর এরর দিবে না।
    try {
      await chargePayment(booking.id, 100);
    } catch (chargeError) {
      // যদি পেমেন্ট ফেইল করে, আপনি চাইলে এখানে বুকিং রিভার্স করার লজিক লিখতে পারেন।
      console.error("Payment failed:", chargeError);
      return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });

  } catch (error: any) {
    if (error.message === "SLOT_ALREADY_BOOKED") {
      return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}