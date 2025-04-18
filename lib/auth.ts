import { db } from "@/db/index";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: PrismaAdapter(db),

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
        console.log(" credential email and password", credentials.email, credentials.password)
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log(" user DB passwd", user.password)
          if (!user || user.password !== credentials.password) {
            return null;
          }

          return user;
        } catch (err) {
          console.error("Error in authorize:", err);
          return null;
        }
      },
    }),
  ],

  
  pages: {
    error: "/", // handles CredentialsSignin and others
  },
});
