import './globals.css'; // This should be mostly empty or contain minimal global styles
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Truecaller SSO App',
  description: 'Next.js app with Truecaller SSO integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}