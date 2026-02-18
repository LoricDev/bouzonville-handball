import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    // ── Google OAuth ──────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Credentials (email / mot de passe) ────────────
    // Décommente et personnalise si tu veux l'auth par identifiants
    // import Credentials from "next-auth/providers/credentials";
    // Credentials({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Mot de passe", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     // Implémente ta logique de vérification ici
    //     // Ex: vérifier bcrypt hash du mot de passe
    //     return null;
    //   },
    // }),
  ],

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      // Ajoute le rôle et l'id à la session
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role: string }).role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error",
  },
});
