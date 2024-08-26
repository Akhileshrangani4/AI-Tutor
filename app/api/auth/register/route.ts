import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import dns from "dns/promises";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "@/lib/emails/send-verification";
import bcrypt from "bcrypt"

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const disposableDomains = ["mailinator.com", "tempmail.com", "yopmail.com"];

function isDisposableEmail(email: string): boolean {
    const domain = email.split("@")[1];
    return disposableDomains.includes(domain);
}

async function hasValidMXRecord(domain: string): Promise<boolean> {
    try {
        const mxRecords = await dns.resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch (error) {
        return false; 
    }
}

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        // Email format validation
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check for disposable email domains
        if (isDisposableEmail(email)) {
            return NextResponse.json(
                { message: "Disposable email addresses are not allowed" },
                { status: 400 }
            );
        }

        // Check for valid MX records
        const domain = email.split("@")[1];
        const hasMxRecords = await hasValidMXRecord(domain);
        if (!hasMxRecords) {
            return NextResponse.json(
                { message: "Invalid email domain" },
                { status: 400 }
            );
        }

        // Check if the user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 } 
            );
        }

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with the hashed password and email verification status
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                emailVerified: null, // Set to null to indicate unverified
            },
        });

        // Generate a verification token
        const token = randomBytes(32).toString("hex");
        const expires = addMinutes(new Date(), 30); // Token valid for 30 minutes

        await db.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send verification email
        await sendVerificationEmail({
            name: newUser.name,
            email: newUser.email,
            token,
        });

        return NextResponse.json({ message: "User created successfully. Please check your email to verify your account." }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
