import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../components/AuthProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientWrapper from "../components/ClientWrapper";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import OAuthBridge from "../components/OAuthBridge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata = {
  title: "LearnHub - Online Course Platform",
  description: "Learn and grow with our premium online courses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col">
        {/* SessionProvider must wrap everything for NextAuth to work */}
        <SessionProviderWrapper>
          <ThemeProvider>
            <AuthProvider>
              {/* OAuthBridge must be inside AuthProvider to access its context */}
              <OAuthBridge />
              <Navbar />
              <ClientWrapper>
                {children}
              </ClientWrapper>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
