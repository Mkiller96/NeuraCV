import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuraCV - Crea tu CV profesional con IA en minutos",
  description:
    "Genera un CV profesional optimizado para ATS con inteligencia artificial. Olvídate de plantillas aburridas, consigue más entrevistas con NeuraCV.",
  keywords: [
    "CV",
    "currículum",
    "IA",
    "inteligencia artificial",
    "crear CV",
    "CV profesional",
    "ATS",
    "búsqueda de empleo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
