"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const VerificationPage = () => {
    const router = useRouter();
    const [status, setStatus] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const { searchParams } = new URL(window.location.href);
        setStatus(searchParams.get("status"));
        setMessage(searchParams.get("message"));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">AI Tutor Email Verification</h1>
            <p className={`text-lg ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                {message}
            </p>
            <a href="/login" className="mt-4 text-blue-500 hover:underline">Go to Login</a>
        </div>
    );
};

export default VerificationPage;
