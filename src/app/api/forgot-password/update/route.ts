// src/app/api/forgot-password/update/route.ts

import bcrypt from "bcryptjs";
import { prisma } from "@/utils/prismaDB";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, token } = body;

    if (!email || !password || !token) {
        return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const formattedEmail = email.toLowerCase();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: formattedEmail,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the token is valid and not expired
        if (user.passwordResetToken !== token || 
            !user.passwordResetTokenExp || 
            user.passwordResetTokenExp < new Date()) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: {
                email: formattedEmail,
            },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetTokenExp: null,
                isTemporaryPassword: false,
            },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}