import VerifyEmail from "@/emails/verify";
import { siteConfig } from "@/config/site";
import { email as EmailClient } from "@/lib/email";

export async function sendVerificationEmail({
  name,
  email,
  token,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  token: string;
}) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  const emailTemplate = VerifyEmail({ name, verifyUrl });

  try {
    await EmailClient.emails.send({
      from: "AI Tutor <no-reply@aialexa.org>",
      to: email as string,
      subject: `Verify Your Email Address for ${siteConfig.name}`,
      react: emailTemplate,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
