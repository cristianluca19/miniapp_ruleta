import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    verificationLevel?: string; 
  }

  interface Session extends DefaultSession {
    user: User; 
  }
}
