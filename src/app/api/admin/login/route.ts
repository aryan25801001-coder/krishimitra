import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Missing email or password." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    // Create secure session
    await createSession(admin.id.toString());

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });

  } catch (error) {
    console.error(`Login error: ${error instanceof Error ? error.message : "Unknown error"}`);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
