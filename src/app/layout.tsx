import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '~/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Niks Birzgalis',
  description: 'Delivering solutions to ever-evolving challenges.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
