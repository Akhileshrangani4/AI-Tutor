"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            setLoading(false);

            if (res.ok) {
                toast({
                    title: "Password Reset Successful",
                    description: "You can now log in with your new password.",
                    variant: "default",
                });
                router.push("/login");
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.message || "Failed to reset password.",
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
        <form onSubmit={handleResetPassword} className="flex flex-col space-y-4 px-4 sm:px-16">
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
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
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}
