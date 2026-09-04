import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/providers/cart-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollToTop } from "@/components/shared/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SAVOR — Taste Beyond Ordinary",
    template: "%s | SAVOR",
  },
  description:
    "Discover flavors crafted with passion, fresh ingredients, and unforgettable experiences. Order online or reserve your table at SAVOR.",
  keywords: [
    "restaurant",
    "food ordering",
    "fine dining",
    "table reservation",
    "Indian cuisine",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SAVOR",
    title: "SAVOR — Taste Beyond Ordinary",
    description:
      "Discover flavors crafted with passion, fresh ingredients, and unforgettable experiences.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <ToastProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileNav />
                <ScrollToTop />
              </ToastProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
