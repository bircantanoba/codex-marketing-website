import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Starter',
  description: 'Next.js App Router marketing starter with admin CMS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
