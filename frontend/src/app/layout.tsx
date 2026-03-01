import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Babypakka.no — Lei babyutstyr tilpasset barnets alder',
    template: '%s | Babypakka.no',
  },
  description: 'Abonnementstjeneste for babyutstyr. Lei alderstilpassede utstyrspakker for baby og smabarn.',
  metadataBase: new URL('https://babypakka.no'),
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'Babypakka.no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
