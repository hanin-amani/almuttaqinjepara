import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// 1. Definisikan opsi konfigurasi secara eksplisit
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Meminta data tambahan jika diperlukan
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  // 2. Gunakan strategi database karena kita pakai PrismaAdapter
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 Hari
  },
  callbacks: {
    // Menyinkronkan ID user dari database ke objek session di frontend
    session: async ({ session, user }) => {
      if (session.user) {
        // @ts-ignore
        session.user.id = user.id;
      }
      return session;
    },
  },
  // 3. Konfigurasi halaman custom (opsional, tapi bagus buat branding RSM)
  pages: {
    signIn: '/auth/signin', // Jika nanti antum buat halaman login sendiri
    error: '/auth/error', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Aktifkan log saat development
};

// 4. Export handler untuk App Router Next.js
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };