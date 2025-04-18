import { db } from "@/db/index"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from 'next-auth/providers/google'
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
 
        // TODO: password needs to be salted and hashed in the future
        const pwHash = credentials.password;
 
        try {
          user = await db.user.findUnique({where : {email: credentials.email as string}});
        } catch {
          throw("db find error encountered");
        }

        if (!user || user.password !== pwHash) {
          return null;
        }
        
        return user;
      },
    }),
  ],
})