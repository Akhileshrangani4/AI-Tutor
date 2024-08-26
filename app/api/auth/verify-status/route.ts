import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

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

        // Check if the email is verified
        const isVerified = user.emailVerified !== null;

        return NextResponse.json({ isVerified }, { status: 200 });
    } catch (error) {
        console.error("Error checking email verification status:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
