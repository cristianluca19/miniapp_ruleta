import NextAuth, { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // 📌 Asegúrate de definir esta variable en Vercel

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub || "Usuario", // 📌 Si no hay nombre, se usa "Usuario" por defecto
          verificationLevel:
            profile["https://id.worldcoin.org/v1"]?.verification_level || "unknown", // 📌 Se usa "unknown" si no está definido
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && "verificationLevel" in user) {
        token.verificationLevel = user.verificationLevel as string | undefined; // 📌 Se verifica antes de asignar
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        verificationLevel: token.verificationLevel as string | undefined, // 📌 Se asegura que sea del tipo correcto
      };
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development", // 📌 Activa logs solo en desarrollo
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
