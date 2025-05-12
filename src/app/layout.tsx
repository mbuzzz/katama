import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans({ 
  variable: '--font-geist-sans',
  subsets: ['latin'], // Subsets might be optional or handled differently by geist/font
});

const geistMono = GeistMono({ 
  variable: '--font-geist-mono',
  subsets: ['latin'], // Subsets might be optional or handled differently by geist/font
});

export const metadata: Metadata = {
  title: 'TokoLite POS',
  description: 'Point of Sale application for small businesses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
