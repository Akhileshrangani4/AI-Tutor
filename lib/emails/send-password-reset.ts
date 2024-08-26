import { siteConfig } from "@/config/site";
import { email as EmailClient } from "@/lib/email";
import ResetPassword from "@/emails/reset-password";

export async function sendResetPasswordEmail({
  name,
  email,
  token,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  token: string;
}) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  const emailTemplate = ResetPassword({ name, resetUrl });

  try {
    await EmailClient.emails.send({
        from: "AI Tutor <no-reply@aialexa.org>",
        to: email as string,
        subject: `Password Reset Request for ${siteConfig.name}`,
        react: emailTemplate,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
