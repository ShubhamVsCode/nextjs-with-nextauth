import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/db";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    session: {
        strategy: "jwt",
    },  
    callbacks: {
        jwt({ token, user, profile }) {
            // console.log(token, profile)
            return { ...user, ...token }
        },
        session({ session, token }) {
            console.log(token)
            session.user = token
            return session
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }