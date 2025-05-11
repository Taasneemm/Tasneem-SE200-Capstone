import { db } from "@/db/index";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

const getAuthOptions = () => ({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || user.password !== credentials.password) {
            return null;
          }

          return user;
        } catch (err) {
          console.log("Error in authorize:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    error: "/",
  },
});

export const { handlers, signIn, signOut, auth } = NextAuth(getAuthOptions());
