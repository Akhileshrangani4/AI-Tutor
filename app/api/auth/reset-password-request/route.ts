import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { email as EmailClient } from "@/lib/email";
import crypto from "crypto";
import { addMinutes } from "date-fns";
import { sendResetPasswordEmail } from "@/lib/emails/send-password-reset";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Generate reset token and expiration time
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expires = addMinutes(new Date(), 30); // 30 minutes from now

        // Store the reset token in the database
        await db.passwordResetToken.create({
            data: {
                email,
                token: resetToken,
                expires,
            },
        });

        // Send reset link email
        await sendResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: resetToken,
        });

        return NextResponse.json({ message: "Reset link sent" }, { status: 200 });
    } catch (error) {
        console.error("Error in password reset request:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
