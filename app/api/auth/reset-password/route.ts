import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { token, password } = await req.json();

    try {
        const resetToken = await db.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await db.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        // Delete the reset token
        await db.passwordResetToken.delete({
            where: { token },
        });

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in password reset:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
