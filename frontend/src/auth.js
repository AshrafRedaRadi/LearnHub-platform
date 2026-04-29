import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

async function syncOAuthWithBackend({ user, account, profile }) {
  const provider = account?.provider;
  if (provider !== "github" && provider !== "google") return true;

  try {
    const oauthId =
      provider === "google"
        ? String(profile?.sub || account.providerAccountId)
        : String(profile?.id || account.providerAccountId);
    const displayName =
      provider === "google"
        ? user.name || profile?.name
        : user.name || profile?.login;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          email: user.email,
          oauthProvider: provider,
          oauthId,
          avatar: user.image,
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      account._backendToken = data.data.token;
      account._backendUser = data.data;
    }
  } catch (err) {
    console.error("OAuth backend sync failed:", err);
  }
  return true;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      return syncOAuthWithBackend({ user, account, profile });
    },

    async jwt({ token, account, user }) {
      // On first sign-in, persist our backend JWT
      if (account?._backendToken) {
        token.backendToken = account._backendToken;
        token.backendUser = account._backendUser;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose our backend JWT and user data to the client session
      if (token.backendToken) {
        session.backendToken = token.backendToken;
        session.backendUser = token.backendUser;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  trustHost: true,
});
