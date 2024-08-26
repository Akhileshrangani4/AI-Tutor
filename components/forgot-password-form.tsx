"use client";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            setLoading(false);

            if (res.ok) {
                toast({
                    title: "Reset Link Sent",
                    description: "Please check your email for reset instructions.",
                    variant: "default",
                });
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.message || "Failed to send reset link.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleResetRequest} className="flex flex-col space-y-4 px-4 sm:px-16">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black"
            />
            <button
                disabled={loading}
                className={`${loading
                    ? "cursor-not-allowed border-gray-200 bg-gray-100"
                    : "border-black bg-black text-black bg-white hover:text-white hover:bg-black"
                    } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>
        </form>
    );
}
