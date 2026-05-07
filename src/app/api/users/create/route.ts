import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = UserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid user data" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}