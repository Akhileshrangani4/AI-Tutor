import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/lib/db"
import { sendWelcomeEmail } from "./emails/send-welcome";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john.doe@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        // If user doesn't exist or email is not verified, return an error
        if (!user) {
          throw new Error("No user found");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        if (user.password !== credentials?.password) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session!.user!.id = token.id
        session!.user!.name = token.name
        session!.user!.email = token.email
        session!.user!.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  events: {
    async createUser(message) {
      const params = {
        name: message.user.name,
        email: message.user.email,
      };
      await sendWelcomeEmail(params);
    }
  },
};

