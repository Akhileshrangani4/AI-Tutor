import { Metadata } from "next";
import ResetPasswordForm from "@/components/reset-password-form";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Enter your new password here",
};

export default async function ResetPassword() {

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div data-aos="fade-up" data-aos-duration="1000" className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reset your Password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your new password here.
                    </p>
                    <div className="py-4">
                        <ResetPasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
