import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.redirect(new URL("/verification?status=error&message=Token is required", req.url));
        }

        // Find the verification token in the database
        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken || verificationToken.expires < new Date()) {
            return NextResponse.redirect(new URL("/verification?status=error&message=Invalid or expired token", req.url));
        }

        // Mark the user's email as verified
        await db.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() },
        });

        // Delete the verification token
        await db.verificationToken.delete({
            where: { token },
        });

        return NextResponse.redirect(new URL("/verification?status=success&message=Email verified successfully", req.url));
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.redirect(new URL("/verification?status=error&message=Internal Server Error", req.url));
    }
}
