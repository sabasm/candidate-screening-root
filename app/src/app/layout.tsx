import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "Candidate Screening Tool",
 description: "LLM-powered candidate screening and scoring system",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
   <html lang="en" className="dark:bg-gray-900 dark:text-gray-100" suppressHydrationWarning>
     <body className={`${inter.className} bg-background text-foreground`}>{children}</body>
   </html>
 );
}


