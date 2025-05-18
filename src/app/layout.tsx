
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import DynamicFavicon from '@/components/dynamic-favicon'; // Import the new component

export const metadata: Metadata = {
  title: 'KATAMA POS',
  description: 'Aplikasi Point of Sale KATAMA untuk usaha kecil dan menengah',
  // You can still declare a default static favicon here if you have one in /public
  // e.g., icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased font-sans`}>
        <DynamicFavicon /> {/* Add the DynamicFavicon component here */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
