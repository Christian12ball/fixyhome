import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixyHome - Trouvez votre artisan de confiance",
  description: "Plateforme de mise en relation entre clients et artisans",
  charset: "utf-8",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/fixyhome-logo.svg', sizes: '200x60', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/fixyhome-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <style>{`
          /* Styles pour les barres de défilement personnalisées */
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          
          .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 4px;
          }
          
          .scrollbar-track-gray-100::-webkit-scrollbar-track {
            background-color: #f3f4f6;
            border-radius: 4px;
          }
          
          .hover\\:scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
            background-color: #9ca3af;
          }
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 3px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background-color: #f3f4f6;
            border-radius: 3px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16`}
      >
        <ProfileProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
