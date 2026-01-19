import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EducaBank - Cartão Futuro Escolar | Governo Federal",
  description: "Programa oficial de auxílio para material escolar e volta às aulas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
