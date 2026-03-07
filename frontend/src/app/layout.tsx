import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import JsonLd from '@/components/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Babypakka.no – Lei babyutstyr tilpasset barnets alder',
    template: '%s | Babypakka.no',
  },
  description: 'Abonnementstjeneste for babyutstyr. Lei alderstilpassede utstyrspakker for baby og småbarn. Nyfødt til 2 år.',
  metadataBase: new URL('https://babypakka.no'),
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    siteName: 'Babypakka.no',
  },
  twitter: {
    card: 'summary',
    site: '@babypakka',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: '/',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Babypakka',
  url: 'https://babypakka.no',
  email: 'hei@babypakka.no',
  description: 'Abonnementstjeneste for babyutstyr i Norge. Lei alderstilpassede utstyrspakker for baby og småbarn.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Oslo',
    addressCountry: 'NO',
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
        <JsonLd data={organizationJsonLd} />
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
