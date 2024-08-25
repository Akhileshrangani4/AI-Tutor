"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/loading-dots";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [resendingVerification, setResendingVerification] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            setLoading(false);

            if (res.ok) {
                toast({
                    title: "Registration Successful",
                    description: "You can now check your email for verification instructions.",
                    variant: "default",
                });
            } else {
                const data = await res.json();
                toast({
                    title: "Registration Failed",
                    description: data.message || "An error occurred. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "Registration Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleResendVerification = async () => {
        setResendingVerification(true);
        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            setResendingVerification(false);

            if (res.ok) {
                toast({
                    title: "Verification Email Sent",
                    description: "A new verification email has been sent. Please check your inbox.",
                    variant: "default",
                });
            } else {
                const data = await res.json();
                toast({
                    title: "Resend Failed",
                    description: data.message || "Failed to resend verification email. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            setResendingVerification(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred while resending the verification email.",
                variant: "destructive",
            });
        }
    };

    const checkVerificationStatus = async () => {
        setCheckingStatus(true);
        try {
            const res = await fetch(`/api/auth/verify-status?email=${email}`);

            setCheckingStatus(false);

            if (res.ok) {
                const data = await res.json();
                setIsVerified(data.isVerified);
            } else {
                toast({
                    title: "Error Checking Status",
                    description: "Failed to check email verification status.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            setCheckingStatus(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred while checking email verification status.",
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleRegister} className="flex flex-col space-y-4 px-4 sm:px-16">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black"
            />
            <button
                type="submit"
                disabled={loading}
                className={`${loading
                    ? "cursor-not-allowed border-gray-200 bg-gray-100"
                    : "border-black bg-black text-black bg-white hover:text-white hover:bg-black"
                    } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {loading ? "Registering..." : "Register"}
            </button>

            <button
                type="button"
                onClick={checkVerificationStatus}
                className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-white text-black hover:bg-black hover:text-white transition-all focus:outline-none text-sm mt-4"
            >
                {checkingStatus ? <LoadingDots /> : "Check Verification Status"}
            </button>

            <button
                type="button"
                onClick={handleResendVerification}
                className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-white text-black hover:bg-black hover:text-white transition-all focus:outline-none text-sm mt-4"
            >
                {resendingVerification ? <LoadingDots /> : "Resend Verification Email"}
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
                {isVerified === null && <p>Please check your verification status.</p>}
                {isVerified === false && <p>Your email is not verified. Please check your inbox or resend the verification email.</p>}
                {isVerified === true && (
                    <>
                        <p>Your email is verified. You can now login.</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="mt-2 flex h-10 w-full items-center justify-center rounded-md border border-black bg-white text-black hover:bg-black hover:text-white transition-all focus:outline-none text-sm"
                        >
                            Login Here
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}
