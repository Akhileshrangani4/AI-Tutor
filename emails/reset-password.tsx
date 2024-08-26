import React from "react";
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Tailwind,
    Section,
    Link,
} from "@react-email/components";
import { siteConfig } from "@/config/site";


interface ResetPasswordEmailProps {
    name: string | null | undefined;
    resetUrl: string
}

export default function ResetPassword({ name, resetUrl }: ResetPasswordEmailProps) {
    const previewText = `Reset Password Request for ${siteConfig.name}, ${name}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
                            Reset your Password for {siteConfig.name}:
                        </Heading>
                        <Text className="text-sm">Hello {name},</Text>
                        <Text className="text-sm">
                            Reset your Password by clicking the link below:
                        </Text>
                        <Text className="text-sm">
                            This link will expire in 30 minutes.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="p-2 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"
                                href={resetUrl}
                            >
                                Reset Your Password
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};