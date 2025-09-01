import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kareem Fuad Dream Interpretations | تفسير الأحلام",
  description: "Islamic dream interpretation service by Kareem Fuad. Submit your dreams for interpretation based on Islamic teachings.",
  keywords: "dream interpretation, Islamic dreams, تفسير الأحلام, Kareem Fuad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lateef:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${amiri.className} bg-islamic-pattern min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
