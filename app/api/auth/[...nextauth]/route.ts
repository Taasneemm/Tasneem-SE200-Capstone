/* 
this tells next.js vercel deployment not to statically render this page
at build time, instead to render it dynamically as
per request.
*/
export const dynamic = "force-dynamic";
import { handlers } from "@/lib/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers