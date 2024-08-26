"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingDots from "@/components/loading-dots";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function CredentialsLoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();

  const handleError = (error: string | undefined) => {
    if (error?.includes("No user found")) {
      toast({
        title: "User Not Found",
        description: "No account found with this email. Please check your email or register for a new account.",
        variant: "destructive",
      });
    } else if (error?.includes("Incorrect password")) {
      toast({
        title: "Login Failed",
        description: "Incorrect email or password. Please try again.",
        variant: "destructive",
      });
    } else if (error?.includes("Please verify your email")) {
      toast({
        title: "Email Verification Required",
        description: "Your email address is not verified. Please check your email for verification instructions.",
        variant: "destructive",
      });
    } else if (error?.includes("No password set")) {
      toast({
        title: "Password Not Set",
        description: "Your account doesn't have a password set. Please reset your password to proceed.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "/register"; // Redirect to the registration page
  };

  return (
    <div className="flex flex-col space-y-4 px-4 sm:px-16">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: searchParams?.get("from") || "/dashboard",
          });
          setLoading(false);

          if (result?.error) {
            handleError(result.error);
          } else if (result?.url) {
            window.location.href = result.url;
          }
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black mb-4"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="h-10 w-full rounded-md border px-3 text-sm focus:outline-none bg-white border-black mb-4"
        />
        <button
          disabled={loading}
          className={`${loading
            ? "cursor-not-allowed border-gray-200 bg-gray-100"
            : "border-black bg-black text-black bg-white hover:text-white hover:bg-black"
            } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
        >
          {loading ? (
            <LoadingDots color="#808080" />
          ) : (
            <p>Sign In</p>
          )}
        </button>
      </form>
      {/* <button
        onClick={handleRegisterRedirect}
        className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-white text-black hover:bg-black hover:text-white transition-all focus:outline-none text-sm"
      >
        <p>Create Account</p>
      </button> */}
      <Link href={"/forgot-password"} className="text-sm">Forgot Password?</Link>
    </div>
  );
}
