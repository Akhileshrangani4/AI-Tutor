import WelcomeEmail from "@/emails/welcome";
import { siteConfig } from "@/config/site";
import { email as EmailClient } from "@/lib/email";


export async function sendWelcomeEmail({ name, email }: { name: string | null | undefined, email: string | null | undefined }) {
    const emailTemplate = WelcomeEmail({ name });
    try {
        // Send the email using the Resend API
        await EmailClient.emails.send({
            from: "AI Tutor <no-reply@ai-alexa.vercel.app>",
            to: email as string,
            subject: `Welcome to ${siteConfig.name}!`,
            react: emailTemplate,
        });
    } catch (error) {
        // Log any errors and re-throw the error
        console.log({ error });
        //throw error;
    }
}