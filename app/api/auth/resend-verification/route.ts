import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "@/lib/emails/send-verification";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Find the user by email
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the user already has a verified email
        if (user.emailVerified) {
            return NextResponse.json({ message: "Email already verified" }, { status: 400 });
        }

        // Delete any existing verification tokens for this email
        await db.verificationToken.deleteMany({
            where: { identifier: email },
        });

        // Generate a new verification token
        const token = randomBytes(32).toString("hex");
        const expires = addMinutes(new Date(), 30); // Token valid for 30 minutes

        // Create a new verification token in the database
        await db.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send verification email
        await sendVerificationEmail({
            name: user.name,
            email: user.email,
            token,
        });

        return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error resending verification email:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
