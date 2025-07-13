import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your AI Teacher",
  description: "Personalized AI learning companions for every subject",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClerkProvider appearance={{ 
          variables: { 
            colorPrimary: '#B0CCDA',
            colorBackground: '#F5FAFC',
            colorInputBackground: '#FFFFFF',
            colorText: '#1C1C1E',
            colorTextSecondary: '#5B6A7C',
            colorSuccess: '#00BFA6',
            colorDanger: '#FF6B6B',
            borderRadius: '0.75rem'
          }
        }}>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
