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


interface WelcomeEmailProps {
    name: string | null | undefined;
}

export default function VerifyEmail({ name, verifyUrl }: { name: string | null | undefined, verifyUrl: string }) {
    const previewText = `Verify your Email Address for ${siteConfig.name}, ${name}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
                            Welcome to {siteConfig.name}!
                        </Heading>
                        <Text className="text-sm">Hello {name},</Text>
                        <Text className="text-sm">
                            Your account has been created on {siteConfig.name}.
                        </Text>
                        <Text className="text-sm">
                            Thank you for registering. Please verify your email address by clicking the link below:
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="p-2 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"
                                href={verifyUrl}
                            >
                                Verify Email
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};