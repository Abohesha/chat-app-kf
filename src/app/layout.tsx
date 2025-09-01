import type { Metadata } from "next";
import { Amiri, Lateef } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-amiri',
});

const lateef = Lateef({
  subsets: ['latin', 'arabic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-lateef',
});

export const metadata: Metadata = {
  title: "Kareem Fuad Dream Interpretations | تفسير الأحلام",
  description: "Islamic dream interpretation service by Kareem Fuad. Submit your dreams for interpretation based on Islamic teachings.",
  keywords: "dream interpretation, Islamic dreams, تفسير الأحلام, Kareem Fuad",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${amiri.className} ${lateef.variable} bg-islamic-pattern min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
